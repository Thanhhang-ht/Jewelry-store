// ===========================
// CATEGORY ROUTES (Placeholder)
// ===========================
const express = require('express');
const router = express.Router();

// GET /api/categories
router.get('/', (req, res) => {
  res.json({ message: 'Danh sách danh mục (sẽ kết nối DB sau)', data: [] });
});

// GET /api/categories/:id
router.get('/:id', (req, res) => {
  res.json({ message: `Danh mục ID: ${req.params.id}`, data: null });
});

// POST /api/categories
router.post('/', (req, res) => {
  res.json({ message: 'Thêm danh mục thành công', data: req.body });
});

// PUT /api/categories/:id
router.put('/:id', (req, res) => {
  res.json({ message: `Cập nhật danh mục ID: ${req.params.id}`, data: req.body });
});

// DELETE /api/categories/:id
router.delete('/:id', (req, res) => {
  res.json({ message: `Xóa danh mục ID: ${req.params.id}` });
});

module.exports = router;
