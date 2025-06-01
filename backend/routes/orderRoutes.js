const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const verifyToken = require('../middleware/verifyToken');

// Create a new order
router.post('/', verifyToken, async (req, res) => {
  try {
    const order = new Order({
      userId: req.userId,
      items: req.body.items,
      total: req.body.total,
    });
    await order.save();
    res.json({ message: 'Order placed successfully' });
  } catch (err) {
    console.error('Order create error:', err);
    res.status(500).json({ message: 'Failed to place order' });
  }
});

// Get current user's orders (track order)
router.get('/mine', verifyToken, async (req, res) => {
  console.log('Fetching orders for user:', req.userId);
  try {
    const orders = await Order.find({ userId: req.userId }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ message: 'Error fetching user orders' });
  }
});

// Cancel an order
router.put('/:id/cancel', verifyToken, async (req, res) => {
  console.log('Cancel endpoint HIT for order:', req.params.id);

  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!order) {
      console.log('Order not found');
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status === 'Delivered' || order.status === 'Cancelled') {
      console.log('Order not cancelable');
      return res.status(400).json({ message: 'Cannot cancel this order' });
    }

    order.status = 'Cancelled';
    await order.save();

    console.log('Order cancelled:', order._id);
    res.json({ message: 'Order cancelled' });
  } catch (err) {
    console.error('🔥 Cancel route error:', err); 
    res.status(500).json({ message: 'Cancel failed' });
  }
});

module.exports = router;
