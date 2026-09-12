// ==========================================
// MOCK DATABASE USING LOCALSTORAGE
// Jewelry Store DB Helper
// ==========================================

const DEFAULT_PRODUCTS = [
  { id: 1, code: "SP001", name: "Nhẫn bạc đính đá CZ", category: "Nhẫn", category_id: 1, price: 610000, stock: 50, status: "selling", createdAt: "2026-06-20", image: "../image/image 4.png", material: "Bạc 925", description: "Nhẫn bạc đính đá CZ lấp lánh mang phong cách hiện đại, tinh xảo trong từng đường nét chế tác." },
  { id: 2, code: "SP002", name: "Dây chuyền bạc 102", category: "Dây chuyền", category_id: 2, price: 495000, stock: 35, status: "selling", createdAt: "2026-06-20", image: "../image/image 2.png", material: "Bạc 925", description: "Dây chuyền bạc tinh tế, tối giản nhưng thanh lịch, phù hợp làm phụ kiện hàng ngày." },
  { id: 3, code: "SP003", name: "Vòng tay bạc PT", category: "Vòng tay", category_id: 3, price: 510000, stock: 40, status: "selling", createdAt: "2026-06-19", image: "../image/image_3.png", material: "Bạc 925", description: "Vòng tay bạc cao cấp tạo điểm nhấn nhẹ nhàng cho cổ tay phái nữ." },
  { id: 4, code: "SP004", name: "Bông tai bạc ngôi sao", category: "Bông tai", category_id: 4, price: 480000, stock: 25, status: "selling", createdAt: "2026-06-18", image: "../image/image 5.png", material: "Bạc 925", description: "Bông tai nhỏ xinh hình ngôi sao lấp lánh, làm nổi bật nét dịu dàng và thanh thoát." },
  { id: 5, code: "SP005", name: "Nhẫn bạc đính đá cao cấp", category: "Nhẫn", category_id: 1, price: 460000, stock: 30, status: "selling", createdAt: "2026-06-17", image: "../image/image 6.png", material: "Bạc 925", description: "Nhẫn bạc đính đá tinh tế thiết kế sang trọng phù hợp đi tiệc." },
  { id: 6, code: "SP006", name: "Nhẫn bạc trơn cao cấp", category: "Nhẫn", category_id: 1, price: 540000, stock: 20, status: "selling", createdAt: "2026-06-16", image: "../image/image_7.png", material: "Bạc 999", description: "Nhẫn bạc trơn bóng sáng cao cấp chế tác thủ công tỉ mỉ." },
  { id: 7, code: "SP007", name: "Dây chuyền bạc nữ cao cấp", category: "Dây chuyền", category_id: 2, price: 670000, stock: 45, status: "selling", createdAt: "2026-06-15", image: "../image/image 9.png", material: "Bạc S925", description: "Dây chuyền thiết kế hoa tuyết cách điệu mang phong cách nữ tính thanh thuần." },
  { id: 8, code: "SP008", name: "Vòng tay kim cương", category: "Vòng tay", category_id: 3, price: 870000, stock: 15, status: "selling", createdAt: "2026-06-14", image: "../image/image 10.png", material: "Bạc đính CZ cao cấp", description: "Vòng tay đính đá CZ giả kim cương lấp lánh cuốn hút." },
  { id: 9, code: "SP009", name: "Nhẫn bạc hoa cúc tinh xảo", category: "Nhẫn", category_id: 1, price: 580000, stock: 15, status: "selling", createdAt: "2026-06-13", image: "../image/image_6.png", material: "Bạc 925", description: "Nhẫn thiết kế hình hoa cúc nhỏ nhắn đính đá rạng rỡ." },
  { id: 10, code: "SP010", name: "Bông tai bạc tinh tế", category: "Bông tai", category_id: 4, price: 430000, stock: 20, status: "selling", createdAt: "2026-06-12", image: "../image/image_12.png", material: "Bạc 925", description: "Bông tai bạc dáng nụ đính đá nhỏ xinh xắn." },
  { id: 11, code: "SP011", name: "Bông tai cao cấp", category: "Bông tai", category_id: 4, price: 750000, stock: 18, status: "selling", createdAt: "2026-06-11", image: "../image/image 13.png", material: "Bạc 925", description: "Bông tai đính đá cao cấp phong cách quý phái dự tiệc." },
  { id: 12, code: "SP012", name: "Dây chuyền bạc hoa tuyết", category: "Dây chuyền", category_id: 2, price: 730000, stock: 28, status: "selling", createdAt: "2026-06-10", image: "../image/image 14.png", material: "Bạc S925", description: "Dây chuyền bạc cao cấp đính đá hình hoa tuyết kiêu sa." },
  { id: 13, code: "SP013", name: "Dây chuyền bạc mặt tròn tinh tế", category: "Dây chuyền", category_id: 2, price: 520000, stock: 30, status: "selling", createdAt: "2026-06-09", image: "../image/image_2.png", material: "Bạc 925", description: "Dây chuyền mặt tròn đính đá đơn giản thanh lịch." },
  { id: 14, code: "SP014", name: "Vòng tay bạc cao cấp", category: "Vòng tay", category_id: 3, price: 570000, stock: 25, status: "selling", createdAt: "2026-06-08", image: "../image/image 11.png", material: "Bạc S925", description: "Vòng tay bạc thiết kế mảnh mai tôn lên nét dịu dàng." },
  { id: 15, code: "SP015", name: "Dây chuyền bạc đính đá hồng", category: "Dây chuyền", category_id: 2, price: 850000, stock: 18, status: "selling", createdAt: "2026-06-07", image: "../image/image 15.png", material: "Bạc 925", description: "Dây chuyền đính đá hồng quyến rũ và nữ tính." },
  { id: 16, code: "SP016", name: "Dây chuyền bạc mặt ngọc trai", category: "Dây chuyền", category_id: 2, price: 990000, stock: 12, status: "selling", createdAt: "2026-06-06", image: "../image/image 16.png", material: "Bạc 925 & Ngọc trai", description: "Dây chuyền mặt ngọc trai tự nhiên kết hợp chất liệu bạc cao cấp." },
  { id: 17, code: "SP017", name: "Lắc tay bạc đính đá lấp lánh", category: "Vòng tay", category_id: 3, price: 640000, stock: 22, status: "selling", createdAt: "2026-06-05", image: "../image/image 18.png", material: "Bạc 925", description: "Lắc tay bạc đính đá CZ phong cách lộng lẫy." },
  { id: 18, code: "SP018", name: "Lắc tay bạc charm cao cấp", category: "Vòng tay", category_id: 3, price: 690000, stock: 20, status: "selling", createdAt: "2026-06-04", image: "../image/image 19.png", material: "Bạc S925", description: "Lắc tay phối các hạt charm nhỏ nhắn xinh xắn." },
  { id: 19, code: "SP019", name: "Vòng tay bạc mạ vàng 18K", category: "Vòng tay", category_id: 3, price: 820000, stock: 16, status: "selling", createdAt: "2026-06-03", image: "../image/image 20.png", material: "Bạc 925 mạ Vàng", description: "Vòng tay mạ vàng 18K sang trọng và quý phái." },
  { id: 20, code: "SP020", name: "Lắc tay bạc đôi quyến rũ", category: "Vòng tay", category_id: 3, price: 590000, stock: 30, status: "selling", createdAt: "2026-06-02", image: "../image/image 21.png", material: "Bạc 925", description: "Lắc tay dạng dây đôi mềm mại điểm xuyết đá tinh xảo." },
  { id: 21, code: "SP021", name: "Bông tai bạc nụ nhỏ xinh", category: "Bông tai", category_id: 4, price: 390000, stock: 45, status: "selling", createdAt: "2026-06-01", image: "../image/image 24.png", material: "Bạc S925", description: "Bông tai nụ đính đá lấp lánh phong cách dễ thương." },
  { id: 22, code: "SP022", name: "Bông tai bạc ngọc trai", category: "Bông tai", category_id: 4, price: 450000, stock: 30, status: "selling", createdAt: "2026-05-30", image: "../image/image 25.png", material: "Bạc 925 & Ngọc trai", description: "Bông tai nụ đính hạt ngọc trai nhân tạo cao cấp sang trọng." },
  { id: 23, code: "SP023", name: "Bông tai tròn bạc cao cấp", category: "Bông tai", category_id: 4, price: 510000, stock: 35, status: "selling", createdAt: "2026-05-29", image: "../image/image 26.png", material: "Bạc S925", description: "Bông tai kiểu khuyên tròn phong cách hiện đại cá tính." },
  { id: 24, code: "SP024", name: "Bông tai dáng dài kiều diễm", category: "Bông tai", category_id: 4, price: 620000, stock: 20, status: "selling", createdAt: "2026-05-28", image: "../image/image 23.png", material: "Bạc 925", description: "Bông tai thả dáng dài đính đá lấp lánh làm thon gọn khuôn mặt." }
];

