import FriendRequest from "../models/FriendRequestModel.js";
import User from "../models/UserModel.js";

export const sendFriendRequest = async (req, res) => {
  try {
    const { receiverId } = req.body;
    const senderId = req.user._id;

    if (senderId.toString() === receiverId) {
      return res.status(400).json({ error: "Cannot send request to yourself" });
    }

    // Check if request already exists
    const existingRequest = await FriendRequest.findOne({
      sender: senderId,
      receiver: receiverId,
      status: 'pending'
    });

    if (existingRequest) {
      return res.status(400).json({ error: "Request already sent" });
    }

    // Check if already friends
    const user = await User.findById(senderId);
    if (user.friends.includes(receiverId)) {
      return res.status(400).json({ error: "Already friends" });
    }

    const newRequest = new FriendRequest({
      sender: senderId,
      receiver: receiverId,
      status: 'pending'
    });

    await newRequest.save();
    res.status(201).json({ message: "Friend request sent", request: newRequest });
  } catch (error) {
    console.log("Error in sendFriendRequest:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const acceptFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.body;
    const userId = req.user._id;

    const friendRequest = await FriendRequest.findById(requestId);

    if (!friendRequest) {
      return res.status(404).json({ error: "Request not found" });
    }

    if (friendRequest.receiver.toString() !== userId.toString()) {
      return res.status(403).json({ error: "Not authorized to accept this request" });
    }

    // Add to friends lists
    await User.findByIdAndUpdate(userId, {
      $addToSet: { friends: friendRequest.sender }
    });

    await User.findByIdAndUpdate(friendRequest.sender, {
      $addToSet: { friends: userId }
    });

    // Update request status
    friendRequest.status = 'accepted';
    await friendRequest.save();

    res.status(200).json({ message: "Friend request accepted", request: friendRequest });
  } catch (error) {
    console.log("Error in acceptFriendRequest:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const rejectFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.body;
    const userId = req.user._id;

    const friendRequest = await FriendRequest.findById(requestId);

    if (!friendRequest) {
      return res.status(404).json({ error: "Request not found" });
    }

    if (friendRequest.receiver.toString() !== userId.toString()) {
      return res.status(403).json({ error: "Not authorized to reject this request" });
    }

    friendRequest.status = 'rejected';
    await friendRequest.save();

    res.status(200).json({ message: "Friend request rejected" });
  } catch (error) {
    console.log("Error in rejectFriendRequest:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const getFriendList = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId)
      .populate('friends', 'username profilePic email')
      .select('friends');

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ friends: user.friends });
  } catch (error) {
    console.log("Error in getFriendList:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const getPendingRequests = async (req, res) => {
  try {
    const userId = req.user._id;
    const requests = await FriendRequest.find({
      receiver: userId,
      status: 'pending'
    }).populate('sender', 'username profilePic email');

    res.status(200).json({ requests });
  } catch (error) {
    console.log("Error in getPendingRequests:", error.message);
    res.status(500).json({ error: error.message });
  }
};
