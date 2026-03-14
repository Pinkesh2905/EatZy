const express = require('express');
const router = express.Router();
const { toggleStatus, updateLocation, getOptimizedRoute } = require('../controllers/deliveryController');
const { protect, authorize } = require('../middleware/auth');

router.put('/status', protect, authorize('delivery_partner', 'admin'), toggleStatus);
router.put('/location', protect, authorize('delivery_partner', 'admin'), updateLocation);
router.get('/route', protect, authorize('delivery_partner', 'admin'), getOptimizedRoute);

module.exports = router;
