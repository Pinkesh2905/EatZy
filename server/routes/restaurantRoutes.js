const express = require('express');
const router = express.Router();
const { getRestaurants, getRestaurantById, createRestaurant } = require('../controllers/restaurantController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getRestaurants);
router.get('/:id', getRestaurantById);
router.post('/', protect, authorize('restaurant_owner', 'admin'), createRestaurant);

module.exports = router;
