const express = require('express');
const router = express.Router();
const { getRecommendations, updateGoals } = require('../controllers/recommendationController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getRecommendations);
router.put('/goals', protect, updateGoals);

module.exports = router;
