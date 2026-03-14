const Menu = require('../models/Menu');
const User = require('../models/User');

// @desc Get personalized meal recommendations
// @route GET /api/recommendations
exports.getRecommendations = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const goals = user.healthGoals || [];

        // Simple recommendation logic based on goals
        let filter = { isAvailable: true };
        
        if (goals.length > 0) {
            const goalFilters = [];
            if (goals.includes('high_protein')) goalFilters.push({ 'nutritionInfo.protein': { $gte: 20 } });
            if (goals.includes('low_carb')) goalFilters.push({ 'nutritionInfo.carbs': { $lte: 30 } });
            if (goals.includes('low_fat')) goalFilters.push({ 'nutritionInfo.fats': { $lte: 10 } });
            
            if (goalFilters.length > 0) {
                filter.$or = goalFilters;
            }
        }

        const recommendations = await Menu.find(filter)
            .populate('restaurant', 'name image rating')
            .limit(10);

        res.json(recommendations);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc Update user health goals
// @route PUT /api/recommendations/goals
exports.updateGoals = async (req, res) => {
    const { goals } = req.body;
    try {
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { healthGoals: goals },
            { new: true }
        );
        res.json(user.healthGoals);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
