// controllers/auth.controller.js — Register and Login logic

const User = require("../models/User.model");
const { generateToken } = require("../utils/jwt.utils");
const { generateStreamToken, configureStreamPermissions } = require("../utils/stream.utils");

/**
 * @desc   Register a new user
 * @route  POST /api/auth/register
 * @access Public
 */
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered." });
    }

    // Create new user (password is hashed automatically via pre-save hook)
    const user = await User.create({ name, email, password, role });

    // Generate tokens
    const token = generateToken(user._id);
    const streamToken = generateStreamToken(user._id);

    res.status(201).json({
      message: "Registration successful!",
      token,
      streamToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        xp: user.xp,
        badges: user.badges,
        skillMetrics: user.skillMetrics,
        enrolledCourses: user.enrolledCourses,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc   Login an existing user
 * @route  POST /api/auth/login
 * @access Public
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email — include password for comparison
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Compare entered password with hashed password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Generate tokens
    const token = generateToken(user._id);
    const streamToken = generateStreamToken(user._id);

    res.json({
      message: "Login successful!",
      token,
      streamToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        xp: user.xp,
        badges: user.badges,
        skillMetrics: user.skillMetrics,
        enrolledCourses: user.enrolledCourses,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc   Get current logged-in user profile
 * @route  GET /api/auth/me
 * @access Private
 */
const getMe = async (req, res) => {
  try {
    // req.user is set by the protect middleware
    const user = await User.findById(req.user._id).populate(
      "enrolledCourses.course",
      "title thumbnail category level"
    );
    const streamToken = generateStreamToken(user._id);
    res.json({ user, streamToken });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc   Fresh Stream Chat token for the logged-in user
 * @route  GET /api/auth/stream-token
 * @access Private
 */
const getStreamToken = async (req, res) => {
  try {
    await configureStreamPermissions();
    const streamToken = generateStreamToken(req.user._id);
    if (!streamToken) {
      return res.status(503).json({ message: "Stream Chat is not configured on the server." });
    }
    res.json({ streamToken });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login, getMe, getStreamToken };
