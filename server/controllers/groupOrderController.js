const GroupOrder = require('../models/GroupOrder');
const crypto = require('crypto');

// @desc Create a group order session
// @route POST /api/group-orders
exports.createGroupOrder = async (req, res) => {
    const { restaurantId } = req.body;
    try {
        const code = crypto.randomBytes(3).toString('hex').toUpperCase();
        const groupOrder = await GroupOrder.create({
            host: req.user.id,
            restaurant: restaurantId,
            code,
            members: [{ user: req.user.id, items: [] }]
        });
        res.status(201).json(groupOrder);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @desc Get group order by code
// @route GET /api/group-orders/:code
exports.getGroupByCode = async (req, res) => {
    try {
        const group = await GroupOrder.findOne({ code: req.params.code })
            .populate('host', 'name')
            .populate('members.user', 'name')
            .populate('restaurant', 'name');
        if (!group) return res.status(404).json({ message: 'Group order not found' });
        res.json(group);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
