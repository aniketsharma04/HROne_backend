const Order = require('../models/Order');
const Product = require('../models/Product');
const { validateOrder, validatePagination } = require('../utils/validation');
const { createResponse, createErrorResponse } = require('../utils/responseHelper');
const mongoose = require('mongoose');

// Create Order
const createOrder = async (req, res, next) => {
  const session = await mongoose.startSession();
  
  try {
    session.startTransaction();

    // Validate request body
    const { error, value } = validateOrder(req.body);
    if (error) {
      await session.abortTransaction();
      return res.status(400).json(createErrorResponse(
        'Validation failed',
        error.details.map(detail => detail.message)
      ));
    }

    const { customer_name, products } = value;

    // Validate and process products
    const orderItems = [];
    let totalPrice = 0;

    for (const item of products) {
      // Find product
      const product = await Product.findById(item.product_id).session(session);
      
      if (!product || !product.is_active) {
        await session.abortTransaction();
        return res.status(404).json(createErrorResponse(
          `Product not found: ${item.product_id}`
        ));
      }

      // Check stock availability
      if (!product.isInStock(item.quantity)) {
        await session.abortTransaction();
        return res.status(400).json(createErrorResponse(
          `Insufficient stock for product: ${product.name}. Available: ${product.stock_quantity}, Requested: ${item.quantity}`
        ));
      }

      // Calculate subtotal
      const subtotal = product.price * item.quantity;
      totalPrice += subtotal;

      // Prepare order item
      orderItems.push({
        product_id: product._id,
        quantity: item.quantity,
        price: product.price,
        subtotal: subtotal
      });

      // Update product stock
      await Product.findByIdAndUpdate(
        product._id,
        { $inc: { stock_quantity: -item.quantity } },
        { session }
      );
    }

    // Create order
    const order = new Order({
      customer_name,
      products: orderItems,
      total_price: totalPrice
    });

    const savedOrder = await order.save({ session });
    
    // Populate product details for response
    await savedOrder.populate('products.product_id', 'name description');

    await session.commitTransaction();

    res.status(201).json({ id: savedOrder._id });

  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};

// Get All Orders with Pagination
const getOrders = async (req, res, next) => {
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
    const query = {};
    
    // Add customer search filter (bonus feature)
    if (req.query.customer_name) {
      query.customer_name = { $regex: req.query.customer_name, $options: 'i' };
    }

    // Add status filter (bonus feature)
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Add date range filter (bonus feature)
    if (req.query.start_date || req.query.end_date) {
      query.order_date = {};
      if (req.query.start_date) {
        query.order_date.$gte = new Date(req.query.start_date);
      }
      if (req.query.end_date) {
        query.order_date.$lte = new Date(req.query.end_date);
      }
    }

    // Execute queries
    const [orders, totalOrders] = await Promise.all([
      Order.find(query)
        .populate('products.product_id', 'name description price')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Order.countDocuments(query)
    ]);

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalOrders / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.status(200).json(createResponse(
      'Orders retrieved successfully',
      {
        orders,
        pagination: {
          current_page: page,
          total_pages: totalPages,
          total_orders: totalOrders,
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

// Get Single Order (bonus feature)
const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json(createErrorResponse(
        'Invalid order ID format'
      ));
    }

    const order = await Order.findById(id)
      .populate('products.product_id', 'name description price');

    if (!order) {
      return res.status(404).json(createErrorResponse(
        'Order not found'
      ));
    }

    res.status(200).json(createResponse(
      'Order retrieved successfully',
      { order }
    ));

  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById
};