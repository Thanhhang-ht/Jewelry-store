// ==========================================
// MOCK DATABASE USING LOCALSTORAGE
// Jewelry Store DB Helper
// ==========================================

const DEFAULT_PRODUCTS = [
  { id: 1, code: "SP001", name: "Nhẫn bạc đính đá CZ baguette", category: "Nhẫn", category_id: 1, price: 610000, stock: 50, status: "selling", createdAt: "2026-06-20", image: "../image/image 4.png", material: "Bạc 925 đính đá CZ", description: "Nhẫn bạc đính đá CZ baguette lấp lánh mang phong cách sang trọng hiện đại." },
  { id: 2, code: "SP002", name: "Dây chuyền bạc 102 Elegance", category: "Dây chuyền", category_id: 2, price: 495000, stock: 35, status: "selling", createdAt: "2026-06-20", image: "../image/image 2.png", material: "Bạc 925", description: "Dây chuyền bạc tinh tế, mặt tròn đính đá CZ trắng thanh lịch." },
  { id: 3, code: "SP003", name: "Vòng tay bạc PT Charming", category: "Vòng tay", category_id: 3, price: 510000, stock: 40, status: "selling", createdAt: "2026-06-19", image: "../image/image_3.png", material: "Bạc 925", description: "Vòng tay bạc cao cấp dạng kiềng mềm dẻo tạo điểm nhấn nhẹ nhàng." },
  { id: 4, code: "SP004", name: "Bông tai bạc Ngôi Sao Starry Night", category: "Bông tai", category_id: 4, price: 480000, stock: 25, status: "selling", createdAt: "2026-06-18", image: "../image/image 5.png", material: "Bạc 925", description: "Bông tai nhỏ xinh hình ngôi sao lấp lánh làm nổi bật nét dịu dàng." },
  { id: 5, code: "SP005", name: "Nhẫn bạc đính đá Royal Crown", category: "Nhẫn", category_id: 1, price: 460000, stock: 30, status: "selling", createdAt: "2026-06-17", image: "../image/image 6.png", material: "Bạc 925 phủ Bạch Kim", description: "Nhẫn dáng vương miện đính đá quý tinh tế, quý phái." },
  { id: 6, code: "SP006", name: "Nhẫn bạc trơn Ý Minimalist", category: "Nhẫn", category_id: 1, price: 540000, stock: 20, status: "selling", createdAt: "2026-06-16", image: "../image/image_7.png", material: "Bạc 999 Ý", description: "Nhẫn bạc trơn bóng sáng tối giản phong cách chuẩn Ý." },
  { id: 7, code: "SP007", name: "Dây chuyền bạc nữ Hoa Tuyết Snowflake", category: "Dây chuyền", category_id: 2, price: 670000, stock: 45, status: "selling", createdAt: "2026-06-15", image: "../image/image 9.png", material: "Bạc S925", description: "Hình tượng hoa tuyết mùa đông thuần khiết tỏa sáng rạng rỡ." },
  { id: 8, code: "SP008", name: "Vòng tay Kim Cương CZ Luxe Bracelet", category: "Vòng tay", category_id: 3, price: 870000, stock: 15, status: "selling", createdAt: "2026-06-14", image: "../image/image 10.png", material: "Bạc đính CZ cao cấp", description: "Dải đá CZ full vòng lấp lánh tuyệt mỹ, đẳng cấp chuẩn dự tiệc." },
  { id: 9, code: "SP009", name: "Nhẫn Moissanite Solitaire 1 Carat", category: "Nhẫn", category_id: 1, price: 1250000, stock: 15, status: "selling", createdAt: "2026-06-13", image: "../image/image 11.png", material: "Bạc 925 mạ Vàng Trắng", description: "Mặt đá Moissanite 1 Carat lấp lánh như kim cương tự nhiên." },
  { id: 10, code: "SP010", name: "Nhẫn bạc đôi Eternity Promise", category: "Nhẫn", category_id: 1, price: 780000, stock: 25, status: "selling", createdAt: "2026-06-12", image: "../image/image 13.png", material: "Bạc S925", description: "Dải đá CZ nối tiếp tượng trưng cho tình yêu vĩnh cửu." },
  { id: 11, code: "SP011", name: "Nhẫn nữ Cánh Thiên Thần Sparkle", category: "Nhẫn", category_id: 1, price: 590000, stock: 40, status: "selling", createdAt: "2026-06-11", image: "../image/image 14.png", material: "Bạc Ý 925 đính đá", description: "Đôi cánh thiên thần ôm trọn viên đá chủ màu xanh biển huyền ảo." },
  { id: 12, code: "SP012", name: "Dây chuyền Trái Tim Đôi Rose Gold", category: "Dây chuyền", category_id: 2, price: 850000, stock: 18, status: "selling", createdAt: "2026-06-10", image: "../image/image 15.png", material: "Bạc 925 mạ Vàng Hồng", description: "Trái tim kép mạ vàng hồng quyến rũ cho phái đẹp." },
  { id: 13, code: "SP013", name: "Dây chuyền bạc Ngọc Trai Natural Pearl", category: "Dây chuyền", category_id: 2, price: 990000, stock: 12, status: "selling", createdAt: "2026-06-09", image: "../image/image 16.png", material: "Bạc 925 & Ngọc trai", description: "Ngọc trai thiên nhiên tròn trịa kết hợp dây chuyền bạc nữ tính." },
  { id: 14, code: "SP014", name: "Dây chuyền Cỏ 4 Lá Lucky Shamrock", category: "Dây chuyền", category_id: 2, price: 520000, stock: 30, status: "selling", createdAt: "2026-06-08", image: "../image/image 17.png", material: "Bạc 925 đính đá Emerald", description: "Biểu tượng may mắn 4 lá mang lại vận may." },
  { id: 15, code: "SP015", name: "Dây chuyền bạc Đá Mặt Trăng Moonstone", category: "Dây chuyền", category_id: 2, price: 730000, stock: 22, status: "selling", createdAt: "2026-06-07", image: "../image/image 18.png", material: "Bạc Ý 925 & Đá Moonstone", description: "Đá mặt trăng phát quang ánh xanh huyền bí." },
  { id: 16, code: "SP016", name: "Lắc tay bạc Charm Trái Tim Sweet Love", category: "Vòng tay", category_id: 3, price: 640000, stock: 28, status: "selling", createdAt: "2026-06-06", image: "../image/image 19.png", material: "Bạc S925", description: "Lắc tay bạc xích mảnh phối các hạt charm trái tim rơi." },
  { id: 17, code: "SP017", name: "Vòng tay bạc mạ Vàng 18K Luxury", category: "Vòng tay", category_id: 3, price: 1150000, stock: 10, status: "selling", createdAt: "2026-06-05", image: "../image/image 20.png", material: "Bạc 925 mạ Vàng 18K", description: "Lớp mạ vàng 18K sang trọng kết hợp khóa cài chắc chắn." },
  { id: 18, code: "SP018", name: "Lắc tay bạc Cánh Bướm Butterfly Dream", category: "Vòng tay", category_id: 3, price: 580000, stock: 32, status: "selling", createdAt: "2026-06-04", image: "../image/image 21.png", material: "Bạc 925 đính đá", description: "Đôi cánh bướm dập dìu đính đá lấp lánh." },
  { id: 19, code: "SP019", name: "Kiềng tay bạc trơn nguyên chất 999", category: "Vòng tay", category_id: 3, price: 490000, stock: 50, status: "selling", createdAt: "2026-06-03", image: "../image/image 22.png", material: "Bạc Ý 999", description: "Kiềng tay bạc trơn bóng sáng nguyên chất chế tác thủ công." },
  { id: 20, code: "SP020", name: "Bông tai dáng dài Giọt Nước Crystal Drop", category: "Bông tai", category_id: 4, price: 620000, stock: 20, status: "selling", createdAt: "2026-06-02", image: "../image/image 23.png", material: "Bạc 925 & Pha lê", description: "Dáng bông thả dài thanh thoát tạo cảm giác thon gọn khuôn mặt." },
  { id: 21, code: "SP021", name: "Bông tai nụ Nơ Xinh Cute Ribbon", category: "Bông tai", category_id: 4, price: 390000, stock: 45, status: "selling", createdAt: "2026-06-01", image: "../image/image 24.png", material: "Bạc S925", description: "Bông tai nụ hình chiếc nơ nhỏ nhắn đính đá tỉ mỉ." },
  { id: 22, code: "SP022", name: "Bông tai vành kẹp Ear Cuff Modern", category: "Bông tai", category_id: 4, price: 450000, stock: 30, status: "selling", createdAt: "2026-05-30", image: "../image/image 25.png", material: "Bạc Ý 925", description: "Vành kẹp cá tính không cần xỏ lỗ tai thứ hai." },
  { id: 23, code: "SP023", name: "Bông tai tròn Hoop Earrings Classic", category: "Bông tai", category_id: 4, price: 510000, stock: 35, status: "selling", createdAt: "2026-05-29", image: "../image/image 26.png", material: "Bạc 925 mạ Bạch Kim", description: "Khuyên tròn cổ điển bản nhỏ chuẩn thời trang." },
  { id: 24, code: "SP024", name: "Bông tai bạc Ngọc Trai Vintage Queen", category: "Bông tai", category_id: 4, price: 790000, stock: 15, status: "selling", createdAt: "2026-05-28", image: "../image/image 27.png", material: "Bạc 925 & Ngọc Trai", description: "Phong cách quý phái cho các đêm tiệc sang trọng." }
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
