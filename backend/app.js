// // app.js — Express application setup
// // All middleware and routes are registered here

// const express = require("express");
// const cors = require("cors");
// const morgan = require("morgan");
// require("dotenv").config();

// const authRoutes = require("./routes/auth.routes");
// const courseRoutes = require("./routes/course.routes");
// const userRoutes = require("./routes/user.routes");
// const peerRoutes = require("./routes/peer.routes");
// const { errorHandler, notFound } = require("./middleware/error.middleware");

// const app = express();

// // ─── Middleware ───────────────────────────────────────────────────────────────

// // Allow requests from the React frontend
// app.use(
//   cors({
//     origin: process.env.CLIENT_URL || "http://localhost:5173",
//     credentials: true,
//   })
// );

// // Parse incoming JSON request bodies
// app.use(express.json());

// // Log HTTP requests in development mode
// if (process.env.NODE_ENV === "development") {
//   app.use(morgan("dev"));
// }

// // ─── Routes ───────────────────────────────────────────────────────────────────

// app.use("/api/auth", authRoutes);
// app.use("/api/courses", courseRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/peers", peerRoutes);

// // Health check route
// app.get("/api/health", (req, res) => {
//   res.json({ status: "OK", message: "SkillForge API is running" });
// });

// // ─── Error Handlers (must be last) ───────────────────────────────────────────

// app.use(notFound);
// app.use(errorHandler);

// module.exports = app;

// app.js — Express application setup
// All middleware and routes are registered here

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const authRoutes = require("./routes/auth.routes");
const courseRoutes = require("./routes/course.routes");
const userRoutes = require("./routes/user.routes");
const peerRoutes = require("./routes/peer.routes");
const instructorRoutes = require("./routes/instructor.routes");
const { errorHandler, notFound } = require("./middleware/error.middleware");

const app = express();

// ─── Middleware 

// Allow requests from the React frontend
app.use(
  cors({
    origin: [process.env.CLIENT_URL || "http://localhost:5173",
    "https://skill-forge-new.vercel.app"],
    credentials: true,
  })
);

// Parse incoming JSON request bodies
app.use(express.json());

// Log HTTP requests in development mode
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ─── Routes 

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/users", userRoutes);
app.use("/api/peers", peerRoutes);
app.use("/api/instructor", instructorRoutes);

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "SkillForge API is running" });
});

// ─── Error Handlers 

app.use(notFound);
app.use(errorHandler);

module.exports = app;