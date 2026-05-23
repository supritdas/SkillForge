// routes/instructor.routes.js

const express = require("express");
const router = express.Router();
const { getMyCourses } = require("../controllers/instructor.controller");
const { protect, restrictTo } = require("../middleware/auth.middleware");

// GET /api/instructor/courses — instructor sees their courses + student stats
router.get("/courses", protect, restrictTo("instructor", "admin"), getMyCourses);

module.exports = router;
