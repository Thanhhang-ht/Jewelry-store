const { Category, Product } = require('../models');

// Lấy tất cả danh mục
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      order: [['created_at', 'DESC']]
    });
    res.json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Lấy danh mục theo ID (kèm danh sách sản phẩm thuộc danh mục)
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id, {
      include: [{ model: Product, as: 'products' }]
    });
    if (!category) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy danh mục!' });
    }
    res.json({ success: true, data: category });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Thêm danh mục mới (Admin)
exports.createCategory = async (req, res) => {
  try {
    const { name, description, image, status } = req.body;
    const category = await Category.create({ name, description, image, status });
    res.status(201).json({ success: true, message: 'Thêm danh mục thành công!', data: category });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Cập nhật danh mục (Admin)
exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy danh mục!' });
    }
    await category.update(req.body);
    res.json({ success: true, message: 'Cập nhật danh mục thành công!', data: category });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Xóa danh mục (Admin)
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy danh mục!' });
    }
    await category.destroy();
    res.json({ success: true, message: 'Xóa danh mục thành công!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
