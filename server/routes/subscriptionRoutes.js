const express = require('express');
const router = express.Router();
const { getMySubscription, createSubscription } = require('../controllers/subscriptionController');
const { protect } = require('../middleware/auth');

router.get('/my', protect, getMySubscription);
router.post('/', protect, createSubscription);

module.exports = router;
