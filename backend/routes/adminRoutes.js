const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const User = require("../models/User");
const Food = require("../models/Food");
const verifyToken = require("../middleware/verifyToken");

async function verifyAdmin(req, res, next) {
  try {
    const user = await User.findById(req.userId);
    if (!user || user.isAdmin !== true) {
      return res.status(403).json({ message: "Admin access required" });
    }
    next();
  } catch (err) {
    res.status(500).json({ message: "Server error in admin check" });
  }
}

router.get("/users", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const users = await User.find({}, "username email isAdmin");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

router.get("/foods", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const foods = await Food.find({});
    res.json(foods);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch foods" });
  }
});

router.get("/orders", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .populate("userId", "username email");

    const formatted = orders.map((order) => ({
      _id: order._id,
      userId: order.userId?._id || null,
      userEmail: order.userId?.email || "",
      username: order.userId?.username || "",
      total: order.total,
      status: order.status,
      createdAt: order.createdAt,
      items: order.items,
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

router.put("/orders/:id/status", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json({ message: "Order status updated", order });
  } catch (err) {
    res.status(500).json({ message: "Failed to update status" });
  }
});

router.get("/restaurant-requests", verifyToken, async (req, res) => {
  try {
    const admin = await User.findById(req.userId);
    if (!admin || admin.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const pendingRestaurants = await User.find({
      role: "restaurant",
      "restaurantDetails.approved": false,
    });

    res.json(pendingRestaurants);
  } catch (err) {
    res.status(500).json({ message: "Error loading requests" });
  }
});

router.put("/approve-restaurant/:id", verifyToken, async (req, res) => {
  try {
    const admin = await User.findById(req.userId);
    if (!admin || admin.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const restaurant = await User.findByIdAndUpdate(
      req.params.id,
      { "restaurantDetails.approved": true },
      { new: true }
    );

    res.json({ message: "Restaurant approved", restaurant });
  } catch (err) {
    res.status(500).json({ message: "Error approving restaurant" });
  }
});

router.delete("/reject-restaurant/:id", verifyToken, async (req, res) => {
  try {
    const admin = await User.findById(req.userId);
    if (!admin || admin.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Restaurant rejected and removed" });
  } catch (err) {
    res.status(500).json({ message: "Error rejecting restaurant" });
  }
});

module.exports = router;
