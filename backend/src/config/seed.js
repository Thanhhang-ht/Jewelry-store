const bcrypt = require('bcryptjs');
const { Category, Product, Coupon, User } = require('../models');

async function seedDatabase() {
  try {
    // 1. LUÔN ĐẢM BẢO TÀI KHOẢN ADMIN TỒN TẠI VÀ MẬT KHẨU LÀ 123456
    const hashedPass = await bcrypt.hash('123456', 10);
    const existingAdmin = await User.findOne({ where: { email: 'admin@jewelrystore.com' } });
    
    if (!existingAdmin) {
      await User.create({
        fullname: 'Quản Trị Viên',
        email: 'admin@jewelrystore.com',
        password: hashedPass,
        role: 'admin',
        phone: '0900000000',
        address: 'TP. Hồ Chí Minh'
      });
      console.log('🔑 Đã khởi tạo tài khoản Admin: admin@jewelrystore.com / 123456');
    } else {
      // Cập nhật lại mật khẩu chuẩn 123456 nếu tài khoản đã tồn tại
      existingAdmin.password = hashedPass;
      existingAdmin.role = 'admin';
      await existingAdmin.save();
      console.log('🔑 Đã đồng bộ mật khẩu Admin về: 123456');
    }

    // 2. Nạp dữ liệu danh mục & sản phẩm nếu CSDL chưa có
    const categoryCount = await Category.count();
    if (categoryCount === 0) {
      console.log('🌱 Đang nạp dữ liệu mẫu (Seeding Database)...');

      // Tạo Danh mục
      const catRing = await Category.create({ name: 'Nhẫn', description: 'Các mẫu nhẫn bạc, nhẫn đính đá lấp lánh dành cho cả nam và nữ.', status: 'active', image: '../image/emojione-monotone_ring.png' });
      const catNecklace = await Category.create({ name: 'Dây chuyền', description: 'Mẫu dây chuyền mảnh mai, tinh xảo kết hợp nhiều kiểu mặt đá bắt mắt.', status: 'active', image: '../image/Vector.png' });
      const catBracelet = await Category.create({ name: 'Vòng tay', description: 'Lắc tay, vòng tay bạc mềm mại giúp cổ tay thanh mảnh nổi bật.', status: 'active', image: '../image/game-icons_gem-chain.png' });
      const catEarring = await Category.create({ name: 'Bông tai', description: 'Bông tai nụ, bông tai dáng dài tinh xảo tôn lên nét thanh tú khuôn mặt.', status: 'active', image: '../image/game-icons_drop-earrings.png' });

      // Tạo Sản phẩm
      await Product.bulkCreate([
        {
          code: 'SP001',
          name: 'Nhẫn bạc đính đá CZ',
          category_id: catRing.id,
          price: 610000,
          stock: 50,
          status: 'selling',
          image: '../image/image 4.png',
          material: 'Bạc 925',
          description: 'Nhẫn bạc đính đá CZ lấp lánh mang phong cách hiện đại, tinh xảo trong từng đường nét chế tác.'
        },
        {
          code: 'SP002',
          name: 'Dây chuyền bạc 102',
          category_id: catNecklace.id,
          price: 495000,
          stock: 35,
          status: 'selling',
          image: '../image/image 2.png',
          material: 'Bạc 925',
          description: 'Dây chuyền bạc tinh tế, tối giản nhưng thanh lịch, phù hợp làm phụ kiện hàng ngày.'
        },
        {
          code: 'SP003',
          name: 'Vòng tay bạc PT',
          category_id: catBracelet.id,
          price: 510000,
          stock: 40,
          status: 'selling',
          image: '../image/image_3.png',
          material: 'Bạc 925',
          description: 'Vòng tay bạc cao cấp tạo điểm nhấn nhẹ nhàng cho cổ tay phái nữ.'
        },
        {
          code: 'SP004',
          name: 'Bông tai bạc ngôi sao',
          category_id: catEarring.id,
          price: 480000,
          stock: 25,
          status: 'selling',
          image: '../image/image 5.png',
          material: 'Bạc 925',
          description: 'Bông tai nhỏ xinh hình ngôi sao lấp lánh, làm nổi bật nét dịu dàng và thanh thoát.'
        },
        {
          code: 'SP005',
          name: 'Nhẫn bạc đính đá cao cấp',
          category_id: catRing.id,
          price: 460000,
          stock: 30,
          status: 'selling',
          image: '../image/image 6.png',
          material: 'Bạc 925',
          description: 'Nhẫn bạc đính đá tinh tế thiết kế sang trọng phù hợp đi tiệc.'
        },
        {
          code: 'SP006',
          name: 'Nhẫn bạc trơn cao cấp',
          category_id: catRing.id,
          price: 540000,
          stock: 12,
          status: 'selling',
          image: '../image/image_7.png',
          material: 'Bạc 999',
          description: 'Nhẫn bạc trơn bóng sáng cao cấp chế tác thủ công tỉ mỉ.'
        },
        {
          code: 'SP007',
          name: 'Dây chuyền bạc nữ cao cấp',
          category_id: catNecklace.id,
          price: 670000,
          stock: 45,
          status: 'selling',
          image: '../image/image 9.png',
          material: 'Bạc S925',
          description: 'Dây chuyền thiết kế hoa tuyết cách điệu mang phong cách nữ tính thanh thuần.'
        },
        {
          code: 'SP008',
          name: 'Vòng tay kim cương',
          category_id: catBracelet.id,
          price: 870000,
          stock: 10,
          status: 'selling',
          image: '../image/image 10.png',
          material: 'Bạc đính CZ cao cấp',
          description: 'Vòng tay đính đá cz giả kim cương lấp lánh cuốn hút.'
        }
      ]);

      // Tạo Mã giảm giá
      await Coupon.bulkCreate([
        {
          code: 'GIAM10',
          discount_type: 'percent',
          discount_value: 10,
          min_order_value: 400000,
          max_discount_value: 100000,
          start_date: '2026-01-01',
          end_date: '2026-12-31',
          usage_limit: 100,
          used_count: 5,
          status: 'active'
        },
        {
          code: 'WELCOME50',
          discount_type: 'fixed',
          discount_value: 50000,
          min_order_value: 300000,
          max_discount_value: 50000,
          start_date: '2026-01-01',
          end_date: '2026-12-31',
          usage_limit: 200,
          used_count: 10,
          status: 'active'
        }
      ]);

      console.log('✅ Nạp dữ liệu mẫu hoàn tất!');
    }
  } catch (err) {
    console.error('⚠️ Lỗi tự động nạp dữ liệu mẫu:', err.message);
  }
}

module.exports = seedDatabase;
