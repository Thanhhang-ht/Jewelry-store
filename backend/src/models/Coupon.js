const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Coupon = sequelize.define('Coupon', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  code: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  discount_type: {
    type: DataTypes.ENUM('percent', 'fixed'),
    allowNull: false
  },
  discount_value: {
    type: DataTypes.DECIMAL(12, 0),
    allowNull: false
  },
  min_order_value: {
    type: DataTypes.DECIMAL(12, 0),
    defaultValue: 0
  },
  max_discount_value: {
    type: DataTypes.DECIMAL(12, 0),
    defaultValue: null
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  usage_limit: {
    type: DataTypes.INTEGER,
    defaultValue: null
  },
  used_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active'
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'coupons',
  timestamps: false
});

module.exports = Coupon;
