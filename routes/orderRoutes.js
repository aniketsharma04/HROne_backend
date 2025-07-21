const express = require('express');
const { createOrder, getOrders, getOrderById } = require('../controllers/orderController');

const router = express.Router();

// Order Routes
router.post('/', createOrder);             // POST /api/orders
router.get('/', getOrders);                // GET /api/orders
router.get('/:id', getOrderById);          // GET /api/orders/:id (bonus)

module.exports = router;