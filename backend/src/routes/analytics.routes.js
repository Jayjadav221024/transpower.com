const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics.controller');

// Both routes are protected and access-limited to authenticated admins
router.get('/realtime', analyticsController.getRealTimeStats);
router.get('/historical', analyticsController.getHistoricalStats);

module.exports = router;
