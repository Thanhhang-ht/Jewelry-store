const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: false, // tắt log câu lệnh SQL trên console để dễ nhìn
    timezone: '+07:00', // Khớp múi giờ Việt Nam
    define: {
      timestamps: false // Không tự động sinh createdAt và updatedAt ở mọi bảng trừ khi chỉ định
    }
  }
);

// Test kết nối
sequelize.authenticate()
  .then(() => console.log('✅ Đã kết nối MySQL thành công thông qua Sequelize!'))
  .catch(err => console.error('❌ Lỗi kết nối MySQL:', err));

module.exports = sequelize;
