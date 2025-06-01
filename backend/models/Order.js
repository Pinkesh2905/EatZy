const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    name: String,
    price: Number,
    quantity: Number,
    image: String
  }],
  total: Number,
  createdAt: { type: Date, default: Date.now },
  status: {
    type: String,
    default: 'Pending', 
    enum: ['Pending', 'Preparing', 'Out for delivery', 'Delivered', 'Cancelled']
  }
});

module.exports = mongoose.model('Order', orderSchema);
