const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// PUBLIC - Khách xem mã giảm giá còn hiệu lực
router.get('/active', couponController.getActiveCoupons);
router.post('/apply', couponController.applyCoupon);

// ADMIN - Quản lý mã giảm giá
router.get('/', protect, adminOnly, couponController.getAllCoupons);
router.post('/', protect, adminOnly, couponController.createCoupon);
router.put('/:id', protect, adminOnly, couponController.updateCoupon);
router.delete('/:id', protect, adminOnly, couponController.deleteCoupon);

module.exports = router;
