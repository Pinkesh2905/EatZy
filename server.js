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

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- API Routes (MUST COME BEFORE THE WILDCARD ROUTE) ---
app.use("/api/auth", authRoutes); //
app.use("/api/foods", foodRoutes); //
// The review routes are already structured to take :foodId at their root.
// If you want reviews under /api/foods/:foodId/reviews,
// you'd typically have a route like app.get("/:foodId/reviews", ...) in foodRoutes
// OR ensure reviewRoutes handle a full path if mounted differently.
// Given your current reviewRoutes.js, mounting it under /api/foods
// will lead to paths like /api/foods/:foodId/reviews. This is fine.
app.use("/api/foods", reviewRoutes); //
app.use("/api/orders", orderRoutes); //
app.use("/api/favorites", favoriteRoutes); //
app.use("/api/admin", adminRoutes); //
app.use("/api/restaurant", restaurantRoutes); //


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

app.get("/", (req, res) => { //
  res.send("Food Delivery API is running"); //
});

// Serve frontend static files AFTER your API routes
app.use(express.static(path.join(__dirname, 'public'))); //

// For any other route (SPA routing), this MUST be the last route defined
app.get('*', (req, res) => { //
  res.sendFile(path.join(__dirname, 'frontend', 'index.html')); //
});


app.listen(PORT, () => { //
  console.log(`Server running on http://localhost:${PORT}`); //
});