const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, unique: true, sparse: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    role: { 
        type: String, 
        enum: ['customer', 'restaurant_owner', 'home_chef', 'delivery_partner', 'admin'], 
        default: 'customer' 
    },
    address: { type: String },
    isOnline: { type: Boolean, default: false }, // For delivery partners
    currentLocation: {
        lat: { type: Number },
        lng: { type: Number }
    },
    healthGoals: {
        type: [String],
        enum: ['high_protein', 'low_carb', 'low_fat', 'vegan', 'keto', 'weight_loss'],
        default: []
    },
    rewardPoints: { type: Number, default: 100 } // Start with 100 welcome points
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function() {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