const DEFAULT_CATEGORIES = [
  { id: 1, name: "Nhẫn", description: "Các mẫu nhẫn bạc, nhẫn đính đá lấp lánh dành cho cả nam và nữ.", status: "active", image: "../image/emojione-monotone_ring.png" },
  { id: 2, name: "Dây chuyền", description: "Mẫu dây chuyền mảnh mai, tinh xảo kết hợp nhiều kiểu mặt đá bắt mắt.", status: "active", image: "../image/Vector.png" },
  { id: 3, name: "Vòng tay", description: "Lắc tay, vòng tay bạc mềm mại giúp cổ tay thanh mảnh nổi bật.", status: "active", image: "../image/game-icons_gem-chain.png" },
  { id: 4, name: "Bông tai", description: "Bông tai nụ, bông tai dáng dài tinh xảo tôn lên nét thanh tú khuôn mặt.", status: "active", image: "../image/game-icons_drop-earrings.png" }
];

const DEFAULT_ORDERS = [
  {
    id: "DH025",
    customerName: "Phan Thanh Hằng",
    phone: "0365954848",
    date: "2026-06-28 19:30",
    total: 1200000,
    status: "processing",
    payment: "cod",
    items: [
      { productId: 7, quantity: 1, price: 670000 },
      { productId: 3, quantity: 1, price: 510000 }
    ]
  },
  {
    id: "DH024",
    customerName: "Thái Lê Minh Hiếu",
    phone: "0324789989",
    date: "2026-06-27 11:30",
    total: 950000,
    status: "shipping",
    payment: "cod",
    items: [
      { productId: 6, quantity: 1, price: 540000 },
      { productId: 5, quantity: 1, price: 460000 }
    ]
  },
  {
    id: "DH023",
    customerName: "Lê Nguyễn Bảo Ngọc",
    phone: "0924685989",
    date: "2026-06-27 11:19",
    total: 950000,
    status: "shipping",
    payment: "bank",
    items: [
      { productId: 6, quantity: 1, price: 540000 },
      { productId: 3, quantity: 1, price: 510000 }
    ]
  },
  {
    id: "DH022",
    customerName: "Trần Huy Hoàng",
    phone: "0726685284",
    date: "2026-06-26 09:35",
    total: 670000,
    status: "cancelled",
    payment: "bank",
    items: [
      { productId: 7, quantity: 1, price: 670000 }
    ]
  },
  {
    id: "DH021",
    customerName: "Trần Anh Tuấn",
    phone: "0728885294",
    date: "2026-06-26 08:35",
    total: 550000,
    status: "completed",
    payment: "cod",
    items: [
      { productId: 6, quantity: 1, price: 540000 }
    ]
  }
];

