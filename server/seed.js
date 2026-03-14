const mongoose = require('mongoose');
const User = require('./models/User');
const Restaurant = require('./models/Restaurant');
const Menu = require('./models/Menu');
const dotenv = require('dotenv');

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for seeding...');

        // Clear existing
        try {
            await mongoose.connection.db.dropCollection('users');
            await mongoose.connection.db.dropCollection('restaurants');
            await mongoose.connection.db.dropCollection('menus');
        } catch (e) {
            console.log('Collections might not exist, skipping drop.');
        }

        // 1. Restaurant Owner & Restaurant
        const owner = await User.create({
            name: 'Main Chef',
            email: 'chef@eatzy.com',
            password: 'password123',
            role: 'restaurant_owner'
        });

        const res1 = await Restaurant.create({
            owner: owner._id,
            name: 'The Green Bowl',
            location: 'Downtown, Mumbai',
            cuisine: ['Salads', 'Healthy', 'Vegan'],
            rating: 4.8,
            image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800',
            isApproved: true,
            providerType: 'restaurant'
        });

        // 2. Home Chef & Kitchen
        const chefUser = await User.create({
            name: 'Auntie Mary',
            email: 'mary@home.com',
            password: 'password123',
            role: 'home_chef'
        });

        const chefRes = await Restaurant.create({
            owner: chefUser._id,
            name: "Mary's Home Kitchen",
            location: 'Suburbs, Mumbai',
            cuisine: ['Home Cooked', 'Traditional', 'Indian'],
            rating: 4.9,
            image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=800',
            isApproved: true,
            providerType: 'home_chef'
        });

        // 3. Delivery Partner
        await User.create({
            name: 'Swift Rider',
            email: 'rider@eatzy.com',
            password: 'password123',
            role: 'delivery_partner',
            isOnline: true,
            currentLocation: { lat: 19.076, lng: 72.877 }
        });

        // 4. Customer
        await User.create({
            name: 'Hungry John',
            email: 'john@user.com',
            password: 'password123',
            role: 'customer'
        });

        // 5. Menu Items
        await Menu.create([
            {
                restaurant: res1._id,
                dishName: 'Quinoa Power Bowl',
                price: 350,
                description: 'High protein bowl with quinoa, chickpeas, and fresh veggies.',
                nutritionInfo: { calories: 450, protein: 25, fats: 12, carbs: 45 },
                isAvailable: true
            },
            {
                restaurant: res1._id,
                dishName: 'Keto Grilled Chicken',
                price: 420,
                description: 'Succulent grilled chicken breast with buttered broccoli.',
                nutritionInfo: { calories: 400, protein: 35, fats: 25, carbs: 5 },
                isAvailable: true
            },
            {
                restaurant: chefRes._id,
                dishName: 'Homestyle Rajma Chawal',
                price: 180,
                description: 'Classic red kidney bean curry with steamed basmati rice.',
                nutritionInfo: { calories: 550, protein: 15, fats: 10, carbs: 80 },
                isAvailable: true
            },
            {
                restaurant: chefRes._id,
                dishName: 'Soya Chunk Curry',
                price: 150,
                description: 'Protein-rich soya curry in a home-style tomato gravy.',
                nutritionInfo: { calories: 300, protein: 22, fats: 8, carbs: 20 },
                isAvailable: true
            }
        ]);

        console.log('Database Seeded with Stakeholders Successfully');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedData();
