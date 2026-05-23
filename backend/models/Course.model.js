// models/Course.model.js — MongoDB schema for a course

const mongoose = require("mongoose");

const moduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  // URL to video (YouTube, Vimeo, etc.)
  videoUrl: { type: String, default: "" },
  duration: { type: Number, default: 0 }, // in minutes
  order: { type: Number, required: true },
  // Skills this module teaches (used for skill metric updates)
  skills: [{ type: String }],
});

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Course title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Course description is required"],
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: 0,
    },
    thumbnail: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      enum: ["Web Development", "Mobile", "Data Science", "DevOps", "Design", "Other"],
      default: "Web Development",
    },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    tags: [{ type: String }],
    // Ordered list of modules inside this course
    modules: [moduleSchema],
    // Students enrolled (array of user IDs)
    studentsEnrolled: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    rating: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
