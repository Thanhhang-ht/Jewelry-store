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
      existingAdmin.password = hashedPass;
      existingAdmin.role = 'admin';
      await existingAdmin.save();
    }

    // 2. ĐẢM BẢO CÓ DANH MỤC
    let catRing = await Category.findOne({ where: { name: 'Nhẫn' } });
    if (!catRing) {
      catRing = await Category.create({ name: 'Nhẫn', description: 'Các mẫu nhẫn bạc, nhẫn đính đá lấp lánh dành cho cả nam và nữ.', status: 'active', image: '../image/emojione-monotone_ring.png' });
    }

    let catNecklace = await Category.findOne({ where: { name: 'Dây chuyền' } });
    if (!catNecklace) {
      catNecklace = await Category.create({ name: 'Dây chuyền', description: 'Mẫu dây chuyền mảnh mai, tinh xảo kết hợp nhiều kiểu mặt đá bắt mắt.', status: 'active', image: '../image/Vector.png' });
    }

    let catBracelet = await Category.findOne({ where: { name: 'Vòng tay' } });
    if (!catBracelet) {
      catBracelet = await Category.create({ name: 'Vòng tay', description: 'Lắc tay, vòng tay bạc mềm mại giúp cổ tay thanh mảnh nổi bật.', status: 'active', image: '../image/game-icons_gem-chain.png' });
    }

    let catEarring = await Category.findOne({ where: { name: 'Bông tai' } });
    if (!catEarring) {
      catEarring = await Category.create({ name: 'Bông tai', description: 'Bông tai nụ, bông tai dáng dài tinh xảo tôn lên nét thanh tú khuôn mặt.', status: 'active', image: '../image/game-icons_drop-earrings.png' });
    }

    // 3. NẠP / ĐỒNG BỘ 24 SẢN PHẨM CHUẨN XÁC TÊN & HÌNH ẢNH
    const sampleProducts = [
      // NHẪN (Rings)
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
        stock: 20,
        status: 'selling',
        image: '../image/image_7.png',
        material: 'Bạc 999',
        description: 'Nhẫn bạc trơn bóng sáng cao cấp chế tác thủ công tỉ mỉ.'
      },
      {
        code: 'SP009',
        name: 'Nhẫn bạc hoa cúc tinh xảo',
        category_id: catRing.id,
        price: 580000,
        stock: 15,
        status: 'selling',
        image: '../image/image_6.png',
        material: 'Bạc 925',
        description: 'Nhẫn thiết kế hình hoa cúc nhỏ nhắn đính đá rạng rỡ.'
      },

      // DÂY CHUYỀN (Necklaces)
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
        code: 'SP012',
        name: 'Dây chuyền bạc hoa tuyết',
        category_id: catNecklace.id,
        price: 730000,
        stock: 28,
        status: 'selling',
        image: '../image/image 14.png',
        material: 'Bạc S925',
        description: 'Dây chuyền bạc cao cấp đính đá hình hoa tuyết kiêu sa.'
      },
      {
        code: 'SP013',
        name: 'Dây chuyền bạc mặt tròn tinh tế',
        category_id: catNecklace.id,
        price: 520000,
        stock: 30,
        status: 'selling',
        image: '../image/image_2.png',
        material: 'Bạc 925',
        description: 'Dây chuyền mặt tròn đính đá đơn giản thanh lịch.'
      },
      {
        code: 'SP015',
        name: 'Dây chuyền bạc đính đá hồng',
        category_id: catNecklace.id,
        price: 850000,
        stock: 18,
        status: 'selling',
        image: '../image/image 15.png',
        material: 'Bạc 925',
        description: 'Dây chuyền đính đá hồng quyến rũ và nữ tính.'
      },
      {
        code: 'SP016',
        name: 'Dây chuyền bạc mặt ngọc trai',
        category_id: catNecklace.id,
        price: 990000,
        stock: 12,
        status: 'selling',
        image: '../image/image 16.png',
        material: 'Bạc 925 & Ngọc trai',
        description: 'Dây chuyền mặt ngọc trai tự nhiên kết hợp chất liệu bạc cao cấp.'
      },

      // VÒNG TAY (Bracelets)
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
        code: 'SP008',
        name: 'Vòng tay kim cương',
        category_id: catBracelet.id,
        price: 870000,
        stock: 15,
        status: 'selling',
        image: '../image/image 10.png',
        material: 'Bạc đính CZ cao cấp',
        description: 'Vòng tay đính đá CZ giả kim cương lấp lánh cuốn hút.'
      },
      {
        code: 'SP014',
        name: 'Vòng tay bạc cao cấp',
        category_id: catBracelet.id,
        price: 570000,
        stock: 25,
        status: 'selling',
        image: '../image/image 11.png',
        material: 'Bạc S925',
        description: 'Vòng tay bạc thiết kế mảnh mai tôn lên nét dịu dàng.'
      },
      {
        code: 'SP017',
        name: 'Lắc tay bạc đính đá lấp lánh',
        category_id: catBracelet.id,
        price: 640000,
        stock: 22,
        status: 'selling',
        image: '../image/image 18.png',
        material: 'Bạc 925',
        description: 'Lắc tay bạc đính đá CZ phong cách lộng lẫy.'
      },
      {
        code: 'SP018',
        name: 'Lắc tay bạc charm cao cấp',
        category_id: catBracelet.id,
        price: 690000,
        stock: 20,
        status: 'selling',
        image: '../image/image 19.png',
        material: 'Bạc S925',
        description: 'Lắc tay phối các hạt charm nhỏ nhắn xinh xắn.'
      },
      {
        code: 'SP019',
        name: 'Vòng tay bạc mạ vàng 18K',
        category_id: catBracelet.id,
        price: 820000,
        stock: 16,
        status: 'selling',
        image: '../image/image 20.png',
        material: 'Bạc 925 mạ Vàng',
        description: 'Vòng tay mạ vàng 18K sang trọng và quý phái.'
      },
      {
        code: 'SP020',
        name: 'Lắc tay bạc đôi quyến rũ',
        category_id: catBracelet.id,
        price: 590000,
        stock: 30,
        status: 'selling',
        image: '../image/image 21.png',
        material: 'Bạc 925',
        description: 'Lắc tay dạng dây đôi mềm mại điểm xuyết đá tinh xảo.'
      },

      // BÔNG TAI (Earrings)
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
        code: 'SP010',
        name: 'Bông tai bạc tinh tế',
        category_id: catEarring.id,
        price: 430000,
        stock: 20,
        status: 'selling',
        image: '../image/image_12.png',
        material: 'Bạc 925',
        description: 'Bông tai bạc dáng nụ đính đá nhỏ xinh xắn.'
      },
      {
        code: 'SP011',
        name: 'Bông tai cao cấp',
        category_id: catEarring.id,
        price: 750000,
        stock: 18,
        status: 'selling',
        image: '../image/image 13.png',
        material: 'Bạc 925',
        description: 'Bông tai đính đá cao cấp phong cách quý phái dự tiệc.'
      },
      {
        code: 'SP021',
        name: 'Bông tai bạc nụ nhỏ xinh',
        category_id: catEarring.id,
        price: 390000,
        stock: 45,
        status: 'selling',
        image: '../image/image 24.png',
        material: 'Bạc S925',
        description: 'Bông tai nụ đính đá lấp lánh phong cách dễ thương.'
      },
      {
        code: 'SP022',
        name: 'Bông tai bạc ngọc trai',
        category_id: catEarring.id,
        price: 450000,
        stock: 30,
        status: 'selling',
        image: '../image/image 25.png',
        material: 'Bạc 925 & Ngọc trai',
        description: 'Bông tai nụ đính hạt ngọc trai nhân tạo cao cấp sang trọng.'
      },
      {
        code: 'SP023',
        name: 'Bông tai tròn bạc cao cấp',
        category_id: catEarring.id,
        price: 510000,
        stock: 35,
        status: 'selling',
        image: '../image/image 26.png',
        material: 'Bạc S925',
        description: 'Bông tai kiểu khuyên tròn phong cách hiện đại cá tính.'
      },
      {
        code: 'SP024',
        name: 'Bông tai dáng dài kiều diễm',
        category_id: catEarring.id,
        price: 620000,
        stock: 20,
        status: 'selling',
        image: '../image/image 23.png',
        material: 'Bạc 925',
        description: 'Bông tai thả dáng dài đính đá lấp lánh làm thon gọn khuôn mặt.'
      }
    ];

    // Nạp lại toàn bộ dữ liệu mẫu chuẩn
    await Product.destroy({ where: {} });
    for (const prod of sampleProducts) {
      await Product.create(prod);
    }
    console.log('✅ Đã nạp thành công 24 sản phẩm trang sức chuẩn tên & hình ảnh!');

    // 4. MÃ GIẢM GIÁ
    const couponCount = await Coupon.count();
    if (couponCount === 0) {
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
    }
  } catch (err) {
    console.error('⚠️ Lỗi tự động nạp dữ liệu mẫu:', err.message);
  }
}

module.exports = seedDatabase;
