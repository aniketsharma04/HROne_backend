const express = require('express');
const { createProduct, getProducts, getProductById } = require('../controllers/productController');

const router = express.Router();

// Product Routes
router.post('/', createProduct);           // POST /api/products
router.get('/', getProducts);              // GET /api/products
router.get('/:id', getProductById);        // GET /api/products/:id (bonus)

module.exports = router;