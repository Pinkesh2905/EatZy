// server.js

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

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- IMPORTANT: DEFINE YOUR API ROUTES HERE, BEFORE ANY WILDCARD OR GENERAL STATIC FILE SERVING ---
app.use("/api/auth", authRoutes);
app.use("/api/foods", foodRoutes);
app.use("/api/foods", reviewRoutes); // This is correctly structured with :foodId inside reviewRoutes
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

// Optional: A basic root route for API status
app.get("/", (req, res) => {
  res.send("Food Delivery API is running");
});

// --- IMPORTANT: SERVE YOUR FRONTEND STATIC FILES ---
// This should come after your API routes so API requests don't get intercepted.
app.use(express.static(path.join(__dirname, 'public'))); // Assuming your Angular build output is in 'public'

// --- IMPORTANT: THE WILDCARD ROUTE FOR SPA CLIENT-SIDE ROUTING (MUST BE THE VERY LAST) ---
// This route will catch any request not handled by the API routes or static files,
// and serve your frontend's index.html, allowing Angular to handle client-side routing.
app.get('*', (req, res) => {
  // Ensure 'frontend' is the correct subdirectory for your index.html
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});