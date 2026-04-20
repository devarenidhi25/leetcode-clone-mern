import express from "express"
import { addProblem, getProblemById, getProblems, getAllTags } from "../controllers/ProblemController.js";
const ProblemRouter=express.Router();
ProblemRouter.post('/add',addProblem);
ProblemRouter.get('/tags/all', getAllTags);
ProblemRouter.get('/',getProblems);
ProblemRouter.get('/:id',getProblemById);
export default ProblemRouter;