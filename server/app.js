const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');
const orderRoutes = require('./routes/orderRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const chefRoutes = require('./routes/chefRoutes');
const deliveryRoutes = require('./routes/deliveryRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const groupOrderRoutes = require('./routes/groupOrderRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const { init } = require('./socket');

dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/chefs', chefRoutes);
app.use('/api/delivery', deliveryRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/group-orders', groupOrderRoutes);
app.use('/api/analytics', analyticsRoutes);

// Basic Route
app.get('/', (req, res) => {
    res.send('EatZy API is running...');
});

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Initialize Socket.io
init(server);

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
