const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/statistics', protect, adminOnly, dashboardController.getStatistics);
router.get('/latest-orders', protect, adminOnly, dashboardController.getLatestOrders);
router.get('/best-sellers', protect, adminOnly, dashboardController.getBestSellers);
router.get('/revenue', protect, adminOnly, dashboardController.getRevenueChart);

module.exports = router;
