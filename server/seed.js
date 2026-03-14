const mongoose = require('mongoose');
const User = require('./models/User');
const Restaurant = require('./models/Restaurant');
const Menu = require('./models/Menu');
const dotenv = require('dotenv');

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for extending seeding...');

        // Clear existing
        try {
            await mongoose.connection.db.dropCollection('users');
            await mongoose.connection.db.dropCollection('restaurants');
            await mongoose.connection.db.dropCollection('menus');
        } catch (e) {
            console.log('Collections might not exist, skipping drop.');
        }

        console.log('Generating Users...');
        // -----------------------
        // 1. RESTAURANT OWNERS 
        // -----------------------
        const owner1 = await User.create({ name: 'Gordon Ramsay', email: 'gordon@hellskitchen.com', password: 'password123', role: 'restaurant_owner' });
        const owner2 = await User.create({ name: 'Sanjeev Kapoor', email: 'sanjeev@khazana.com', password: 'password123', role: 'restaurant_owner' });
        const owner3 = await User.create({ name: 'Pizza Luigi', email: 'luigi@pizza.com', password: 'password123', role: 'restaurant_owner' });
        const owner4 = await User.create({ name: 'Taco Maria', email: 'maria@tacos.com', password: 'password123', role: 'restaurant_owner' });
        const owner5 = await User.create({ name: 'Sushi Master Hiro', email: 'hiro@sushi.com', password: 'password123', role: 'restaurant_owner' });

        // -----------------------
        // 2. HOME CHEFS
        // -----------------------
        const chef1 = await User.create({ name: 'Auntie Mary', email: 'mary@home.com', password: 'password123', role: 'home_chef' });
        const chef2 = await User.create({ name: 'Grandma Rosa', email: 'rosa@home.com', password: 'password123', role: 'home_chef' });
        const chef3 = await User.create({ name: 'Bhaiya Ji', email: 'bhaiya@home.com', password: 'password123', role: 'home_chef' });
        const chef4 = await User.create({ name: 'Mrs. Sharma', email: 'sharma@home.com', password: 'password123', role: 'home_chef' });
        const chef5 = await User.create({ name: 'Healthy Baker Jane', email: 'jane@home.com', password: 'password123', role: 'home_chef' });

        // -----------------------
        // 3. DELIVERY PARTNERS
        // -----------------------
        await User.create([
            { name: 'Swift Rider 1', email: 'rider1@eatzy.com', password: 'password123', role: 'delivery_partner', isOnline: true, currentLocation: { lat: 19.076, lng: 72.877 } },
            { name: 'Swift Rider 2', email: 'rider2@eatzy.com', password: 'password123', role: 'delivery_partner', isOnline: true, currentLocation: { lat: 19.080, lng: 72.880 } },
            { name: 'Swift Rider 3', email: 'rider3@eatzy.com', password: 'password123', role: 'delivery_partner', isOnline: false, currentLocation: { lat: 19.090, lng: 72.870 } },
            { name: 'Swift Rider 4', email: 'rider4@eatzy.com', password: 'password123', role: 'delivery_partner', isOnline: true, currentLocation: { lat: 19.071, lng: 72.890 } }
        ]);

        // -----------------------
        // 4. CUSTOMERS
        // -----------------------
        await User.create([
            { name: 'Hungry John', email: 'john@user.com', password: 'password123', role: 'customer' },
            { name: 'Fitness Freak Sarah', email: 'sarah@user.com', password: 'password123', role: 'customer' },
            { name: 'Late Night Coder', email: 'coder@user.com', password: 'password123', role: 'customer' },
            { name: 'Vegan Victoria', email: 'victoria@user.com', password: 'password123', role: 'customer' },
            { name: 'Big Eater Bob', email: 'bob@user.com', password: 'password123', role: 'customer' },
        ]);

        console.log('Generating Restaurants & Kitchens...');
        // -----------------------
        // RESTAURANTS
        // -----------------------
        const res1 = await Restaurant.create({ owner: owner1._id, name: 'Hells Kitchen Grill', location: 'Downtown', cuisine: ['Steakhouse', 'American', 'Premium'], rating: 4.9, image: 'https://images.unsplash.com/photo-1544025162-8315ea21f8a8?q=80&w=800', isApproved: true, providerType: 'restaurant' });
        const res2 = await Restaurant.create({ owner: owner2._id, name: 'Khazana Indian Spice', location: 'Midtown', cuisine: ['Indian', 'Curry', 'Spicy'], rating: 4.7, image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800', isApproved: true, providerType: 'restaurant' });
        const res3 = await Restaurant.create({ owner: owner3._id, name: 'Luigis Authentic Pizza', location: 'Little Italy', cuisine: ['Italian', 'Pizza', 'Pasta'], rating: 4.6, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=800', isApproved: true, providerType: 'restaurant' });
        const res4 = await Restaurant.create({ owner: owner4._id, name: 'Taco Maria Authentic', location: 'West End', cuisine: ['Mexican', 'Tacos', 'Spicy'], rating: 4.8, image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?q=80&w=800', isApproved: true, providerType: 'restaurant' });
        const res5 = await Restaurant.create({ owner: owner5._id, name: 'Hiro Sushi Bar', location: 'East Side', cuisine: ['Japanese', 'Sushi', 'Asian'], rating: 4.9, image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=800', isApproved: true, providerType: 'restaurant' });

        // HOME KITCHENS
        const kitch1 = await Restaurant.create({ owner: chef1._id, name: "Mary's Comfort Food", location: 'Suburbs', cuisine: ['Home Cooked', 'Traditional'], rating: 4.9, image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=800', isApproved: true, providerType: 'home_chef' });
        const kitch2 = await Restaurant.create({ owner: chef2._id, name: "Grandma Rosa's Pastas", location: 'North District', cuisine: ['Italian', 'Home Cooked'], rating: 4.8, image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?q=80&w=800', isApproved: true, providerType: 'home_chef' });
        const kitch3 = await Restaurant.create({ owner: chef3._id, name: "Bhaiya Ji Ki Rasoi", location: 'South Block', cuisine: ['Indian', 'Street Food'], rating: 4.7, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800', isApproved: true, providerType: 'home_chef' });
        const kitch4 = await Restaurant.create({ owner: chef4._id, name: "Mrs Sharma's Tiffin", location: 'Tech Park', cuisine: ['North Indian', 'Healthy'], rating: 4.5, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800', isApproved: true, providerType: 'home_chef' });
        const kitch5 = await Restaurant.create({ owner: chef5._id, name: "Jane's Healthy Bakes", location: 'West Park', cuisine: ['Bakery', 'Vegan', 'Desserts'], rating: 4.9, image: 'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?q=80&w=800', isApproved: true, providerType: 'home_chef' });

        console.log('Generating Menu Items...');
        // -----------------------
        // MENU ITEMS
        // -----------------------
        await Menu.create([
            // Hells Kitchen
            { restaurant: res1._id, dishName: 'Beef Wellington', price: 1200, description: 'Prime beef coated in pâté and duxelles, wrapped in puff pastry.', nutritionInfo: { calories: 850, protein: 45, fats: 55, carbs: 30 }, isAvailable: true },
            { restaurant: res1._id, dishName: 'Pan-Seared Scallops', price: 800, description: 'Fresh scallops seared to perfection with lemon butter sauce.', nutritionInfo: { calories: 350, protein: 25, fats: 20, carbs: 10 }, isAvailable: true },
            { restaurant: res1._id, dishName: 'Truffle Mac & Cheese', price: 650, description: 'Creamy high-end macaroni with real black truffle shavings.', nutritionInfo: { calories: 650, protein: 18, fats: 40, carbs: 55 }, isAvailable: true },

            // Khazana Indian
            { restaurant: res2._id, dishName: 'Butter Chicken Masala', price: 450, description: 'Tender chicken simmered in a rich tomato, butter, and cashew sauce.', nutritionInfo: { calories: 550, protein: 30, fats: 35, carbs: 15 }, isAvailable: true },
            { restaurant: res2._id, dishName: 'Garlic Butter Naan', price: 80, description: 'Freshly baked flatbread topped with minced garlic and butter.', nutritionInfo: { calories: 220, protein: 5, fats: 8, carbs: 35 }, isAvailable: true },
            { restaurant: res2._id, dishName: 'Paneer Tikka', price: 350, description: 'Cottage cheese marinated in yogurt and spices, roasted in tandoor.', nutritionInfo: { calories: 400, protein: 20, fats: 30, carbs: 12 }, isAvailable: true },

            // Luigis Pizza
            { restaurant: res3._id, dishName: 'Margherita Pizza 12"', price: 500, description: 'Classic pizza with San Marzano tomato sauce, fresh mozzarella, and basil.', nutritionInfo: { calories: 800, protein: 30, fats: 35, carbs: 90 }, isAvailable: true },
            { restaurant: res3._id, dishName: 'Pepperoni Paradise 12"', price: 650, description: 'Loaded with double premium pork pepperoni and extra cheese.', nutritionInfo: { calories: 1100, protein: 45, fats: 60, carbs: 95 }, isAvailable: true },
            { restaurant: res3._id, dishName: 'Spaghetti Carbonara', price: 450, description: 'Traditional Roman pasta with egg, cheese, pancetta, and black pepper.', nutritionInfo: { calories: 750, protein: 25, fats: 40, carbs: 65 }, isAvailable: true },

            // Taco Maria
            { restaurant: res4._id, dishName: 'Carnitas Street Tacos (3x)', price: 300, description: 'Slow-cooked pork shoulder in soft corn tortillas with onion and cilantro.', nutritionInfo: { calories: 450, protein: 28, fats: 22, carbs: 35 }, isAvailable: true },
            { restaurant: res4._id, dishName: 'Massive California Burrito', price: 450, description: 'Steak, french fries, cheese, pico de gallo, and guacamole inside a massive flour tortilla.', nutritionInfo: { calories: 950, protein: 40, fats: 45, carbs: 90 }, isAvailable: true },
            { restaurant: res4._id, dishName: 'Fresh Guacamole & Chips', price: 200, description: 'Mashed avocados with lime, cilantro, jalapeño, and fresh tortilla chips.', nutritionInfo: { calories: 350, protein: 4, fats: 25, carbs: 30 }, isAvailable: true },

            // Hiro Sushi
            { restaurant: res5._id, dishName: 'Spicy Tuna Roll (8 pcs)', price: 550, description: 'Fresh tuna with spicy mayo, cucumber, and toasted sesame seeds.', nutritionInfo: { calories: 320, protein: 22, fats: 10, carbs: 35 }, isAvailable: true },
            { restaurant: res5._id, dishName: 'Salmon Sashimi (6 pcs)', price: 700, description: 'Thick slices of premium fresh Norwegian salmon.', nutritionInfo: { calories: 250, protein: 35, fats: 12, carbs: 0 }, isAvailable: true },
            { restaurant: res5._id, dishName: 'Dragon Roll', price: 850, description: 'Eel and cucumber topped with sliced avocado and eel sauce.', nutritionInfo: { calories: 480, protein: 18, fats: 20, carbs: 55 }, isAvailable: true },

            // Mary's Comfort Food
            { restaurant: kitch1._id, dishName: 'Homestyle Meatloaf', price: 350, description: 'Thick slice of classic meatloaf with brown gravy and mashed potatoes.', nutritionInfo: { calories: 550, protein: 35, fats: 30, carbs: 35 }, isAvailable: true },
            { restaurant: kitch1._id, dishName: 'Chicken Noodle Soup', price: 200, description: 'Hearty broth with pulled chicken, veggies, and egg noodles.', nutritionInfo: { calories: 250, protein: 18, fats: 8, carbs: 25 }, isAvailable: true },

            // Grandma Rosa
            { restaurant: kitch2._id, dishName: 'Hand-Rolled Gnocchi', price: 300, description: 'Soft potato pillows in a rich homemade marinara sauce.', nutritionInfo: { calories: 450, protein: 12, fats: 15, carbs: 65 }, isAvailable: true },
            { restaurant: kitch2._id, dishName: 'Layered Meat Lasagna', price: 400, description: 'Five layers of pasta, ricotta, beef ragu, and melted mozzarella.', nutritionInfo: { calories: 600, protein: 35, fats: 32, carbs: 40 }, isAvailable: true },

            // Bhaiya Ji
            { restaurant: kitch3._id, dishName: 'Chole Bhature (2 pcs)', price: 150, description: 'Spicy chickpea curry served with two large fluffy fried flatbreads.', nutritionInfo: { calories: 750, protein: 15, fats: 35, carbs: 90 }, isAvailable: true },
            { restaurant: kitch3._id, dishName: 'Aloo Tikki Chaat', price: 100, description: 'Crispy potato patties topped with yogurt, chutneys, and spices.', nutritionInfo: { calories: 350, protein: 6, fats: 18, carbs: 45 }, isAvailable: true },

            // Mrs Sharma
            { restaurant: kitch4._id, dishName: 'Dal Makhani Combo', price: 250, description: 'Slow-cooked black lentils served with 2 rotis, rice, and salad.', nutritionInfo: { calories: 500, protein: 18, fats: 15, carbs: 70 }, isAvailable: true },
            { restaurant: kitch4._id, dishName: 'Stuffed Gobi Paratha', price: 120, description: 'Whole wheat flatbread stuffed with spiced cauliflower, served with curd.', nutritionInfo: { calories: 400, protein: 10, fats: 15, carbs: 55 }, isAvailable: true },

            // Jane's Bakery
            { restaurant: kitch5._id, dishName: 'Vegan Chocolate Fudge Cake', price: 250, description: 'Decadent chocolate cake made entirely without dairy or eggs.', nutritionInfo: { calories: 450, protein: 5, fats: 22, carbs: 60 }, isAvailable: true },
            { restaurant: kitch5._id, dishName: 'Gluten-Free Banana Bread', price: 180, description: 'Moist banana bread made with almond flour and dark chocolate chips.', nutritionInfo: { calories: 350, protein: 8, fats: 18, carbs: 42 }, isAvailable: true }
        ]);

        console.log('--- DATABASE SEEDING COMPLETED WITH HEAVY DATASET ---');
        process.exit();
    } catch (error) {
        console.error('SEEDING ERROR:', error);
        process.exit(1);
    }
};

seedData();
