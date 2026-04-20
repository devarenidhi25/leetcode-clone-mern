import User from "../models/UserModel.js";
import UserSubmission from "../models/UserSubmissionModel.js";
import Problem from "../models/ProblemModel.js";

export const getUserStats = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Get total submissions
    const totalSubmissions = await UserSubmission.countDocuments({ userId });

    // Get successful submissions (solved problems)
    const solvedSubmissions = await UserSubmission.find({
      userId,
      'result.status': 'success'
    }).distinct('problemId');

    const solvedCount = solvedSubmissions.length;

    // Get difficulty breakdown
    const solvedProblems = await Problem.find({ _id: { $in: solvedSubmissions } });
    const difficultyBreakdown = {
      easy: 0,
      medium: 0,
      hard: 0
    };

    solvedProblems.forEach(problem => {
      difficultyBreakdown[problem.category]++;
    });

    // Get last 10 submissions
    const lastSubmissions = await UserSubmission.find({ userId })
      .populate('problemId', 'problem_name category')
      .sort({ submissionTime: -1 })
      .limit(10);

    res.status(200).json({
      username: user.username,
      profilePic: user.profilePic,
      totalProblems: solvedCount,
      totalSubmissions,
      difficultyBreakdown,
      streak: user.streak,
      lastSubmissions
    });
  } catch (error) {
    console.log("Error in getUserStats:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const getRecommendedProblems = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Get solved problems with their tags and categories
    const solvedSubmissions = await UserSubmission.find({
      userId,
      'result.status': 'success'
    }).distinct('problemId');

    const solvedProblems = await Problem.find({ _id: { $in: solvedSubmissions } });

    // Get user's tag preferences and difficulty level
    const tagFrequency = {};
    let maxDifficulty = 'easy';

    solvedProblems.forEach(problem => {
      problem.tags.forEach(tag => {
        tagFrequency[tag] = (tagFrequency[tag] || 0) + 1;
      });

      // Determine next difficulty level
      if (problem.category === 'easy') maxDifficulty = 'medium';
      else if (problem.category === 'medium') maxDifficulty = 'hard';
    });

    // Get top tags
    const topTags = Object.entries(tagFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(entry => entry[0]);

    // Find recommended problems: similar tags + next difficulty level
    let recommendedProblems = await Problem.find({
      _id: { $nin: solvedSubmissions },
      tags: { $in: topTags },
      category: maxDifficulty
    }).limit(5);

    // If not enough, fill with problems of same difficulty but different tags
    if (recommendedProblems.length < 5) {
      const additionalProblems = await Problem.find({
        _id: { $nin: solvedSubmissions },
        category: maxDifficulty
      }).limit(5 - recommendedProblems.length);

      recommendedProblems = [...recommendedProblems, ...additionalProblems];
    }

    res.status(200).json({ recommendedProblems });
  } catch (error) {
    console.log("Error in getRecommendedProblems:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const updateStreak = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if user solved a problem today
    const todaySolved = await UserSubmission.findOne({
      userId,
      'result.status': 'success',
      submissionTime: { $gte: today }
    });

    if (!todaySolved) {
      return res.status(200).json({ message: "No problem solved today", streak: user.streak });
    }

    // Check last solved date
    if (user.lastSolvedDate) {
      const lastSolved = new Date(user.lastSolvedDate);
      lastSolved.setHours(0, 0, 0, 0);

      const diffDays = Math.floor((today - lastSolved) / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        // Already solved today
        return res.status(200).json({ message: "Already counted today", streak: user.streak });
      } else if (diffDays === 1) {
        // Streak continues
        user.streak += 1;
      } else {
        // Streak reset
        user.streak = 1;
      }
    } else {
      // First time solving
      user.streak = 1;
    }

    user.lastSolvedDate = today;
    await user.save();

    res.status(200).json({ message: "Streak updated", streak: user.streak });
  } catch (error) {
    console.log("Error in updateStreak:", error.message);
    res.status(500).json({ error: error.message });
  }
};
