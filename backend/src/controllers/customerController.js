const { User } = require('../models');

// Lấy danh sách tất cả khách hàng (Admin)
exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await User.findAll({
      where: { role: 'user' },
      attributes: { exclude: ['password'] },
      order: [['created_at', 'DESC']]
    });
    res.json({ success: true, data: customers });
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
