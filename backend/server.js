// server.js — Entry point for the SkillForge backend
// This file starts the HTTP server and connects to MongoDB

const app = require("./app");
const connectDB = require("./config/db");
const { configureStreamPermissions } = require("./utils/stream.utils");
require("dotenv").config();

const PORT = process.env.PORT || 5000;

// Connect to MongoDB, configure Stream permissions, then start the server
connectDB().then(async () => {
  await configureStreamPermissions();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
