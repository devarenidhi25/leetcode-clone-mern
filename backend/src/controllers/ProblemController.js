import Problem from "../models/ProblemModel.js";
import UserSubmission from "../models/UserSubmissionModel.js";

export const addProblem=async(req,res)=>{
   try {
    const {problem_name,problem_desc,problem_examples,constraints,category,tags,solution_skeleton,hints,testcases}=req.body;
    const name=await Problem.findOne({problem_name})
    if(name){ 
        return res.status(400).json({error:"problem already exists"})
    }      
    const newProblem=new Problem({problem_name,problem_desc,problem_examples,constraints,category,tags,solution_skeleton,hints,testcases});
    if(newProblem){
        await newProblem.save();
        res.status(201).json({
            _id:newProblem._id,
            problem_name:newProblem.problem_name,
            problem_desc:newProblem.problem_desc,
            problem_examples:newProblem.problem_examples,
            constraints:newProblem.constraints,
            category:newProblem.category,
            tags:newProblem.tags,
            solution_skeleton:newProblem.solution_skeleton,
            hints:newProblem.hints,
            testcases:newProblem.testcases
        })
    }
    else{
        res.status(400).json({error:"INVALID PROBLEM DATA"})
    }
   } catch (error) {
    console.log("error in PROBLEM CONTROLLER",error.message)
    res.status(500).json({ error:error.message} )
   }
}

export const getProblems = async (req, res) => {
    try {
      const { difficulty, tags, search, userId } = req.query;
      let query = {};

      // Filter by difficulty
      if (difficulty && difficulty !== 'all') {
        query.category = difficulty;
      }

      // Filter by tags
      if (tags) {
        const tagArray = Array.isArray(tags) ? tags : [tags];
        query.tags = { $in: tagArray };
      }

      // Search by problem name
      if (search) {
        query.problem_name = { $regex: search, $options: 'i' };
      }

      let problems = await Problem.find(query);

      // Get solved status if userId is provided
      if (userId) {
        const solvedProblems = await UserSubmission.find({
          userId,
          'result.status': 'success'
        }).distinct('problemId');

        problems = problems.map(problem => ({
          ...problem.toObject(),
          isSolved: solvedProblems.includes(problem._id.toString())
        }));
      }

      res.status(200).json(problems);
    } catch (error) {
      console.log("error in retrieving problems", error.message);
      res.status(500).json({ error: error.message });
    }
  };

export const getProblemById = async (req, res) => {
    try {
      const { id } = req.params;
      const problem = await Problem.findById(id);
      if (!problem) {
        return res.status(404).json({ error: "Problem not found" });
      }
      res.status(200).json(problem);
    } catch (error) {
      console.log("error in retrieving problem by ID", error.message);
      res.status(500).json({ error: error.message });
    }
  };

export const getAllTags = async (req, res) => {
    try {
      const tags = await Problem.distinct('tags');
      res.status(200).json({ tags: tags.sort() });
    } catch (error) {
      console.log("error in retrieving tags", error.message);
      res.status(500).json({ error: error.message });
    }
  };