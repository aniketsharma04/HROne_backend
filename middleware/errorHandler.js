const { createErrorResponse } = require('../utils/responseHelper');

const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(error => error.message);
    return res.status(400).json(createErrorResponse(
      'Validation failed',
      errors,
      'VALIDATION_ERROR'
    ));
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field} already exists`;
    return res.status(409).json(createErrorResponse(
      message,
      [message],
      'DUPLICATE_KEY_ERROR'
    ));
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json(createErrorResponse(
      'Invalid ID format',
      ['The provided ID is not valid'],
      'CAST_ERROR'
    ));
  }

  // MongoDB connection error
  if (err.name === 'MongoError') {
    return res.status(500).json(createErrorResponse(
      'Database error occurred',
      ['Please try again later'],
      'DATABASE_ERROR'
    ));
  }

  // JWT errors (if you add authentication later)
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json(createErrorResponse(
      'Invalid token',
      ['Authentication failed'],
      'JWT_ERROR'
    ));
  }

  // Default server error
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json(createErrorResponse(
    message,
    statusCode === 500 ? ['Something went wrong on our end'] : [message],
    'INTERNAL_ERROR'
  ));
};

module.exports = errorHandler;