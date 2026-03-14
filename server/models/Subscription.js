const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    planName: { type: String, required: true }, // e.g., 'Weekly Vitality', 'Monthly Green'
    type: { type: String, enum: ['weekly', 'monthly'], required: true },
    price: { type: Number, required: true },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, required: true },
    status: { type: String, enum: ['active', 'expired', 'cancelled'], default: 'active' },
    mealsPerWeek: { type: Number, required: true },
    remainingMeals: { type: Number, required: true },
    preferences: {
        isVeg: { type: Boolean, default: false },
        spiceLevel: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' }
    }
}, { timestamps: true });

module.exports = mongoose.model('Subscription', subscriptionSchema);
