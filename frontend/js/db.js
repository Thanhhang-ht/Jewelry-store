// ==========================================
// MOCK DATABASE USING LOCALSTORAGE
// Jewelry Store DB Helper
// ==========================================

const DEFAULT_PRODUCTS = [
  {
    id: 1,
    code: "SP001",
    name: "Nhẫn bạc đính đá CZ",
    category: "Nhẫn",
    price: 610000,
    stock: 50,
    status: "selling",
    createdAt: "2026-06-20",
    image: "../image/image 4.png",
    material: "Bạc 925",
    description: "Nhẫn bạc đính đá CZ lấp lánh mang phong cách hiện đại, tinh xảo trong từng đường nét chế tác."
  },
  {
    id: 2,
    code: "SP002",
    name: "Dây chuyền bạc 102",
    category: "Dây chuyền",
    price: 495000,
    stock: 35,
    status: "selling",
    createdAt: "2026-06-20",
    image: "../image/image 2.png",
    material: "Bạc 925",
    description: "Dây chuyền bạc tinh tế, tối giản nhưng thanh lịch, phù hợp làm phụ kiện hàng ngày."
  },
  {
    id: 3,
    code: "SP003",
    name: "Vòng tay bạc PT",
    category: "Vòng tay",
    price: 510000,
    stock: 40,
    status: "selling",
    createdAt: "2026-06-19",
    image: "../image/image_3.png",
    material: "Bạc 925",
    description: "Vòng tay bạc cao cấp tạo điểm nhấn nhẹ nhàng cho cổ tay phái nữ."
  },
  {
    id: 4,
    code: "SP004",
    name: "Bông tai bạc ngôi sao",
    category: "Bông tai",
    price: 480000,
    stock: 25,
    status: "selling",
    createdAt: "2026-06-18",
    image: "../image/image 5.png",
    material: "Bạc 925",
    description: "Bông tai nhỏ xinh hình ngôi sao lấp lánh, làm nổi bật nét dịu dàng và thanh thoát."
  },
  {
    id: 5,
    code: "SP005",
    name: "Nhẫn bạc đính đá cao cấp",
    category: "Nhẫn",
    price: 460000,
    stock: 30,
    status: "selling",
    createdAt: "2026-06-17",
    image: "../image/image 6.png",
    material: "Bạc 925",
    description: "Nhẫn bạc đính đá tinh tế thiết kế sang trọng phù hợp đi tiệc."
  },
  {
    id: 6,
    code: "SP006",
    name: "Nhẫn bạc trơn cao cấp",
    category: "Nhẫn",
    price: 540000,
    stock: 12,
    status: "selling",
    createdAt: "2026-06-16",
    image: "../image/image_7.png",
    material: "Bạc 999",
    description: "Nhẫn bạc trơn bóng sáng cao cấp chế tác thủ công tỉ mỉ."
  },
  {
    id: 7,
    code: "SP007",
    name: "Dây chuyền bạc nữ cao cấp",
    category: "Dây chuyền",
    price: 670000,
    stock: 45,
    status: "selling",
    createdAt: "2026-06-15",
    image: "../image/image 9.png",
    material: "Bạc S925",
    description: "Dây chuyền thiết kế hoa tuyết cách điệu mang phong cách nữ tính thanh thuần."
  },
  {
    id: 8,
    code: "SP008",
    name: "Vòng tay kim cương",
    category: "Vòng tay",
    price: 870000,
    stock: 10,
    status: "selling",
    createdAt: "2026-06-14",
    image: "../image/image 10.png",
    material: "Bạc đính CZ cao cấp",
    description: "Vòng tay đính đá cz giả kim cương lấp lánh cuốn hút."
  }
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
