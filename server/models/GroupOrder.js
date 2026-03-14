const mongoose = require('mongoose');

const groupOrderSchema = new mongoose.Schema({
    host: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    members: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        items: [{
            dishName: String,
            price: Number,
            quantity: { type: Number, default: 1 }
        }]
    }],
    status: { type: String, enum: ['active', 'completed', 'cancelled'], default: 'active' },
    code: { type: String, unique: true, required: true }
}, { timestamps: true });

module.exports = mongoose.model('GroupOrder', groupOrderSchema);
