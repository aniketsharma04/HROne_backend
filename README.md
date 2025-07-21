# HROne Backend Intern Task - Product Management & Order Processing System

A comprehensive backend API system built with Node.js, Express.js, and MongoDB for managing products and processing orders.

## 🚀 Features

### Core APIs (As Required)
- ✅ **Create Products API** - Add new products to inventory
- ✅ **List Products API** - Retrieve products with pagination
- ✅ **Create Order API** - Process new orders with stock validation
- ✅ **Get List of Orders** - Retrieve orders with pagination

### Bonus Features
- 🔍 **Search & Filter** - Search products by name/description, filter by price range
- 📊 **Advanced Pagination** - Complete pagination metadata
- 🛡️ **Security** - Rate limiting, CORS, Helmet security headers
- ✅ **Data Validation** - Comprehensive input validation with Joi
- 🏥 **Health Checks** - API health monitoring endpoint
- 📈 **Stock Management** - Automatic stock updates during order creation
- 🔄 **Transaction Support** - Atomic operations for order processing

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Validation**: Joi
- **Security**: Helmet, CORS, Express Rate Limit

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB connection (provided in task)

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
The MongoDB connection string is already configured as per the task requirements.

### 3. Start the Server
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

### 4. Verify Installation
Visit `http://localhost:3000` to see the API documentation.

## 📚 API Documentation

### Base URL
```
http://localhost:3000
```

### Endpoints

#### **Products**

##### Create Product
```http
POST /api/products
Content-Type: application/json

{
  "name": "Laptop",
  "description": "High-performance laptop for professionals",
  "price": 999.99,
  "stock_quantity": 50
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Product created successfully",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "data": {
    "product": {
      "_id": "65a5f8e123456789abcdef01",
      "name": "Laptop",
      "description": "High-performance laptop for professionals",
      "price": 999.99,
      "stock_quantity": 50,
      "is_active": true,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

##### List Products
```http
GET /api/products?page=1&limit=10&search=laptop&min_price=100&max_price=2000
```

**Response:**
```json
{
  "status": "success",
  "message": "Products retrieved successfully",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "data": {
    "products": [...],
    "pagination": {
      "current_page": 1,
      "total_pages": 5,
      "total_products": 50,
      "per_page": 10,
      "has_next_page": true,
      "has_prev_page": false,
      "next_page": 2,
      "prev_page": null
    }
  }
}
```

#### **Orders**

##### Create Order
```http
POST /api/orders
Content-Type: application/json

{
  "customer_name": "John Doe",
  "products": [
    {
      "product_id": "65a5f8e123456789abcdef01",
      "quantity": 2
    },
    {
      "product_id": "65a5f8e123456789abcdef02",
      "quantity": 1
    }
  ]
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Order created successfully",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "data": {
    "order": {
      "_id": "65a5f8e123456789abcdef03",
      "customer_name": "John Doe",
      "products": [...],
      "total_price": 2999.97,
      "status": "pending",
      "order_date": "2024-01-15T10:30:00.000Z",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

##### List Orders
```http
GET /api/orders?page=1&limit=10&customer_name=john&status=pending
```

**Response:**
```json
{
  "status": "success",
  "message": "Orders retrieved successfully",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "data": {
    "orders": [...],
    "pagination": {
      "current_page": 1,
      "total_pages": 3,
      "total_orders": 25,
      "per_page": 10,
      "has_next_page": true,
      "has_prev_page": false,
      "next_page": 2,
      "prev_page": null
    }
  }
}
```

### Query Parameters

#### Products API
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `search` (optional): Search in name and description
- `min_price` (optional): Minimum price filter
- `max_price` (optional): Maximum price filter

#### Orders API
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `customer_name` (optional): Filter by customer name
- `status` (optional): Filter by order status
- `start_date` (optional): Filter orders from date (YYYY-MM-DD)
- `end_date` (optional): Filter orders until date (YYYY-MM-DD)

## 🛡️ Error Handling

The API provides comprehensive error handling with standardized error responses:

```json
{
  "status": "error",
  "message": "Validation failed",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "errors": [
    "Product name is required",
    "Price must be a positive number"
  ],
  "code": "VALIDATION_ERROR"
}
```

## 🏥 Health Check

```http
GET /health
```

Returns server status and uptime information.

## 📁 Project Structure

```
hrone-backend-task/
├── controllers/          # Business logic
│   ├── productController.js
│   └── orderController.js
├── models/              # Database schemas
│   ├── Product.js
│   └── Order.js
├── routes/              # API routes
│   ├── productRoutes.js
│   └── orderRoutes.js
├── middleware/          # Custom middleware
│   └── errorHandler.js
├── utils/               # Helper functions
│   ├── validation.js
│   └── responseHelper.js
├── .env                 # Environment variables
├── server.js           # Application entry point
├── package.json        # Dependencies and scripts
└── README.md          # Documentation
```

## 🧪 Testing the API

### Using curl:

1. **Create a Product:**
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Gaming Laptop",
    "description": "High-end gaming laptop with RTX graphics",
    "price": 1999.99,
    "stock_quantity": 25
  }'
```

2. **List Products:**
```bash
curl "http://localhost:3000/api/products?page=1&limit=5"
```

3. **Create an Order:**
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customer_name": "Alice Johnson",
    "products": [
      {
        "product_id": "YOUR_PRODUCT_ID_HERE",
        "quantity": 1
      }
    ]
  }'
```

4. **List Orders:**
```bash
curl "http://localhost:3000/api/orders?page=1&limit=5"
```

## 🔐 Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS**: Cross-origin resource sharing enabled
- **Helmet**: Security headers for common vulnerabilities
- **Input Validation**: Comprehensive data validation with Joi
- **Error Sanitization**: Prevents sensitive data leakage

## 🎯 Key Features Implemented

✅ **All Required APIs** as per task specification  
✅ **MongoDB Integration** with proper connection handling  
✅ **Data Validation** with comprehensive error messages  
✅ **Pagination** with metadata for both products and orders  
✅ **Stock Management** with automatic inventory updates  
✅ **Transaction Support** for atomic order operations  
✅ **Error Handling** with standardized error responses  
✅ **Security** with rate limiting and protective headers  
✅ **Documentation** with clear API examples  
✅ **Code Organization** with MVC architecture  

## 📈 Performance Optimizations

- Database indexing for frequently queried fields
- Lean queries for faster data retrieval
- Aggregation pipelines for complex operations
- Connection pooling with Mongoose
- Efficient pagination with skip/limit

## 🚀 Deployment Ready

The application is ready for deployment with:
- Environment variable configuration
- Error logging and monitoring hooks
- Health check endpoints
- Graceful error handling
- Production-ready security measures

---

**Author**: HROne Backend Intern Candidate  
**Task**: Product Management & Order Processing System  
**Technology**: Node.js, Express.js, MongoDB, Mongoose