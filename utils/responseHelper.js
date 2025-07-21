/**
 * Create standardized success response
 */
const createResponse = (message, data = null, meta = null) => {
  const response = {
    status: 'success',
    message,
    timestamp: new Date().toISOString()
  };

  if (data !== null) {
    response.data = data;
  }

  if (meta !== null) {
    response.meta = meta;
  }

  return response;
};

/**
 * Create standardized error response
 */
const createErrorResponse = (message, errors = null, code = null) => {
  const response = {
    status: 'error',
    message,
    timestamp: new Date().toISOString()
  };

  if (errors !== null) {
    response.errors = errors;
  }

  if (code !== null) {
    response.code = code;
  }

  return response;
};

/**
 * Create paginated response
 */
const createPaginatedResponse = (message, data, pagination) => {
  return {
    status: 'success',
    message,
    data,
    pagination,
    timestamp: new Date().toISOString()
  };
};

module.exports = {
  createResponse,
  createErrorResponse,
  createPaginatedResponse
};