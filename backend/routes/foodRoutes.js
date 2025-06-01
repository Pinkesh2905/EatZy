const express = require('express');
const router = express.Router();
const Food = require('../models/Food');

// GET all food items
router.get('/', async (req, res) => {
  try {
    const foods = await Food.find();
    res.json(foods);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new food item
router.post('/', async (req, res) => {
  const { name, image, price, category, description } = req.body;

  const newFood = new Food({
    name,
    image,
    price,
    category,
    description,
  });

  try {
    const savedFood = await newFood.save();
    res.status(201).json(savedFood);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
