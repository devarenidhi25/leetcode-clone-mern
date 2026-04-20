import express from "express";
import { getUserStats, getRecommendedProblems, updateStreak } from "../controllers/UserController.js";
import protectRoute from "../middleware/protectRoute.js";

const UserRouter = express.Router();

UserRouter.get('/stats/:userId', getUserStats);
UserRouter.get('/recommendations', protectRoute, getRecommendedProblems);
UserRouter.post('/streak/update', protectRoute, updateStreak);

export default UserRouter;
