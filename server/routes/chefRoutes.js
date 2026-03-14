const express = require('express');
const router = express.Router();
const { getMyKitchen, updateKitchen } = require('../controllers/chefController');
const { protect } = require('../middleware/auth');

router.get('/my-kitchen', protect, getMyKitchen);
router.put('/my-kitchen', protect, updateKitchen);

module.exports = router;
