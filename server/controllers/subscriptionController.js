const Subscription = require('../models/Subscription');

// @desc Get current user active subscription
// @route GET /api/subscriptions/my
exports.getMySubscription = async (req, res) => {
    try {
        const subscription = await Subscription.findOne({
            user: req.user.id,
            status: 'active'
        });
        res.json(subscription);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Create a new subscription
// @route POST /api/subscriptions
exports.createSubscription = async (req, res) => {
    try {
        const { planName, type, price, mealsPerWeek, preferences } = req.body;
        
        // Calculate end date (7 days for weekly, 30 days for monthly)
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + (type === 'weekly' ? 7 : 30));

        const subscription = await Subscription.create({
            user: req.user.id,
            planName,
            type,
            price,
            endDate,
            mealsPerWeek,
            remainingMeals: mealsPerWeek,
            preferences
        });

        res.status(201).json(subscription);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
