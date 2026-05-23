// utils/jwt.utils.js — Helper functions for JWT tokens

const jwt = require("jsonwebtoken");

/**
 * Generate a signed JWT token for a user
 * @param {string} userId - The MongoDB _id of the user
 * @returns {string} Signed JWT token
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

/**
 * Verify a JWT token and return its decoded payload
 * @param {string} token
 * @returns {object} Decoded payload (contains id, iat, exp)
 */
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { generateToken, verifyToken };
