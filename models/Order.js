const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product ID is required']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1'],
    validate: {
      validator: function(value) {
        return Number.isInteger(value) && value > 0;
      },
      message: 'Quantity must be a positive integer'
    }
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price must be positive']
  },
  subtotal: {
    type: Number,
    required: [true, 'Subtotal is required'],
    min: [0, 'Subtotal must be positive']
  }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  customer_name: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true,
    maxlength: [100, 'Customer name cannot exceed 100 characters'],
    index: true
  },
  products: {
    type: [orderItemSchema],
    required: [true, 'At least one product is required'],
    validate: {
      validator: function(products) {
        return products && products.length > 0;
      },
      message: 'Order must contain at least one product'
    }
  },
  total_price: {
    type: Number,
    required: [true, 'Total price is required'],
    min: [0, 'Total price must be positive']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
    index: true
  },
  order_date: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true,
  versionKey: false
});

// Indexes for better performance
orderSchema.index({ customer_name: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ order_date: -1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ total_price: 1 });

// Pre-save middleware to calculate total price
orderSchema.pre('save', function(next) {
  if (this.products && this.products.length > 0) {
    this.total_price = this.products.reduce((total, item) => {
      item.subtotal = item.price * item.quantity;
      return total + item.subtotal;
    }, 0);
  }
  next();
});

// Instance methods
orderSchema.methods.calculateTotal = function() {
  return this.products.reduce((total, item) => total + (item.price * item.quantity), 0);
};

orderSchema.methods.updateStatus = function(newStatus) {
  this.status = newStatus;
  return this.save();
};

// Static methods
orderSchema.statics.findByCustomer = function(customerName) {
  return this.find({ customer_name: new RegExp(customerName, 'i') });
};

orderSchema.statics.findByStatus = function(status) {
  return this.find({ status });
};

module.exports = mongoose.model('Order', orderSchema);