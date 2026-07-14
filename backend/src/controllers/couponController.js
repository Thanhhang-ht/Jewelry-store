const { Coupon } = require('../models');

// Lấy tất cả mã giảm giá
exports.getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.findAll({ order: [['created_at', 'DESC']] });
    res.json({ success: true, data: coupons });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Lấy danh sách mã giảm giá đang hoạt động (cho trang checkout của khách)
exports.getActiveCoupons = async (req, res) => {
  try {
    const now = new Date();
    const coupons = await Coupon.findAll({
      where: { status: 'active' }
    });
    // Lọc thêm điều kiện thời hạn và lượt dùng
    const validCoupons = coupons.filter(c => {
      const inDate = now >= new Date(c.start_date) && now <= new Date(c.end_date);
      const hasUsage = !c.usage_limit || c.used_count < c.usage_limit;
      return inDate && hasUsage;
    });
    res.json({ success: true, data: validCoupons });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Áp dụng mã giảm giá (kiểm tra hợp lệ)
exports.applyCoupon = async (req, res) => {
  try {
    const { code, orderTotal } = req.body;
    const now = new Date();

    const coupon = await Coupon.findOne({ where: { code, status: 'active' } });
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Mã giảm giá không tồn tại hoặc đã bị khóa!' });
    }
    if (now < new Date(coupon.start_date) || now > new Date(coupon.end_date)) {
      return res.status(400).json({ success: false, message: 'Mã giảm giá đã hết hạn sử dụng!' });
    }
    if (coupon.usage_limit !== null && coupon.used_count >= coupon.usage_limit) {
      return res.status(400).json({ success: false, message: 'Mã giảm giá đã hết lượt sử dụng!' });
    }
    if (orderTotal < Number(coupon.min_order_value)) {
      return res.status(400).json({
        success: false,
        message: `Đơn hàng tối thiểu phải từ ${Number(coupon.min_order_value).toLocaleString()}đ để dùng mã này!`
      });
    }

    let discountAmount = 0;
    if (coupon.discount_type === 'fixed') {
      discountAmount = Number(coupon.discount_value);
    } else {
      discountAmount = (orderTotal * Number(coupon.discount_value)) / 100;
      if (coupon.max_discount_value && discountAmount > Number(coupon.max_discount_value)) {
        discountAmount = Number(coupon.max_discount_value);
      }
    }
    if (discountAmount > orderTotal) discountAmount = orderTotal;

    res.json({
      success: true,
      message: 'Áp dụng mã giảm giá thành công!',
      data: { couponId: coupon.id, code: coupon.code, discountAmount, newTotal: orderTotal - discountAmount }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Thêm mã giảm giá mới (Admin)
exports.createCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({ success: true, message: 'Thêm mã giảm giá thành công!', data: coupon });
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ success: false, message: 'Mã giảm giá này đã tồn tại!' });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

// Cập nhật mã giảm giá (Admin)
exports.updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByPk(req.params.id);
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy mã giảm giá!' });
    }
    await coupon.update(req.body);
    res.json({ success: true, message: 'Cập nhật mã giảm giá thành công!', data: coupon });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Xóa mã giảm giá (Admin)
exports.deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByPk(req.params.id);
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy mã giảm giá!' });
    }
    await coupon.destroy();
    res.json({ success: true, message: 'Xóa mã giảm giá thành công!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
