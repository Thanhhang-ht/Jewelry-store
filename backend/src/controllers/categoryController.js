const { Category, Product } = require('../models');

// Lấy tất cả danh mục (kèm số lượng sản phẩm đang hoạt động)
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      include: [{
        model: Product,
        as: 'products',
        attributes: ['id', 'status']
      }],
      order: [['created_at', 'DESC']]
    });

    const categoriesWithCount = categories.map(cat => {
      const plain = cat.get({ plain: true });
      const activeProducts = (plain.products || []).filter(p => p.status === 'active');
      plain.productCount = activeProducts.length;
      return plain;
    });

    res.json({ success: true, data: categoriesWithCount });
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
    const plain = category.get({ plain: true });
    const activeProducts = (plain.products || []).filter(p => p.status === 'active');
    plain.productCount = activeProducts.length;
    res.json({ success: true, data: plain });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Thêm danh mục mới (Admin)
exports.createCategory = async (req, res) => {
  try {
    const { name, description, image, status } = req.body;
    const category = await Category.create({
      name,
      description,
      image,
      status: status || 'active'
    });
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

// Xóa mềm danh mục (Admin) - Ẩn trên web, giữ lại dữ liệu CSDL MySQL
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy danh mục!' });
    }
    // Cập nhật trạng thái sang hidden (chỉ ẩn trên website, lưu nguyên dữ liệu CSDL)
    await category.update({ status: 'hidden' });
    res.json({ success: true, message: 'Đã ẩn danh mục khỏi website thành công (Dữ liệu CSDL vẫn được lưu trữ)!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
