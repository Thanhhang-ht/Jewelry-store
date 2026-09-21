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

    // 3. NẠP / ĐỒNG BỘ 8 SẢN PHẨM MẪU GỐC BAN ĐẦU
    const originalProducts = [
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
    ];

    // Làm sạch và đồng bộ đúng 8 sản phẩm gốc ban đầu
    await Product.destroy({ where: {} });
    for (const prod of originalProducts) {
      await Product.create(prod);
    }
    console.log('✅ Đã khôi phục lại đúng 8 sản phẩm gốc ban đầu!');

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

    // 5. ĐƠN HÀNG MẪU NẾU CHƯA CÓ
    const orderCount = await Order.count();
    if (orderCount === 0) {
      const { OrderItem } = require('../models');
      const now = new Date();
      
      const sampleOrders = [
        {
          order_code: 'DH1001',
          customer_name: 'Nguyễn Văn An',
          phone: '0912345678',
          shipping_address: '123 Nguyễn Huệ, Q.1, TP.HCM',
          total_price: 1105000,
          status: 'completed',
          payment_method: 'cod',
          created_at: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000)
        },
        {
          order_code: 'DH1002',
          customer_name: 'Trần Thị Bình',
          phone: '0987654321',
          shipping_address: '45 Lê Lợi, Q.1, TP.HCM',
          total_price: 975000,
          status: 'completed',
          payment_method: 'bank',
          created_at: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000)
        },
        {
          order_code: 'DH1003',
          customer_name: 'Lê Hoàng Nam',
          phone: '0933112233',
          shipping_address: '78 Điện Biên Phủ, Q.Bình Thạnh, TP.HCM',
          total_price: 670000,
          status: 'shipping',
          payment_method: 'cod',
          created_at: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000)
        },
        {
          order_code: 'DH1004',
          customer_name: 'Phạm Minh Anh',
          phone: '0977889900',
          shipping_address: '12 Cầu Giấy, Hà Nội',
          total_price: 1380000,
          status: 'processing',
          payment_method: 'bank',
          created_at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)
        },
        {
          order_code: 'DH1005',
          customer_name: 'Võ Thị Hoa',
          phone: '0905123456',
          shipping_address: '99 Trần Phú, Hải Châu, Đà Nẵng',
          total_price: 610000,
          status: 'pending',
          payment_method: 'cod',
          created_at: now
        }
      ];

      for (const ordData of sampleOrders) {
        const order = await Order.create(ordData);
        const prod = await Product.findOne();
        if (prod) {
          await OrderItem.create({
            order_id: order.id,
            product_id: prod.id,
            product_name: prod.name,
            price: prod.price,
            quantity: 1,
            total_price: prod.price
          });
        }
      }
      console.log('✅ Đã khởi tạo danh sách đơn hàng mẫu cho CSDL!');
    }
  } catch (err) {
    console.error('⚠️ Lỗi tự động nạp dữ liệu mẫu:', err.message);
  }
}

module.exports = seedDatabase;
