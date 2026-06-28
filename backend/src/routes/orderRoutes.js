// ===========================
// ORDER ROUTES (Placeholder)
// ===========================
const express = require('express');
const router = express.Router();

// GET /api/orders
router.get('/', (req, res) => {
  res.json({ message: 'Danh sách đơn hàng (sẽ kết nối DB sau)', data: [] });
});

// GET /api/orders/:id
router.get('/:id', (req, res) => {
  res.json({ message: `Đơn hàng ID: ${req.params.id}`, data: null });
});

// POST /api/orders — Tạo đơn hàng mới
router.post('/', (req, res) => {
  res.json({ message: 'Tạo đơn hàng thành công', data: req.body });
});

// PUT /api/orders/:id — Cập nhật trạng thái đơn hàng
router.put('/:id', (req, res) => {
  res.json({ message: `Cập nhật đơn hàng ID: ${req.params.id}`, data: req.body });
});

module.exports = router;
