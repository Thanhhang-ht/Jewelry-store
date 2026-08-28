const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect, adminOnly, optionalAuth } = require('../middleware/authMiddleware');

// PUBLIC & USER - Khách đặt hàng & Xem đơn cá nhân
router.post('/', optionalAuth, orderController.createOrder);
router.get('/my-orders', protect, orderController.getMyOrders);

// ADMIN - Quản lý đơn hàng
router.get('/', protect, adminOnly, orderController.getAllOrders);
router.get('/:id', protect, adminOnly, orderController.getOrderById);
router.put('/:id/status', protect, adminOnly, orderController.updateOrderStatus);

module.exports = router;
