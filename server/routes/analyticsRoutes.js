const express = require('express');
const router = express.Router();
const { getAdminStats, getRestaurantStats } = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/auth');

router.get('/admin', protect, authorize('admin'), getAdminStats);
router.get('/restaurant/:id', protect, getRestaurantStats);

module.exports = router;
