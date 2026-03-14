const Order = require('../models/Order');
const User = require('../models/User');

// @desc Get admin overview statistics
// @route GET /api/analytics/admin
exports.getAdminStats = async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        const totalRevenue = await Order.aggregate([
            { $group: { _id: null, total: { $sum: "$totalPrice" } } }
        ]);
        const totalUsers = await User.countDocuments();
        const activeChefs = await User.countDocuments({ role: 'home_chef' });

        res.json({
            totalOrders,
            totalRevenue: totalRevenue[0]?.total || 0,
            totalUsers,
            activeChefs,
            recentTrends: [
                { Month: 'Jan', Sales: 4000 },
                { Month: 'Feb', Sales: 3000 },
                { Month: 'Mar', Sales: 5000 }
            ]
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc Get restaurant specific analytics
// @route GET /api/analytics/restaurant/:id
exports.getRestaurantStats = async (req, res) => {
    try {
        const { id } = req.params;
        const orders = await Order.find({ restaurant: id });
        
        const revenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);
        const orderCount = orders.length;

        // Mocking some dish performance data
        const topDishes = [
            { dish: 'Grilled Chicken', quantity: 45 },
            { dish: 'Avocado Salad', quantity: 38 },
            { dish: 'Quinoa Bowl', quantity: 22 }
        ];

        res.json({
            revenue,
            orderCount,
            topDishes,
            efficiency: "94%"
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
