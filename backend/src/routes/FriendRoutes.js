import express from "express";
import { sendFriendRequest, acceptFriendRequest, rejectFriendRequest, getFriendList, getPendingRequests } from "../controllers/FriendController.js";
import protectRoute from "../middleware/protectRoute.js";

const FriendRouter = express.Router();

FriendRouter.post('/send', protectRoute, sendFriendRequest);
FriendRouter.post('/accept', protectRoute, acceptFriendRequest);
FriendRouter.post('/reject', protectRoute, rejectFriendRequest);
FriendRouter.get('/list/:userId', getFriendList);
FriendRouter.get('/requests/pending', protectRoute, getPendingRequests);

export default FriendRouter;
