const { Order, OrderItem, Product, Coupon } = require('../models');

// Lấy tất cả đơn hàng (Admin)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [{ model: OrderItem, as: 'items' }],
      order: [['created_at', 'DESC']]
    });
    res.json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Lấy đơn hàng theo ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [{ model: OrderItem, as: 'items' }]
    });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng!' });
    }
    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Tạo đơn hàng mới (Khách hàng đặt hàng)
exports.createOrder = async (req, res) => {
  try {
    const { customer_name, phone, shipping_address, payment_method, note, coupon_code, items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Đơn hàng phải có ít nhất 1 sản phẩm!' });
    }

    // 1. Tính tổng tiền từ danh sách sản phẩm
    let totalPrice = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      if (!product) {
        return res.status(404).json({ success: false, message: `Không tìm thấy sản phẩm ID: ${item.productId}` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ success: false, message: `Sản phẩm "${product.name}" chỉ còn ${product.stock} sản phẩm trong kho!` });
      }
      const lineTotal = Number(product.price) * item.quantity;
      totalPrice += lineTotal;
      orderItems.push({
        product_id: product.id,
        product_name: product.name,
        quantity: item.quantity,
        price: Number(product.price)
      });
    }

    // 2. Xử lý mã giảm giá (nếu có)
    let discountAmount = 0;
    let couponId = null;

    if (coupon_code && coupon_code !== 'NONE') {
      const coupon = await Coupon.findOne({ where: { code: coupon_code, status: 'active' } });
      if (coupon) {
        const now = new Date();
        if (now >= new Date(coupon.start_date) && now <= new Date(coupon.end_date)) {
          if (!coupon.usage_limit || coupon.used_count < coupon.usage_limit) {
            if (totalPrice >= Number(coupon.min_order_value)) {
              if (coupon.discount_type === 'percent') {
                discountAmount = (totalPrice * Number(coupon.discount_value)) / 100;
                if (coupon.max_discount_value && discountAmount > Number(coupon.max_discount_value)) {
                  discountAmount = Number(coupon.max_discount_value);
                }
              } else {
                discountAmount = Number(coupon.discount_value);
              }
              if (discountAmount > totalPrice) discountAmount = totalPrice;
              couponId = coupon.id;

              // Tăng số lượt sử dụng
              await coupon.update({ used_count: coupon.used_count + 1 });
            }
          }
        }
      }
    }

    // 3. Tạo mã đơn hàng
    const lastOrder = await Order.findOne({ order: [['id', 'DESC']] });
    const nextId = lastOrder ? lastOrder.id + 1 : 1;
    const orderCode = `DH${String(nextId).padStart(3, '0')}`;

    // 4. Lưu đơn hàng
    const order = await Order.create({
      order_code: orderCode,
      user_id: req.user ? req.user.id : null,
      customer_name,
      phone,
      shipping_address,
      total_price: totalPrice - discountAmount,
      status: 'pending',
      payment_method: payment_method || 'cod',
      note,
      coupon_id: couponId,
      discount_amount: discountAmount
    });

    // 5. Lưu chi tiết đơn hàng + trừ tồn kho
    for (const item of orderItems) {
      await OrderItem.create({ order_id: order.id, ...item });
      await Product.update(
        { stock: require('sequelize').literal(`stock - ${item.quantity}`) },
        { where: { id: item.product_id } }
      );
    }

    res.status(201).json({
      success: true,
      message: `Đặt hàng thành công! Mã đơn hàng: ${orderCode}`,
      data: { orderCode, totalPrice: totalPrice - discountAmount, discountAmount }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Cập nhật trạng thái đơn hàng (Admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng!' });
    }
    const { status } = req.body;
    await order.update({ status });
    res.json({ success: true, message: 'Cập nhật trạng thái đơn hàng thành công!', data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
