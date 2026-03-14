const Order = require('../models/Order');
const User = require('../models/User');
const { getIO } = require('../socket');

// @desc Create new order
// @route POST /api/orders
exports.createOrder = async (req, res) => {
    try {
        const { restaurant, items, totalPrice, deliveryAddress } = req.body;
        
        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'No items in order' });
        }

        const order = await Order.create({
            user: req.user.id,
            restaurant,
            items,
            totalPrice,
            deliveryAddress
        });

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Get user orders
// @route GET /api/orders/myorders
exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).populate('restaurant', 'name');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Get order by ID
// @route GET /api/orders/:id
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('restaurant', 'name');
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// @desc Update order status
// @route PUT /api/orders/:id/status
exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        ).populate('restaurant', 'name');

        if (!order) return res.status(404).json({ message: 'Order not found' });

        // Emit real-time update
        const io = getIO();
        io.to(order._id.toString()).emit('order_updated', order);

        if (status === 'delivered') {
            const user = await User.findById(order.user);
            if (user) {
                // Award 10% of total price as points
                const pointsToAward = Math.floor(order.totalPrice * 0.1);
                user.rewardPoints += pointsToAward;
                await user.save();
            }
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
