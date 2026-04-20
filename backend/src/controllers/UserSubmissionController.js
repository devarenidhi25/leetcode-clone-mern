import UserSubmission from "../models/UserSubmissionModel.js";
import User from "../models/UserModel.js";

export const submitCode=async(req,res)=>{
    try {
        const {userId,problemId,code,language,result,submissionTime}=req.body;
        const newSubmission=new UserSubmission({
            userId,problemId,code,language,result,submissionTime,
        })
        if(newSubmission){
            await newSubmission.save();

            // If successful, update user's solved problems and streak
            if (result.status === 'success') {
              const user = await User.findById(userId);
              
              // Add to solved problems if not already there
              if (!user.solvedProblems.includes(problemId)) {
                user.solvedProblems.push(problemId);
              }

              // Update streak
              const today = new Date();
              today.setHours(0, 0, 0, 0);

              if (user.lastSolvedDate) {
                const lastSolved = new Date(user.lastSolvedDate);
                lastSolved.setHours(0, 0, 0, 0);

                const diffDays = Math.floor((today - lastSolved) / (1000 * 60 * 60 * 24));

                if (diffDays === 1) {
                  user.streak += 1;
                } else if (diffDays > 1) {
                  user.streak = 1;
                }
              } else {
                user.streak = 1;
              }

              user.lastSolvedDate = today;
              await user.save();
            }

            res.status(201).json({
                _id:newSubmission._id,
                userId:newSubmission.userId,
                problemId: newSubmission.problemId,
                code: newSubmission.code,
                language:newSubmission.language,
                result:newSubmission.result,
                submissionTime:newSubmission.submissionTime,   
            })
        }
        else{
            res.status(400).json({error:"INVALID PROBLEM DATA"});
        }
    } catch (error) {
        console.log("error in submitCode:", error.message);
        res.status(500).json({ error: error.message });
    }
}

export const getSubmission=async(req,res)=>{
    try {
        const {userId,probId}=req.params;
        const submissions=await UserSubmission.find({
            userId:userId,
            problemId:probId,
        }).exec();
        res.status(201).json(submissions)
    } catch (error) {
      console.log("error in getting submissions",error.message);
      res.status(500).json({ error: error.message });
    }
}

export const getAllOfParticularUser=async(req,res)=>{
    try {
        const {userId}=req.params;
        const submissions=await UserSubmission.find({
            userId:userId
        }).populate('problemId', 'problem_name category').exec();
        res.status(201).json(submissions)
    } catch (error) {
      console.log("error in getting submissions",error.message);
      res.status(500).json({ error: error.message });
    }
}
