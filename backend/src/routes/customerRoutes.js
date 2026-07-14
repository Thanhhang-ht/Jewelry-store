const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// ADMIN - Quản lý khách hàng
router.get('/', protect, adminOnly, customerController.getAllCustomers);
router.get('/:id', protect, adminOnly, customerController.getCustomerById);
router.delete('/:id', protect, adminOnly, customerController.deleteCustomer);

module.exports = router;
