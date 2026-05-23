// middleware/error.middleware.js — Global error handlers
//
// notFound: Catches requests to undefined routes
// errorHandler: Central error handler — formats all errors into a consistent JSON shape

/**
 * 404 handler — called when no route matches
 */
const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Central error handler
 * Express calls this when next(error) is called from any route or middleware
 */
const errorHandler = (err, req, res, next) => {
  // Default to 500 if no status code was set
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    message: err.message,
    // Only show stack trace in development mode
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

module.exports = { notFound, errorHandler };
