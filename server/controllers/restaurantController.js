const Restaurant = require('../models/Restaurant');
const Menu = require('../models/Menu');

// @desc Get all restaurants
// @route GET /api/restaurants
exports.getRestaurants = async (req, res) => {
    try {
        const { type } = req.query;
        const filter = type ? { providerType: type, isApproved: true } : { isApproved: true };
        const restaurants = await Restaurant.find(filter);
        res.json(restaurants);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc Get restaurant by ID & its menu
// @route GET /api/restaurants/:id
exports.getRestaurantById = async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id).populate('owner', 'name');
        if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
        
        const menu = await Menu.find({ restaurant: req.params.id });
        res.json({ restaurant, menu });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Add Restaurant (Owner only)
// @route POST /api/restaurants
exports.createRestaurant = async (req, res) => {
    try {
        const { name, location, cuisine, image } = req.body;
        const restaurant = await Restaurant.create({
            owner: req.user.id,
            name,
            location,
            cuisine,
            image
        });
        res.status(201).json(restaurant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
