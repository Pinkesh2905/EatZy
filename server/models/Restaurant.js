const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    location: { type: String, required: true },
    cuisine: [String],
    rating: { type: Number, default: 0 },
    image: { type: String },
    isApproved: { type: Boolean, default: false },
    providerType: { 
        type: String, 
        enum: ['restaurant', 'home_chef'], 
        default: 'restaurant' 
    }
}, { timestamps: true });

module.exports = mongoose.model('Restaurant', restaurantSchema);
