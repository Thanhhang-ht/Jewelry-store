const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// PUBLIC - Khách đặt hàng
router.post('/', orderController.createOrder);

// ADMIN - Quản lý đơn hàng
router.get('/', protect, adminOnly, orderController.getAllOrders);
router.get('/:id', protect, adminOnly, orderController.getOrderById);
router.put('/:id/status', protect, adminOnly, orderController.updateOrderStatus);

module.exports = router;
