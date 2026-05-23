// middleware/auth.middleware.js — Protect routes with JWT
//
// Usage: Add `protect` to any route that requires login
// Usage: Add `restrictTo("instructor", "admin")` to role-gated routes

const { verifyToken } = require("../utils/jwt.utils");
const User = require("../models/User.model");

/**
 * Middleware: Verify JWT and attach user to req.user
 * Clients must send: Authorization: Bearer <token>
 */
const protect = async (req, res, next) => {
  try {
    // 1. Check if Authorization header exists and starts with "Bearer"
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized. No token provided." });
    }

    // 2. Extract the token
    const token = authHeader.split(" ")[1];

    // 3. Verify the token
    const decoded = verifyToken(token);

    // 4. Find the user in DB (exclude password)
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User no longer exists." });
    }

    // 5. Attach user to request object for use in route handlers
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token is invalid or expired." });
  }
};

/**
 * Middleware factory: Restrict route access to specific roles
 * @param  {...string} roles - Allowed roles e.g. "admin", "instructor"
 */
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Required role: ${roles.join(" or ")}`,
      });
    }
    next();
  };
};

module.exports = { protect, restrictTo };
