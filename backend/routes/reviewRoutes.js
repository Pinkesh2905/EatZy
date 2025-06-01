const express = require('express');
const router = express.Router();
const Food = require('../models/Food');
const verifyToken = require('../middleware/verifyToken');
const User = require('../models/User');

router.post('/:foodId/reviews', verifyToken, async (req, res) => {
  const { rating, comment } = req.body;

  try {
    const user = await User.findById(req.userId).select('username');
    const food = await Food.findById(req.params.foodId);

    if (!food) return res.status(404).json({ message: 'Food not found' });

    const newReview = {
      user: req.userId,
      username: user.username,
      rating,
      comment,
    };

    food.reviews.push(newReview);
    await food.save();

    res.json({ message: 'Review added successfully', food });
  } catch (err) {
    res.status(500).json({ message: 'Error adding review' });
  }
});

router.get('/:foodId/reviews', async (req, res) => {
  try {
    const food = await Food.findById(req.params.foodId).select('reviews');
    if (!food) return res.status(404).json({ message: 'Food not found' });

    res.json(food.reviews);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching reviews' });
  }
});

module.exports = router;
