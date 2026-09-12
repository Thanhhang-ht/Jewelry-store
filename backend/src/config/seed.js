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

    // 3. NẠP / ĐỒNG BỘ 24 SẢN PHẨM MẪU (NHƯ WEB THẬT)
    const productCount = await Product.count();
    const activeProductCount = await Product.count({ where: { status: 'selling' } });

    if (productCount < 15 || activeProductCount === 0) {
      console.log('🌱 Đang nạp danh sách 24 sản phẩm cao cấp phong phú cho CSDL...');
      
      // Xóa các sản phẩm cũ nếu dính trạng thái sai hoặc ít sản phẩm
      if (productCount > 0 && activeProductCount === 0) {
        await Product.destroy({ where: {} });
      }

      const sampleProducts = [
        // NHẪN (Rings)
        {
          code: 'SP001',
          name: 'Nhẫn bạc đính đá CZ baguette',
          category_id: catRing.id,
          price: 610000,
          stock: 50,
          status: 'selling',
          image: '../image/image 4.png',
          material: 'Bạc 925 đính đá CZ',
          description: 'Nhẫn bạc đính đá CZ baguette lấp lánh mang phong cách sang trọng hiện đại, tinh xảo trong từng đường nét chế tác.'
        },
        {
          code: 'SP005',
          name: 'Nhẫn bạc đính đá Royal Crown',
          category_id: catRing.id,
          price: 460000,
          stock: 30,
          status: 'selling',
          image: '../image/image 6.png',
          material: 'Bạc 925 phủ Bạch Kim',
          description: 'Nhẫn dáng vương miện đính đá quý tinh tế, quý phái, phù hợp đi tiệc và làm quà tặng kỉ niệm.'
        },
        {
          code: 'SP006',
          name: 'Nhẫn bạc trơn Ý Minimalist',
          category_id: catRing.id,
          price: 540000,
          stock: 20,
          status: 'selling',
          image: '../image/image_7.png',
          material: 'Bạc 999 Ý',
          description: 'Nhẫn bạc trơn bóng sáng tối giản phong cách chuẩn Ý, dễ dàng phối hợp cùng mọi trang phục hàng ngày.'
        },
        {
          code: 'SP009',
          name: 'Nhẫn Moissanite Solitaire 1 Carat',
          category_id: catRing.id,
          price: 1250000,
          stock: 15,
          status: 'selling',
          image: '../image/image 11.png',
          material: 'Bạc 925 mạ Vàng Trắng',
          description: 'Mặt đá Moissanite 1 Carat cắt chuẩn 8 trái tim 8 mũi tên lấp lánh hoàn hảo như kim cương tự nhiên.'
        },
        {
          code: 'SP010',
          name: 'Nhẫn bạc đôi Eternity Promise',
          category_id: catRing.id,
          price: 780000,
          stock: 25,
          status: 'selling',
          image: '../image/image 13.png',
          material: 'Bạc S925',
          description: 'Thiết kế nhẫn dải đá CZ nối tiếp tượng trưng cho tình yêu vĩnh cửu không hồi kết.'
        },
        {
          code: 'SP011',
          name: 'Nhẫn nữ Cánh Thiên Thần Sparkle',
          category_id: catRing.id,
          price: 590000,
          stock: 40,
          status: 'selling',
          image: '../image/image 14.png',
          material: 'Bạc Ý 925 đính đá',
          description: 'Đôi cánh thiên thần ôm trọn viên đá chủ màu xanh biển huyền ảo, thu hút mọi ánh nhìn.'
        },

        // DÂY CHUYỀN (Necklaces)
        {
          code: 'SP002',
          name: 'Dây chuyền bạc 102 Elegance',
          category_id: catNecklace.id,
          price: 495000,
          stock: 35,
          status: 'selling',
          image: '../image/image 2.png',
          material: 'Bạc 925',
          description: 'Dây chuyền bạc tinh tế, mặt tròn đính đá CZ trắng thanh lịch, phù hợp phối phụ kiện hàng ngày.'
        },
        {
          code: 'SP007',
          name: 'Dây chuyền bạc nữ Hoa Tuyết Snowflake',
          category_id: catNecklace.id,
          price: 670000,
          stock: 45,
          status: 'selling',
          image: '../image/image 9.png',
          material: 'Bạc S925',
          description: 'Hình tượng hoa tuyết mùa đông thuần khiết tỏa sáng rạng rỡ, tôn nét thanh thuần kiều diễm.'
        },
        {
          code: 'SP012',
          name: 'Dây chuyền Trái Tim Đôi Rose Gold',
          category_id: catNecklace.id,
          price: 850000,
          stock: 18,
          status: 'selling',
          image: '../image/image 15.png',
          material: 'Bạc 925 mạ Vàng Hồng',
          description: 'Trái tim kép kết hợp mạ vàng hồng quyến rũ, quà tặng ngọt ngào cho người thương.'
        },
        {
          code: 'SP013',
          name: 'Dây chuyền bạc Ngọc Trai Natural Pearl',
          category_id: catNecklace.id,
          price: 990000,
          stock: 12,
          status: 'selling',
          image: '../image/image 16.png',
          material: 'Bạc 925 & Ngọc trai nước ngọt',
          description: 'Ngọc trai thiên nhiên tròn trịa đính cùng dây chuyền bạc thanh mảnh nữ tính và quý phái.'
        },
        {
          code: 'SP014',
          name: 'Dây chuyền Cỏ 4 Lá Lucky Shamrock',
          category_id: catNecklace.id,
          price: 520000,
          stock: 30,
          status: 'selling',
          image: '../image/image 17.png',
          material: 'Bạc 925 đính đá Emerald',
          description: 'Biểu tượng may mắn 4 lá với viền đá CZ xanh lấp lánh mang lại vận may cho người đeo.'
        },
        {
          code: 'SP015',
          name: 'Dây chuyền bạc Đá Mặt Trăng Moonstone',
          category_id: catNecklace.id,
          price: 730000,
          stock: 22,
          status: 'selling',
          image: '../image/image 18.png',
          material: 'Bạc Ý 925 & Đá Moonstone',
          description: 'Đá mặt trăng phát quang ánh xanh huyền bí under ánh sáng, phong cách mộng mơ thời thượng.'
        },

        // VÒNG TAY (Bracelets)
        {
          code: 'SP003',
          name: 'Vòng tay bạc PT Charming',
          category_id: catBracelet.id,
          price: 510000,
          stock: 40,
          status: 'selling',
          image: '../image/image_3.png',
          material: 'Bạc 925',
          description: 'Vòng tay bạc cao cấp dạng kiềng mềm dẻo tạo điểm nhấn nhẹ nhàng quyến rũ cho cổ tay.'
        },
        {
          code: 'SP008',
          name: 'Vòng tay Kim Cương CZ Luxe Bracelet',
          category_id: catBracelet.id,
          price: 870000,
          stock: 15,
          status: 'selling',
          image: '../image/image 10.png',
          material: 'Bạc đính CZ cao cấp',
          description: 'Dải đá CZ full vòng lấp lánh tuyệt mỹ, đẳng cấp chuẩn trang sức dự tiệc cao cấp.'
        },
        {
          code: 'SP016',
          name: 'Lắc tay bạc Charm Trái Tim Sweet Love',
          category_id: catBracelet.id,
          price: 640000,
          stock: 28,
          status: 'selling',
          image: '../image/image 19.png',
          material: 'Bạc S925',
          description: 'Lắc tay bạc xích mảnh phối các hạt charm trái tim rơi nhẹ nhàng thanh thoát.'
        },
        {
          code: 'SP017',
          name: 'Vòng tay bạc mạ Vàng 18K Luxury',
          category_id: catBracelet.id,
          price: 1150000,
          stock: 10,
          status: 'selling',
          image: '../image/image 20.png',
          material: 'Bạc 925 mạ Vàng 18K',
          description: 'Lớp mạ vàng 18K sang trọng với khóa cài độc đáo chắc chắn, phối hợp tuyệt vời với đồng hồ.'
        },
        {
          code: 'SP018',
          name: 'Lắc tay bạc Cánh Bướm Butterfly Dream',
          category_id: catBracelet.id,
          price: 580000,
          stock: 32,
          status: 'selling',
          image: '../image/image 21.png',
          material: 'Bạc 925 đính đá',
          description: 'Đôi cánh bướm dập dìu đính đá lấp lánh tôn vẻ thanh tú đài các cho phái đẹp.'
        },
        {
          code: 'SP019',
          name: 'Kiềng tay bạc trơn nguyên chất 999',
          category_id: catBracelet.id,
          price: 490000,
          stock: 50,
          status: 'selling',
          image: '../image/image 22.png',
          material: 'Bạc Ý 999',
          description: 'Kiềng tay bạc trơn bóng sáng nguyên chất 999 chế tác thủ công tỉ mỉ, linh hoạt điều chỉnh.'
        },

        // BÔNG TAI (Earrings)
        {
          code: 'SP004',
          name: 'Bông tai bạc Ngôi Sao Starry Night',
          category_id: catEarring.id,
          price: 480000,
          stock: 25,
          status: 'selling',
          image: '../image/image 5.png',
          material: 'Bạc 925',
          description: 'Bông tai nhỏ xinh hình ngôi sao lấp lánh, làm nổi bật nét dịu dàng và thanh thoát.'
        },
        {
          code: 'SP020',
          name: 'Bông tai dáng dài Giọt Nước Crystal Drop',
          category_id: catEarring.id,
          price: 620000,
          stock: 20,
          status: 'selling',
          image: '../image/image 23.png',
          material: 'Bạc 925 & Pha lê Swarovski',
          description: 'Dáng bông thả dài thanh thoát tạo cảm giác thon gọn và nâng tầm khí chất khuôn mặt.'
        },
        {
          code: 'SP021',
          name: 'Bông tai nụ Nơ Xinh Cute Ribbon',
          category_id: catEarring.id,
          price: 390000,
          stock: 45,
          status: 'selling',
          image: '../image/image 24.png',
          material: 'Bạc S925',
          description: 'Bông tai nụ hình chiếc nơ nhỏ nhắn đính đá tỉ mỉ, đáng yêu tôn lên nụ cười tươi tắn.'
        },
        {
          code: 'SP022',
          name: 'Bông tai vành kẹp Ear Cuff Modern',
          category_id: catEarring.id,
          price: 450000,
          stock: 30,
          status: 'selling',
          image: '../image/image 25.png',
          material: 'Bạc Ý 925',
          description: 'Thiết kế vành kẹp cá tính thời thượng không cần xỏ lỗ tai thứ hai, phong cách hiện đại.'
        },
        {
          code: 'SP023',
          name: 'Bông tai tròn Hoop Earrings Classic',
          category_id: catEarring.id,
          price: 510000,
          stock: 35,
          status: 'selling',
          image: '../image/image 26.png',
          material: 'Bạc 925 mạ Bạch Kim',
          description: 'Khuyên tròn cổ điển bản nhỏ chuẩn phom dáng thời trang quốc tế không lo lỗi mốt.'
        },
        {
          code: 'SP024',
          name: 'Bông tai bạc Ngọc Trai Vintage Queen',
          category_id: catEarring.id,
          price: 790000,
          stock: 15,
          status: 'selling',
          image: '../image/image 27.png',
          material: 'Bạc 925 & Ngọc Trai',
          description: 'Đỉnh cao quý phái phong cách hoàng gia tân cổ điển dành riêng cho các đêm tiệc trang trọng.'
        }
      ];

      for (const prod of sampleProducts) {
        await Product.upsert(prod);
      }
      console.log('✅ Đã nạp thành công 24 sản phẩm trang sức mẫu vào CSDL!');
    } else {
      await Product.update({ status: 'selling' }, { where: { status: ['active', ''] } });
    }

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
