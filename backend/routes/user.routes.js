// routes/user.routes.js — User profile routes

const express = require("express");
const router = express.Router();
const { getUserProfile, updateProfile, getLeaderboard } = require("../controllers/user.controller");
const { protect } = require("../middleware/auth.middleware");

// GET /api/users/leaderboard — public
router.get("/leaderboard", getLeaderboard);

// GET /api/users/:id — private
router.get("/:id", protect, getUserProfile);

// PUT /api/users/profile — private
router.put("/profile", protect, updateProfile);

module.exports = router;
