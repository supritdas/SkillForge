// controllers/instructor.controller.js
// Handles instructor-specific views: their courses + per-course student stats

const Course = require("../models/Course.model");
const User = require("../models/User.model");

/**
 * @desc   Get all courses created by the logged-in instructor,
 *         with student count and per-student progress for each course.
 * @route  GET /api/instructor/courses
 * @access Private (instructor/admin)
 */
const getMyCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user._id }).sort({
      createdAt: -1,
    });

    // For each course, find every enrolled student and their progress
    const coursesWithStats = await Promise.all(
      courses.map(async (course) => {
        // Find all users enrolled in this course
        const enrolledUsers = await User.find({
          "enrolledCourses.course": course._id,
        }).select("name avatar xp enrolledCourses");

        // Extract just the progress data for this specific course per student
        const studentStats = enrolledUsers.map((user) => {
          const enrollment = user.enrolledCourses.find(
            (e) => e.course.toString() === course._id.toString()
          );
          return {
            _id: user._id,
            name: user.name,
            avatar: user.avatar,
            xp: user.xp,
            progress: enrollment?.progress || 0,
            completedModules: enrollment?.completedModules?.length || 0,
            totalModules: course.modules.length,
          };
        });

        return {
          _id: course._id,
          title: course.title,
          description: course.description,
          price: course.price,
          category: course.category,
          level: course.level,
          isPublished: course.isPublished,
          thumbnail: course.thumbnail,
          totalModules: course.modules.length,
          studentCount: studentStats.length,
          students: studentStats,
          createdAt: course.createdAt,
        };
      })
    );

    res.json({ courses: coursesWithStats });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMyCourses };
