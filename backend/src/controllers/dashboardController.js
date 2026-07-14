const { Product, Order, User, OrderItem } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../config/database');

exports.getStatistics = async (req, res) => {
  try {
    const totalProducts = await Product.count();
    const totalOrders = await Order.count();
    const totalCustomers = await User.count({ where: { role: 'user' } });
    const totalRevenue = await Order.sum('total_price', {
      where: {
        status: {
          [Op.in]: ['completed', 'success', 'shipping', 'processing', 'pending'] // Trừ cancelled
        }
      }
    });

    res.json({
      success: true,
      data: {
        totalProducts,
        totalOrders,
        totalCustomers,
        totalRevenue: totalRevenue || 0
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getLatestOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      limit: 5,
      order: [['created_at', 'DESC']]
    });
    
    // Map data to match frontend's expected format
    const mappedOrders = orders.map(o => ({
      orderCode: o.order_code,
      orderDate: new Date(o.created_at).toLocaleString('vi-VN'),
      totalPrice: o.total_price,
      status: o.status
    }));

    res.json({ success: true, data: mappedOrders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getBestSellers = async (req, res) => {
  try {
    const bestSellers = await OrderItem.findAll({
      attributes: [
        'product_id',
        'product_name',
        [sequelize.fn('SUM', sequelize.col('quantity')), 'totalSold']
      ],
      group: ['product_id', 'product_name'],
      order: [[sequelize.literal('totalSold'), 'DESC']],
      limit: 5
    });

    const products = await Promise.all(bestSellers.map(async (item) => {
      const p = await Product.findByPk(item.product_id);
      return {
        productName: item.product_name,
        image: p ? p.image : '../image/image 24.png',
        sold: parseInt(item.dataValues.totalSold, 10)
      };
    }));

    res.json({ success: true, data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getRevenueChart = async (req, res) => {
  try {
    // Trả về doanh thu theo ngày trong 30 ngày gần nhất
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const orders = await Order.findAll({
      where: {
        created_at: {
          [Op.gte]: thirtyDaysAgo
        },
        status: {
          [Op.not]: 'cancelled'
        }
      },
      attributes: [
        [sequelize.fn('DATE', sequelize.col('created_at')), 'date'],
        [sequelize.fn('SUM', sequelize.col('total_price')), 'revenue'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'orders']
      ],
      group: [sequelize.fn('DATE', sequelize.col('created_at'))],
      order: [[sequelize.fn('DATE', sequelize.col('created_at')), 'ASC']]
    });

    res.json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
