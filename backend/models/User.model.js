// models/User.model.js — MongoDB schema for a user
// Stores auth info, enrolled courses, and skill metrics for peer matching

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const skillMetricSchema = new mongoose.Schema({
  // e.g., "React", "Node.js", "MongoDB"
  skill: { type: String, required: true },
  // Score from 0–100 based on quiz results and module completions
  score: { type: Number, default: 0, min: 0, max: 100 },
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      // Never send password in API responses
      select: false,
    },
    role: {
      type: String,
      enum: ["student", "instructor", "admin"],
      default: "student",
    },
    avatar: {
      type: String,
      default: "",
    },
    // Courses the user has purchased
    enrolledCourses: [
      {
        course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
        enrolledAt: { type: Date, default: Date.now },
        // Tracks which module index the student is on
        progress: { type: Number, default: 0 },
        completedModules: [{ type: Number }],
      },
    ],
    // Skill metrics updated as user completes modules (used for peer matching)
    skillMetrics: [skillMetricSchema],
    // XP points for gamification
    xp: { type: Number, default: 0 },
    // Badges earned
    badges: [{ type: String }],
    // Stream Chat user token (generated on login)
    streamToken: { type: String, default: "" },
  },
  { timestamps: true }
);

// Hash password before saving to DB
userSchema.pre("save", async function (next) {
  // Only hash if password was modified (not on other updates)
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare entered password with hashed password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
