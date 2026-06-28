// ===========================
// AUTH ROUTES (Placeholder)
// ===========================
const express = require('express');
const router = express.Router();

// POST /api/auth/register — Đăng ký
router.post('/register', (req, res) => {
  const { fullname, email, password } = req.body;
  res.json({ message: 'Đăng ký thành công (chưa kết nối DB)', data: { fullname, email } });
});

// POST /api/auth/login — Đăng nhập
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  res.json({ message: 'Đăng nhập thành công (chưa kết nối DB)', token: 'fake-jwt-token' });
});

// POST /api/auth/logout — Đăng xuất
router.post('/logout', (req, res) => {
  res.json({ message: 'Đăng xuất thành công' });
});

module.exports = router;
