const express = require('express');
const router = express.Router();
const { createGroupOrder, getGroupByCode } = require('../controllers/groupOrderController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createGroupOrder);
router.get('/:code', protect, getGroupByCode);

module.exports = router;
