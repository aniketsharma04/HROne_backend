const Product = require('../models/Product');
const { validateProduct, validatePagination } = require('../utils/validation');
const { createResponse, createErrorResponse } = require('../utils/responseHelper');

// Create Product
const createProduct = async (req, res, next) => {
  try {
    // Validate request body
    const { error, value } = validateProduct(req.body);
    if (error) {
      return res.status(400).json(createErrorResponse(
        'Validation failed',
        error.details.map(detail => detail.message)
      ));
    }

    // Check if product with same name already exists
    const existingProduct = await Product.findOne({ 
      name: { $regex: new RegExp(`^${value.name}$`, 'i') }
    });
    
    if (existingProduct) {
      return res.status(409).json(createErrorResponse(
        'Product already exists',
        ['A product with this name already exists']
      ));
    }

    // Create new product
    const product = new Product(value);
    const savedProduct = await product.save();

    res.status(201).json({ id: savedProduct._id });

  } catch (error) {
    next(error);
  }
};

// Get All Products with Pagination
const getProducts = async (req, res, next) => {
  try {
    // Validate pagination parameters
    const { error, value } = validatePagination(req.query);
    if (error) {
      return res.status(400).json(createErrorResponse(
        'Invalid pagination parameters',
        error.details.map(detail => detail.message)
      ));
    }

    const { page, limit } = value;
    const skip = (page - 1) * limit;

    // Build query
    const query = { is_active: true };
    
    // Add search functionality (bonus feature)
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // Add price range filter (bonus feature)
    if (req.query.min_price || req.query.max_price) {
      query.price = {};
      if (req.query.min_price) query.price.$gte = parseFloat(req.query.min_price);
      if (req.query.max_price) query.price.$lte = parseFloat(req.query.max_price);
    }

    // Execute queries
    const [products, totalProducts] = await Promise.all([
      Product.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(query)
    ]);

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalProducts / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.status(200).json(createResponse(
      'Products retrieved successfully',
      {
        products,
        pagination: {
          current_page: page,
          total_pages: totalPages,
          total_products: totalProducts,
          per_page: limit,
          has_next_page: hasNextPage,
          has_prev_page: hasPrevPage,
          next_page: hasNextPage ? page + 1 : null,
          prev_page: hasPrevPage ? page - 1 : null
        }
      }
    ));

  } catch (error) {
    next(error);
  }
};

// Get Single Product (bonus feature)
const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json(createErrorResponse(
        'Invalid product ID format'
      ));
    }

    const product = await Product.findById(id);

    if (!product || !product.is_active) {
      return res.status(404).json(createErrorResponse(
        'Product not found'
      ));
    }

    res.status(200).json(createResponse(
      'Product retrieved successfully',
      { product }
    ));

  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById
};