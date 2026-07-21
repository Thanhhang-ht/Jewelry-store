const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config(); // Load các biến môi trường từ .env

// Kết nối Database (Sequelize)
const { sequelize } = require("./src/models");

const app = express();
const PORT = process.env.PORT || 3000;

// MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===========================
// ROUTES
// ===========================
const authRoutes = require('./src/routes/authRoutes');
const productRoutes = require('./src/routes/productRoutes');
const categoryRoutes = require('./src/routes/categoryRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const couponRoutes = require('./src/routes/couponRoutes');
const customerRoutes = require('./src/routes/customerRoutes');
const dashboardRoutes = require('./src/routes/dashboardRoutes');

// Định tuyến API
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/dashboard', dashboardRoutes);

// HEALTH CHECK
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Jewelry Store API đang hoạt động!",
    timestamp: new Date().toISOString(),
  });
});

// SERVE FRONTEND
app.use(express.static(path.join(__dirname, "../frontend")));

// Fallback: trả về index.html cho mọi route không khớp (hỗ trợ client-side routing)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/html/index.html"));
});

// ===========================
// START SERVER & CONNECT DB
// ===========================
sequelize.sync({ force: false }) // force: false để không xóa bảng cũ khi khởi động lại
  .then(() => {
    console.log("✅ Đồng bộ Database MySQL thành công!");
    app.listen(PORT, () => {
      console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
      console.log(`📦 API endpoint: http://localhost:${PORT}/api/health`);
    });
  })
  .catch((err) => {
    console.error("❌ Lỗi kết nối hoặc đồng bộ Database:", err);
  });

