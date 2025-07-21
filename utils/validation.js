const Joi = require('joi');

// Product Validation Schema
const productSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(1)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Product name is required',
      'string.min': 'Product name must be at least 1 character',
      'string.max': 'Product name cannot exceed 100 characters',
      'any.required': 'Product name is required'
    }),
  
  description: Joi.string()
    .trim()
    .min(1)
    .max(500)
    .required()
    .messages({
      'string.empty': 'Product description is required',
      'string.min': 'Product description must be at least 1 character',
      'string.max': 'Product description cannot exceed 500 characters',
      'any.required': 'Product description is required'
    }),
  
  price: Joi.number()
    .positive()
    .precision(2)
    .required()
    .messages({
      'number.base': 'Price must be a number',
      'number.positive': 'Price must be a positive number',
      'any.required': 'Product price is required'
    }),
  
  stock_quantity: Joi.number()
    .integer()
    .min(0)
    .required()
    .messages({
      'number.base': 'Stock quantity must be a number',
      'number.integer': 'Stock quantity must be an integer',
      'number.min': 'Stock quantity cannot be negative',
      'any.required': 'Stock quantity is required'
    })
});

// Order Item Schema
const orderItemSchema = Joi.object({
  product_id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Product ID must be a valid MongoDB ObjectId',
      'any.required': 'Product ID is required'
    }),
  
  quantity: Joi.number()
    .integer()
    .min(1)
    .required()
    .messages({
      'number.base': 'Quantity must be a number',
      'number.integer': 'Quantity must be an integer',
      'number.min': 'Quantity must be at least 1',
      'any.required': 'Quantity is required'
    })
});

// Order Validation Schema
const orderSchema = Joi.object({
  customer_name: Joi.string()
    .trim()
    .min(1)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Customer name is required',
      'string.min': 'Customer name must be at least 1 character',
      'string.max': 'Customer name cannot exceed 100 characters',
      'any.required': 'Customer name is required'
    }),
  
  products: Joi.array()
    .items(orderItemSchema)
    .min(1)
    .required()
    .messages({
      'array.min': 'At least one product is required',
      'any.required': 'Products array is required'
    })
});

// Pagination Validation Schema
const paginationSchema = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1)
    .messages({
      'number.base': 'Page must be a number',
      'number.integer': 'Page must be an integer',
      'number.min': 'Page must be at least 1'
    }),
  
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(10)
    .messages({
      'number.base': 'Limit must be a number',
      'number.integer': 'Limit must be an integer',
      'number.min': 'Limit must be at least 1',
      'number.max': 'Limit cannot exceed 100'
    })
});

// Validation Functions
const validateProduct = (data) => {
  return productSchema.validate(data, { abortEarly: false });
};

const validateOrder = (data) => {
  return orderSchema.validate(data, { abortEarly: false });
};

const validatePagination = (data) => {
  return paginationSchema.validate(data, { abortEarly: false });
};

module.exports = {
  validateProduct,
  validateOrder,
  validatePagination
};