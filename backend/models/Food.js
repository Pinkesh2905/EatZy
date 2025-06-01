const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    username: String, 
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: String,
    createdAt: { type: Date, default: Date.now }
});

const foodSchema = new mongoose.Schema({
    name: String,
    image: String,
    price: Number,
    category: String,
    description: String,
    reviews: [reviewSchema]
});

const Food = mongoose.model('Food', foodSchema);

module.exports = Food;
