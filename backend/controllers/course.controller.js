// controllers/course.controller.js — Course CRUD and enrollment

const Course = require("../models/Course.model");
const User = require("../models/User.model");

/**
 * @desc   Get all published courses (with optional filters)
 * @route  GET /api/courses
 * @access Public
 */
const getAllCourses = async (req, res) => {
  try {
    const { category, level, search } = req.query;

    // Build a filter object dynamically
    const filter = { isPublished: true };
    if (category) filter.category = category;
    if (level) filter.level = level;
    if (search) filter.title = { $regex: search, $options: "i" }; // case-insensitive search

    const courses = await Course.find(filter)
      .populate("instructor", "name avatar")
      .sort({ createdAt: -1 });

    res.json({ courses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc   Get a single course by ID
 * @route  GET /api/courses/:id
 * @access Public
 */
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("instructor", "name avatar")
      .populate("studentsEnrolled", "name avatar");

    if (!course) {
      return res.status(404).json({ message: "Course not found." });
    }

    res.json({ course });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc   Create a new course
 * @route  POST /api/courses
 * @access Private (Instructor/Admin only)
 */
const createCourse = async (req, res) => {
  try {
    const course = await Course.create({
      ...req.body,
      instructor: req.user._id,
    });

    res.status(201).json({ message: "Course created!", course });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc   Update a course
 * @route  PUT /api/courses/:id
 * @access Private (Instructor/Admin only)
 */
const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) return res.status(404).json({ message: "Course not found." });

    // Only the course instructor or admin can update
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to update this course." });
    }

    const updated = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return the updated document
      runValidators: true,
    });

    res.json({ message: "Course updated!", course: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc   Enroll in a course (simulates payment — in production use Stripe)
 * @route  POST /api/courses/:id/enroll
 * @access Private
 */
const enrollInCourse = async (req, res) => {
  try {
    if (req.user.role === "instructor") {
      return res.status(403).json({
        message: "Instructors cannot enroll in courses. View student progress on your dashboard.",
      });
    }

    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found." });

    const user = await User.findById(req.user._id);

    // Check if already enrolled
    const alreadyEnrolled = user.enrolledCourses.some(
      (e) => e.course.toString() === course._id.toString()
    );
    if (alreadyEnrolled) {
      return res.status(400).json({ message: "Already enrolled in this course." });
    }

    // Add course to user's enrolledCourses
    user.enrolledCourses.push({ course: course._id });

    // Award XP for enrolling
    user.xp += 50;

    await user.save();

    // Add user to course's studentsEnrolled
    course.studentsEnrolled.push(user._id);
    await course.save();

    res.json({ message: "Enrolled successfully! +50 XP", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc   Mark a module as complete and update skill metrics
 * @route  POST /api/courses/:id/modules/:moduleIndex/complete
 * @access Private
 */
const completeModule = async (req, res) => {
  try {
    const { id: courseId, moduleIndex } = req.params;
    const index = parseInt(moduleIndex);

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found." });

    const module = course.modules[index];
    if (!module) return res.status(404).json({ message: "Module not found." });

    const user = await User.findById(req.user._id);

    // Find the enrollment entry
    const enrollment = user.enrolledCourses.find(
      (e) => e.course.toString() === courseId.toString()
    );
    if (!enrollment) return res.status(400).json({ message: "Not enrolled in this course." });

    // Avoid double-counting
    if (enrollment.completedModules.includes(index)) {
      return res.status(400).json({ message: "Module already completed." });
    }

    // Mark module as complete
    enrollment.completedModules.push(index);
    enrollment.progress = Math.round(
      (enrollment.completedModules.length / course.modules.length) * 100
    );

    // Update skill metrics for each skill taught in this module
    module.skills.forEach((skill) => {
      const existing = user.skillMetrics.find((m) => m.skill === skill);
      if (existing) {
        // Increase score (cap at 100)
        existing.score = Math.min(existing.score + 15, 100);
      } else {
        user.skillMetrics.push({ skill, score: 15 });
      }
    });

    // Award XP for completing module
    user.xp += 100;

    // Award badges based on XP milestones
    if (user.xp >= 500 && !user.badges.includes("Rising Star")) {
      user.badges.push("Rising Star");
    }
    if (user.xp >= 1000 && !user.badges.includes("Knowledge Seeker")) {
      user.badges.push("Knowledge Seeker");
    }

    await user.save();

    res.json({
      message: `Module "${module.title}" completed! +100 XP`,
      progress: enrollment.progress,
      skillMetrics: user.skillMetrics,
      xp: user.xp,
      badges: user.badges,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  enrollInCourse,
  completeModule,
};
