const { User, Order } = require('../models');
const { Op } = require('sequelize');

// Lấy danh sách tất cả khách hàng kèm thống kê thực tế (Admin)
exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await User.findAll({
      where: { role: 'user' },
      attributes: { exclude: ['password'] },
      order: [['created_at', 'DESC']]
    });

    const customersWithStats = await Promise.all(customers.map(async (c) => {
      const plainUser = c.get({ plain: true });
      
      const conditions = [{ user_id: c.id }];
      if (c.phone && c.phone.trim() !== '') {
        conditions.push({ phone: c.phone.trim() });
      }

      const totalOrders = await Order.count({
        where: { [Op.or]: conditions }
      });

      const totalSpentSum = await Order.sum('total_price', {
        where: {
          [Op.or]: conditions,
          status: { [Op.not]: 'cancelled' }
        }
      });

      plainUser.totalOrders = totalOrders || 0;
      plainUser.totalSpent = totalSpentSum || 0;
      return plainUser;
    }));

    res.json({ success: true, data: customersWithStats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Lấy thông tin khách hàng theo ID (Admin)
exports.getCustomerById = async (req, res) => {
  try {
    const customer = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy khách hàng!' });
    }
    res.json({ success: true, data: customer });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Xóa khách hàng (Admin)
exports.deleteCustomer = async (req, res) => {
  try {
    const customer = await User.findByPk(req.params.id);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy khách hàng!' });
    }
    await customer.destroy();
    res.json({ success: true, message: 'Xóa khách hàng thành công!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
