import express from "express";
import { executeCode } from "../controllers/CodeExecutionController.js";

const CodeExecutionRouter = express.Router();

// POST /execute - Execute code
CodeExecutionRouter.post('/execute', executeCode);

export default CodeExecutionRouter;
