// controllers/user.controller.js — User profile management

const User = require("../models/User.model");

/**
 * @desc   Get user profile by ID
 * @route  GET /api/users/:id
 * @access Private
 */
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("enrolledCourses.course", "title thumbnail category level");

    if (!user) return res.status(404).json({ message: "User not found." });

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc   Update user profile (name, avatar)
 * @route  PUT /api/users/profile
 * @access Private
 */
const updateProfile = async (req, res) => {
  try {
    const { name, avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, avatar },
      { new: true, runValidators: true }
    ).select("-password");

    res.json({ message: "Profile updated!", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc   Get XP leaderboard (top 10 students)
 * @route  GET /api/users/leaderboard
 * @access Public
 */
const getLeaderboard = async (req, res) => {
  try {
    const topStudents = await User.find({ role: "student" })
      .select("name avatar xp badges")
      .sort({ xp: -1 })
      .limit(10);

    res.json({ leaderboard: topStudents });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUserProfile, updateProfile, getLeaderboard };
