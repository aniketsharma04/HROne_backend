const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters'],
    index: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true,
    maxlength: [500, 'Product description cannot exceed 500 characters']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price must be a positive number'],
    validate: {
      validator: function(value) {
        return Number.isFinite(value) && value >= 0;
      },
      message: 'Price must be a valid positive number'
    }
  },
  stock_quantity: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock quantity cannot be negative'],
    validate: {
      validator: function(value) {
        return Number.isInteger(value) && value >= 0;
      },
      message: 'Stock quantity must be a non-negative integer'
    }
  },
  is_active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  versionKey: false
});

// Indexes for better performance
productSchema.index({ name: 1 });
productSchema.index({ price: 1 });
productSchema.index({ stock_quantity: 1 });
productSchema.index({ createdAt: -1 });

// Instance methods
productSchema.methods.updateStock = function(quantity) {
  this.stock_quantity = Math.max(0, this.stock_quantity - quantity);
  return this.save();
};

productSchema.methods.isInStock = function(quantity = 1) {
  return this.stock_quantity >= quantity;
};

// Static methods
productSchema.statics.findAvailable = function() {
  return this.find({ is_active: true, stock_quantity: { $gt: 0 } });
};

module.exports = mongoose.model('Product', productSchema);