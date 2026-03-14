const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const buildAuthPayload = (user) => ({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    address: user.address,
    rewardPoints: user.rewardPoints,
    healthGoals: user.healthGoals,
    token: generateToken(user._id, user.role)
});

// @desc Register User
// @route POST /api/auth/register
exports.register = async (req, res) => {
    const { name, email, password, role, phone, address } = req.body;

    try {
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email and password are required' });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const userExists = await User.findOne({ email: normalizedEmail });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password,
            role,
            phone,
            address
        });

        res.status(201).json(buildAuthPayload(user));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Login User
// @route POST /api/auth/login
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await User.findOne({ email: email.trim().toLowerCase() });
        if (user && (await user.comparePassword(password))) {
            res.json(buildAuthPayload(user));
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Get current user profile
// @route GET /api/auth/profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            address: user.address,
            rewardPoints: user.rewardPoints,
            healthGoals: user.healthGoals
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
