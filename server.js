// server.js (Corrected Structure)

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();

const PORT = process.env.PORT || 3000;

// Import your routes
const authRoutes = require("./backend/routes/authRoutes");
const foodRoutes = require("./backend/routes/foodRoutes");
const reviewRoutes = require("./backend/routes/reviewRoutes");
const orderRoutes = require("./backend/routes/orderRoutes");
const favoriteRoutes = require("./backend/routes/favoriteRoutes");
const adminRoutes = require("./backend/routes/adminRoutes");
const restaurantRoutes = require("./backend/routes/restaurantRoutes");

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// **Crucial: Define your API routes FIRST**
// These are your backend endpoints that should handle specific API requests.
app.use("/api/auth", authRoutes);
app.use("/api/foods", foodRoutes);
// reviewRoutes define paths like '/:foodId/reviews'.
// When mounted at '/api/foods', they become '/api/foods/:foodId/reviews', which is correct.
app.use("/api/foods", reviewRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/restaurant", restaurantRoutes);

// Database Connection
mongoose
  .connect(
    "mongodb+srv://pinkesh:Pinkuu2905@cluster0.qsxjydv.mongodb.net/foodapp?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Basic root route for API status (optional, but good for health checks)
app.get("/", (req, res) => {
  res.send("Food Delivery API is running");
});

// **Crucial: Serve static files for your frontend application**
// This should come BEFORE the wildcard route, but AFTER your API routes.
// Assuming your client-side build output (like React/Angular/Vue build) is in 'public' or 'frontend'.
// Based on your original server.js: app.use(express.static(path.join(__dirname, 'public')));
// If your index.html is in 'frontend' and other assets in 'public', you might need two static serves
// or ensure 'public' contains everything. For simplicity, let's assume 'public' is the main static folder.
app.use(express.static(path.join(__dirname, 'public'))); // This serves files like CSS, JS, images

// **Crucial: The wildcard route for SPA routing (MUST BE THE LAST ROUTE)**
// This catches all routes that haven't been handled by previous API or static file middleware.
// It ensures that direct access to client-side routes (e.g., /dashboard) serves your index.html.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html')); // Assuming index.html is in a 'frontend' subfolder
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});