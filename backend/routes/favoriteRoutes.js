const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Middleware to verify token
function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, 'secretKey');
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
}

// Get user's favorites
router.get('/', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('favorites');
    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch favorites' });
  }
});

// Add to favorites
router.post('/:foodId', verifyToken, async (req, res) => {
  const { foodId } = req.params;
  try {
    const user = await User.findById(req.userId);
    if (!user.favorites.includes(foodId)) {
      user.favorites.push(foodId);
      await user.save();
    }
    res.json({ message: 'Added to favorites' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add favorite' });
  }
});

// Remove from favorites
router.delete('/:foodId', verifyToken, async (req, res) => {
  const { foodId } = req.params;
  try {
    await User.findByIdAndUpdate(req.userId, {
      $pull: { favorites: foodId }
    });
    res.json({ message: 'Removed from favorites' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to remove favorite' });
  }
});

module.exports = router;
