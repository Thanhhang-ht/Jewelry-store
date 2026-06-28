const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ===========================
// MIDDLEWARE
// ===========================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===========================
// ROUTES (sẽ bổ sung sau)
// ===========================
// const productRoutes = require('./src/routes/productRoutes');
// const categoryRoutes = require('./src/routes/categoryRoutes');
// const orderRoutes = require('./src/routes/orderRoutes');
// const authRoutes = require('./src/routes/authRoutes');

// app.use('/api/products', productRoutes);
// app.use('/api/categories', categoryRoutes);
// app.use('/api/orders', orderRoutes);
// app.use('/api/auth', authRoutes);

// ===========================
// HEALTH CHECK
// ===========================
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Jewelry Store API đang hoạt động!',
    timestamp: new Date().toISOString()
  });
});

// ===========================
// SERVE FRONTEND
// ===========================
app.use(express.static(path.join(__dirname, '../frontend')));

// Fallback: trả về index.html cho mọi route không khớp
app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/html/index.html'));
});

// ===========================
// START SERVER
// ===========================
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
  console.log(`📦 API endpoint: http://localhost:${PORT}/api/health`);
});
