const User = require('../models/User');

// @desc Toggle delivery partner online status
// @route PUT /api/delivery/status
exports.toggleStatus = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (user.role !== 'delivery_partner') {
            return res.status(403).json({ message: 'Only delivery partners can toggle status' });
        }
        user.isOnline = !user.isOnline;
        await user.save();
        res.json({ success: true, isOnline: user.isOnline });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc Update delivery partner location
// @route PUT /api/delivery/location
exports.updateLocation = async (req, res) => {
    const { lat, lng } = req.body;
    try {
        await User.findByIdAndUpdate(req.user.id, {
            currentLocation: { lat, lng }
        });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
// @desc Get optimized multi-stop route (Beta)
// @route GET /api/delivery/route
exports.getOptimizedRoute = async (req, res) => {
    try {
        const partner = await User.findById(req.user.id);
        if (partner.role !== 'delivery_partner') {
            return res.status(403).json({ message: 'Only delivery partners can access routing' });
        }

        // Simulating a multi-stop route for Beta
        const start = partner.currentLocation || { lat: 19.076, lng: 72.877 };
        const stops = [
            { name: 'Restaurant: The Green Bowl', location: { lat: 19.080, lng: 72.880 }, type: 'pickup' },
            { name: 'Restaurant: Mary\'s Kitchen', location: { lat: 19.085, lng: 72.885 }, type: 'pickup' },
            { name: 'Customer: Hungry John', location: { lat: 19.090, lng: 72.890 }, type: 'delivery' }
        ];

        // Basic "Nearest Neighbor" logic simulation
        const route = [start, ...stops];

        res.json({
            success: true,
            optimizedRoute: route,
            totalDistance: '4.5 km',
            estimatedTime: '15 mins'
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
