// ===========================
// PRODUCT ROUTES (Placeholder)
// ===========================
const express = require('express');
const router = express.Router();

// GET /api/products — Lấy tất cả sản phẩm
router.get('/', (req, res) => {
  res.json({ message: 'Danh sách sản phẩm (sẽ kết nối DB sau)', data: [] });
});

// GET /api/products/:id — Lấy sản phẩm theo ID
router.get('/:id', (req, res) => {
  res.json({ message: `Sản phẩm ID: ${req.params.id}`, data: null });
});

// POST /api/products — Thêm sản phẩm mới
router.post('/', (req, res) => {
  res.json({ message: 'Thêm sản phẩm thành công', data: req.body });
});

// PUT /api/products/:id — Cập nhật sản phẩm
router.put('/:id', (req, res) => {
  res.json({ message: `Cập nhật sản phẩm ID: ${req.params.id}`, data: req.body });
});

// DELETE /api/products/:id — Xóa sản phẩm
router.delete('/:id', (req, res) => {
  res.json({ message: `Xóa sản phẩm ID: ${req.params.id}` });
});

module.exports = router;
