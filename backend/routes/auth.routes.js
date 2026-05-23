// routes/auth.routes.js — Authentication routes

const express = require("express");
const router = express.Router();
const { register, login, getMe, getStreamToken } = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth.middleware");

// POST /api/auth/register
router.post("/register", register);

// POST /api/auth/login
router.post("/login", login);

// GET /api/auth/me — requires login
router.get("/me", protect, getMe);

// GET /api/auth/stream-token — fresh Stream Chat token
router.get("/stream-token", protect, getStreamToken);

module.exports = router;
