const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    dishName: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    image: { type: String },
    nutritionInfo: {
        calories: { type: Number, default: 0 },
        protein: { type: Number, default: 0 },
        fats: { type: Number, default: 0 },
        carbs: { type: Number, default: 0 }
    },
    isAvailable: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Menu', menuSchema);
