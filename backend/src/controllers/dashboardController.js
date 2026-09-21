const { Product, Order, User, OrderItem } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../config/database');

function calculateGrowth(current, previous) {
  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }
  const growth = ((current - previous) / previous) * 100;
  return Math.round(growth * 10) / 10;
}

exports.getStatistics = async (req, res) => {
  try {
    const totalProducts = await Product.count();
    const totalOrders = await Order.count();
    const totalCustomers = await User.count({ where: { role: 'user' } });
    const totalRevenue = await Order.sum('total_price', {
      where: {
        status: {
          [Op.in]: ['completed', 'success', 'shipping', 'processing', 'pending']
        }
      }
    });

    // Tính toán số liệu tháng này và tháng trước để tính % tăng/giảm thực tế
    const now = new Date();
    const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

    // 1. Sản phẩm mới
    const productsThisMonth = await Product.count({ where: { created_at: { [Op.gte]: firstDayThisMonth } } });
    const productsLastMonth = await Product.count({ where: { created_at: { [Op.gte]: firstDayLastMonth, [Op.lte]: lastDayLastMonth } } });
    const productsGrowth = calculateGrowth(productsThisMonth, productsLastMonth);

    // 2. Đơn hàng
    const ordersThisMonth = await Order.count({ where: { created_at: { [Op.gte]: firstDayThisMonth } } });
    const ordersLastMonth = await Order.count({ where: { created_at: { [Op.gte]: firstDayLastMonth, [Op.lte]: lastDayLastMonth } } });
    const ordersGrowth = calculateGrowth(ordersThisMonth, ordersLastMonth);

    // 3. Khách hàng mới
    const customersThisMonth = await User.count({ where: { role: 'user', created_at: { [Op.gte]: firstDayThisMonth } } });
    const customersLastMonth = await User.count({ where: { role: 'user', created_at: { [Op.gte]: firstDayLastMonth, [Op.lte]: lastDayLastMonth } } });
    const customersGrowth = calculateGrowth(customersThisMonth, customersLastMonth);

    // 4. Doanh thu
    const revThisMonth = await Order.sum('total_price', {
      where: {
        status: { [Op.in]: ['completed', 'success', 'shipping', 'processing', 'pending'] },
        created_at: { [Op.gte]: firstDayThisMonth }
      }
    }) || 0;
    const revLastMonth = await Order.sum('total_price', {
      where: {
        status: { [Op.in]: ['completed', 'success', 'shipping', 'processing', 'pending'] },
        created_at: { [Op.gte]: firstDayLastMonth, [Op.lte]: lastDayLastMonth }
      }
    }) || 0;
    const revenueGrowth = calculateGrowth(Number(revThisMonth), Number(revLastMonth));

    res.json({
      success: true,
      data: {
        totalProducts,
        totalOrders,
        totalCustomers,
        totalRevenue: Number(totalRevenue || 0),
        productsGrowth,
        ordersGrowth,
        customersGrowth,
        revenueGrowth
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
    const { startDate, endDate } = req.query;
    let whereCondition = {
      status: {
        [Op.not]: 'cancelled'
      }
    };

    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      whereCondition.created_at = {
        [Op.gte]: start,
        [Op.lte]: end
      };
    } else {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      whereCondition.created_at = {
        [Op.gte]: thirtyDaysAgo
      };
    }

    const orders = await Order.findAll({
      where: whereCondition,
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
