const sequelize = require('../config/database');
const User = require('./User');
const Category = require('./Category');
const Product = require('./Product');
const Coupon = require('./Coupon');
const Order = require('./Order');
const OrderItem = require('./OrderItem');

// THIẾT LẬP QUAN HỆ (ASSOCIATIONS)


// 1. Category <-> Product (Một danh mục có nhiều sản phẩm)
Category.hasMany(Product, { foreignKey: 'category_id', as: 'products' });
Product.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

// 2. User <-> Order (Một người dùng có nhiều đơn hàng)
User.hasMany(Order, { foreignKey: 'user_id', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// 3. Coupon <-> Order (Một coupon có thể áp dụng cho nhiều đơn hàng)
Coupon.hasMany(Order, { foreignKey: 'coupon_id', as: 'orders' });
Order.belongsTo(Coupon, { foreignKey: 'coupon_id', as: 'coupon' });

// 4. Order <-> OrderItem (Một đơn hàng có nhiều sản phẩm chi tiết)
Order.hasMany(OrderItem, { foreignKey: 'order_id', as: 'items', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

// 5. Product <-> OrderItem (Một sản phẩm có thể có mặt trong nhiều chi tiết đơn hàng)
Product.hasMany(OrderItem, { foreignKey: 'product_id', as: 'orderItems' });
OrderItem.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

module.exports = {
  sequelize,
  User,
  Category,
  Product,
  Coupon,
  Order,
  OrderItem
};
