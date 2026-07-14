const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  order_code: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  user_id: {
    type: DataTypes.INTEGER
  },
  customer_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING(15),
    allowNull: false
  },
  shipping_address: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  total_price: {
    type: DataTypes.DECIMAL(12, 0),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'processing', 'shipping', 'completed', 'cancelled'),
    defaultValue: 'pending'
  },
  payment_method: {
    type: DataTypes.ENUM('cod', 'bank'),
    defaultValue: 'cod'
  },
  note: {
    type: DataTypes.TEXT
  },
  coupon_id: {
    type: DataTypes.INTEGER
  },
  discount_amount: {
    type: DataTypes.DECIMAL(12, 0),
    defaultValue: 0
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'orders',
  timestamps: false
});

module.exports = Order;
