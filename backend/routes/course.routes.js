// routes/course.routes.js — Course CRUD and enrollment routes

const express = require("express");
const router = express.Router();
const {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  enrollInCourse,
  completeModule,
} = require("../controllers/course.controller");
const { protect, restrictTo } = require("../middleware/auth.middleware");

// GET  /api/courses       — public list
// POST /api/courses       — instructors only
router
  .route("/")
  .get(getAllCourses)
  .post(protect, restrictTo("instructor", "admin"), createCourse);

// GET /api/courses/:id       — public
// PUT /api/courses/:id       — instructor/admin only
router
  .route("/:id")
  .get(getCourseById)
  .put(protect, restrictTo("instructor", "admin"), updateCourse);

// POST /api/courses/:id/enroll — students only
router.post("/:id/enroll", protect, enrollInCourse);

// POST /api/courses/:id/modules/:moduleIndex/complete
router.post("/:id/modules/:moduleIndex/complete", protect, completeModule);

module.exports = router;