const DEFAULT_CUSTOMERS = [
  { id: 1, name: "Phan Thanh Hằng", phone: "0365954848", email: "thanhhang23905@gmail.com", registerDate: "20/06/2026", totalOrders: 9, totalSpent: 5900000 },
  { id: 2, name: "Thái Lê Minh Hiếu", phone: "0324789989", email: "hieule114@gmail.com", registerDate: "19/06/2026", totalOrders: 8, totalSpent: 5300000 },
  { id: 3, name: "Lê Nguyễn Bảo Ngọc", phone: "0924685989", email: "lengocnguyen@gmail.com", registerDate: "19/06/2026", totalOrders: 8, totalSpent: 5000000 },
  { id: 4, name: "Trần Huy Hoàng", phone: "0726685284", email: "hoangtran@gmail.com", registerDate: "19/06/2026", totalOrders: 10, totalSpent: 6700000 },
  { id: 5, name: "Trần Anh Tuấn", phone: "0728885294", email: "anhtuan@gmail.com", registerDate: "18/06/2026", totalOrders: 6, totalSpent: 3800000 }
];

const DEFAULT_COUPONS = [
  { id: 1, code: "GIAM10", discount_type: "percent", discount_value: 10, min_order_value: 400000, max_discount_value: 100000, start_date: "2026-01-01", end_date: "2026-12-31", usage_limit: 100, used_count: 5, status: "active" },
  { id: 2, code: "WELCOME50", discount_type: "fixed", discount_value: 50000, min_order_value: 300000, max_discount_value: 50000, start_date: "2026-01-01", end_date: "2026-12-31", usage_limit: 200, used_count: 10, status: "active" }
];

// Helper database functions
const DB = {
  getProducts() {
    if (!localStorage.getItem("products")) {
      localStorage.setItem("products", JSON.stringify(DEFAULT_PRODUCTS));
    }
    return JSON.parse(localStorage.getItem("products"));
  },
  saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  },
  getCategories() {
    if (!localStorage.getItem("categories")) {
      localStorage.setItem("categories", JSON.stringify(DEFAULT_CATEGORIES));
    }
    return JSON.parse(localStorage.getItem("categories"));
  },
  saveCategories(categories) {
    localStorage.setItem("categories", JSON.stringify(categories));
  },
  getOrders() {
    if (!localStorage.getItem("orders")) {
      localStorage.setItem("orders", JSON.stringify(DEFAULT_ORDERS));
    }
    return JSON.parse(localStorage.getItem("orders"));
  },
  saveOrders(orders) {
    localStorage.setItem("orders", JSON.stringify(orders));
  },
  getCart() {
    if (!localStorage.getItem("cart")) {
      localStorage.setItem("cart", JSON.stringify([]));
    }
    return JSON.parse(localStorage.getItem("cart"));
  },
  saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  },
  getCustomers() {
    if (!localStorage.getItem("customers")) {
      localStorage.setItem("customers", JSON.stringify(DEFAULT_CUSTOMERS));
    }
    return JSON.parse(localStorage.getItem("customers"));
  },
  saveCustomers(customers) {
    localStorage.setItem("customers", JSON.stringify(customers));
  },
  getCoupons() {
    if (!localStorage.getItem("coupons")) {
      localStorage.setItem("coupons", JSON.stringify(DEFAULT_COUPONS));
    }
    return JSON.parse(localStorage.getItem("coupons"));
  },
  saveCoupons(coupons) {
    localStorage.setItem("coupons", JSON.stringify(coupons));
  }
};

// Initialize DB immediately on load
DB.getProducts();
DB.getCategories();
DB.getOrders();
DB.getCart();
DB.getCustomers();
DB.getCoupons();
