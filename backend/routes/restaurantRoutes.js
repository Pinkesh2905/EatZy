const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Food = require('../models/Food');
const User = require('../models/User');
const verifyToken = require('../middleware/verifyToken');

async function verifyRestaurant(req, res, next) {
  try {
    const user = await User.findById(req.userId);
    if (!user || user.role !== 'restaurant' || !user.restaurantDetails?.approved) {
      return res.status(403).json({ message: 'Restaurant access denied' });
    }
    req.restaurantUser = user;
    next();
  } catch (err) {
    res.status(500).json({ message: 'Authentication error' });
  }
}

const { ObjectId } = mongoose.Types;

router.get('/my-foods', verifyToken, verifyRestaurant, async (req, res) => {
  try {
    const foods = await Food.find({
      restaurantId: new ObjectId(req.userId),
    });
    res.json(foods);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching food items' });
  }
});

router.post('/my-foods', verifyToken, verifyRestaurant, async (req, res) => {
  try {
    const { name, category, price, image, description } = req.body;

    const newFood = new Food({
      name,
      category,
      price,
      image,
      description,
      restaurantId: req.userId.toString(),
    });

    await newFood.save();
    res.status(201).json(newFood);
  } catch (err) {
    res.status(500).json({ message: 'Server error while adding food' });
  }
});

router.put('/my-foods/:id', verifyToken, verifyRestaurant, async (req, res) => {
  try {
    const updated = await Food.findOneAndUpdate(
      { _id: req.params.id, restaurantId: req.userId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'Food item not found' });
    res.json({ message: 'Food item updated', food: updated });
  } catch (err) {
    res.status(500).json({ message: 'Error updating food item' });
  }
});

router.delete('/my-foods/:id', verifyToken, verifyRestaurant, async (req, res) => {
  try {
    const deleted = await Food.findOneAndDelete({
      _id: req.params.id,
      restaurantId: req.userId,
    });
    if (!deleted) return res.status(404).json({ message: 'Food item not found' });
    res.json({ message: 'Food item deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting food item' });
  }
});

module.exports = router;
