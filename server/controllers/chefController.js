const Restaurant = require('../models/Restaurant');
const Menu = require('../models/Menu');

// @desc Get chef's profile/kitchen
// @route GET /api/chefs/my-kitchen
exports.getMyKitchen = async (req, res) => {
    try {
        const kitchen = await Restaurant.findOne({ owner: req.user.id, providerType: 'home_chef' });
        if (!kitchen) return res.status(404).json({ message: 'Kitchen not found' });
        
        const menu = await Menu.find({ restaurant: kitchen._id });
        res.json({ kitchen, menu });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc Update chef kitchen info
// @route PUT /api/chefs/my-kitchen
exports.updateKitchen = async (req, res) => {
    try {
        const kitchen = await Restaurant.findOneAndUpdate(
            { owner: req.user.id, providerType: 'home_chef' },
            req.body,
            { new: true }
        );
        res.json(kitchen);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
