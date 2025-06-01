const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();

// Serve frontend static files
app.use(express.static(path.join(__dirname, 'public')));

// For any other route, serve index.html (for SPA routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});



const PORT = process.env.PORT || 3000;

const authRoutes = require("./backend/routes/authRoutes");
const foodRoutes = require("./backend/routes/foodRoutes");
// const reviewRoutes = require("./backend/routes/reviewRoutes");
const orderRoutes = require("./backend/routes/orderRoutes");
const favoriteRoutes = require("./backend/routes/favoriteRoutes");
const adminRoutes = require("./backend/routes/adminRoutes");
const restaurantRoutes = require("./backend/routes/restaurantRoutes");

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/foods", foodRoutes); 
// app.use("/api/foods", reviewRoutes); 
app.use("/api/orders", orderRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/restaurant", restaurantRoutes);

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

app.get("/", (req, res) => {
  res.send("Food Delivery API is running");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
