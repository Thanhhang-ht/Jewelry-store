const { Product, Category } = require('../models');

// Lấy tất cả sản phẩm
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [{ model: Category, as: 'category', attributes: ['id', 'name'] }],
      order: [['created_at', 'DESC']]
    });
    res.json({ success: true, data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Lấy sản phẩm theo ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{ model: Category, as: 'category', attributes: ['id', 'name'] }]
    });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm!' });
    }
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Thêm sản phẩm mới (Admin)
exports.createProduct = async (req, res) => {
  try {
    const { code, name, price, stock, image, material, description, status, category_id } = req.body;
    const product = await Product.create({ code, name, price, stock, image, material, description, status, category_id });
    res.status(201).json({ success: true, message: 'Thêm sản phẩm thành công!', data: product });
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ success: false, message: 'Mã sản phẩm đã tồn tại!' });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

// Cập nhật sản phẩm (Admin)
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm!' });
    }
    await product.update(req.body);
    res.json({ success: true, message: 'Cập nhật sản phẩm thành công!', data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Xóa sản phẩm (Admin)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm!' });
    }
    await product.destroy();
    res.json({ success: true, message: 'Xóa sản phẩm thành công!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
