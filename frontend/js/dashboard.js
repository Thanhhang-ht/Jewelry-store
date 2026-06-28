// =====================================
// API
// =====================================

const API_BASE = "/api";

// =====================================
// DOM
// =====================================

const totalProducts = document.getElementById("totalProducts");
const totalOrders = document.getElementById("totalOrders");
const totalCustomers = document.getElementById("totalCustomers");
const totalRevenue = document.getElementById("totalRevenue");

const latestOrders = document.getElementById("latestOrders");
const bestSeller = document.getElementById("bestSeller");

const adminName = document.getElementById("adminName");
const currentDate = document.getElementById("currentDate");

const logoutBtn = document.getElementById("logoutBtn");
const menuBtn = document.querySelector(".menu-btn");
const sidebar = document.querySelector(".sidebar");

// =====================================
// HELPER
// =====================================

function formatMoney(value) {
  return Number(value).toLocaleString("vi-VN") + "đ";
}

function getStatusText(status) {
  const statusMap = {
    processing: "Đang xử lý",
    shipping: "Đang vận chuyển",
    success: "Đã giao hàng",
    cancel: "Đã hủy",
  };

  return statusMap[status] || status;
}

function showCurrentDate() {
  const today = new  currentDate.textContent = today.toLocaleDateString("vi-VN");
}

// =====================================
// LOAD ADMIN
// =====================================

async function loadAdminInfo() {
  try {
    // ==========================
    // BACKEND
    // ==========================

    /*
    const response = await fetch(`${API_BASE}/admin/profile`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Không thể tải thông tin Admin");
    }

    const data = await response.json();
    */

    // ==========================
    // DEMO DATA
    // ==========================

    const data = {
      fullName: "Admin",
    };

    adminName.textContent = data.fullName;
  } catch (error) {
    console.error(error);
  }
}

// =====================================
// LOAD THỐNG KÊ
// =====================================

async function loadDashboardStatistics() {
  try {
    // ==========================
    // BACKEND
    // ==========================

    /*
    const response = await fetch(`${API_BASE}/dashboard/statistics`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Không thể tải thống kê");
    }

    const data = await response.json();
    */

    // ==========================
    // DEMO DATA
    // ==========================

    const data = {
      totalProducts: 120,
      totalOrders: 85,
      totalCustomers: 60,
      totalRevenue: 15000000,
    };

    totalProducts.textContent = data.totalProducts;
    totalOrders.textContent = data.totalOrders;
    totalCustomers.textContent = data.totalCustomers;
    totalRevenue.textContent = formatMoney(data.totalRevenue);

  } catch (error) {
    console.error(error);
  }
}

// =====================================
// RENDER ORDERS
// =====================================

function renderOrders(orders) {

  latestOrders.innerHTML = "";

  orders.forEach((order) => {

    latestOrders.innerHTML += `
      <tr>

        <td>#${order.orderCode}</td>

        <td>${order.orderDate}</td>

        <td>${formatMoney(order.totalPrice)}</td>

        <td>
          <span class="status ${order.status}">
            ${getStatusText(order.status)}
          </span>
        </td>

      </tr>
    `;

  });

}
// =====================================
// LOAD ĐƠN HÀNG MỚI NHẤT
// =====================================

async function loadLatestOrders() {
    try {
  
      // ==========================
      // BACKEND
      // ==========================
  
      /*
      const response = await fetch(`${API_BASE}/orders/latest`, {
        credentials: "include",
      });
  
      if (!response.ok) {
        throw new Error("Không thể tải đơn hàng");
      }
  
      const orders = await response.json();
      */
  
      // ==========================
      // DEMO DATA
      // ==========================
  
      const orders = [
        {
          orderCode: "DH006",
          orderDate: "31/11/2026 19:30",
          totalPrice: 870000,
          status: "processing",
        },
        {
          orderCode: "DH005",
          orderDate: "22/11/2026 10:20",
          totalPrice: 870000,
          status: "shipping",
        },
        {
          orderCode: "DH004",
          orderDate: "20/10/2026 19:30",
          totalPrice: 670000,
          status: "success",
        },
      ];
  
      renderOrders(orders);
  
    } catch (error) {
      console.error(error);
    }
  }
  
  // =====================================
  // RENDER BEST SELLER
  // =====================================
  
  function renderBestSeller(products) {
  
    bestSeller.innerHTML = "";
  
    products.forEach((product) => {
  
      bestSeller.innerHTML += `
        <tr>
  
          <td>
  
            <img src="${product.image}" alt="${product.productName}">
  
            ${product.productName}
  
          </td>
  
          <td>${product.sold}</td>
  
        </tr>
      `;
  
    });
  
  }
  
  // =====================================
  // LOAD BEST SELLER
  // =====================================
  
  async function loadBestSeller() {
  
    try {
  
      // ==========================
      // BACKEND
      // ==========================
  
      /*
      const response = await fetch(`${API_BASE}/products/best-seller`, {
        credentials: "include",
      });
  
      if (!response.ok) {
        throw new Error("Không thể tải sản phẩm bán chạy");
      }
  
      const products = await response.json();
      */
  
      // ==========================
      // DEMO DATA
      // ==========================
  
      const products = [
        {
          productName: "Nhẫn bạc đính đá",
          image: "../image/image 24.png",
          sold: 45,
        },
        {
          productName: "Vòng tay bạc PT",
          image: "../image/image 25.png",
          sold: 30,
        },
        {
          productName: "Bông tai bạc ngôi sao",
          image: "../image/image 5.png",
          sold: 25,
        },
      ];
  
      renderBestSeller(products);
  
    } catch (error) {
      console.error(error);
    }
  
  }
  // =====================================
// MENU SIDEBAR
// =====================================

if (menuBtn) {
    menuBtn.addEventListener("click", () => {
      sidebar.classList.toggle("collapse");
    });
  }
  
  // =====================================
  // ĐĂNG XUẤT
  // =====================================
  
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async (e) => {
      e.preventDefault();
  
      const confirmLogout = confirm("Bạn có muốn đăng xuất không?");
  
      if (!confirmLogout) return;
  
      try {
  
        // ==========================
        // BACKEND
        // ==========================
  
        /*
        const response = await fetch(`${API_BASE}/auth/logout`, {
          method: "POST",
          credentials: "include",
        });
  
        if (!response.ok) {
          throw new Error("Đăng xuất thất bại");
        }
        */
  
        // Xóa token lưu trên trình duyệt
        localStorage.removeItem("accessToken");
        localStorage.removeItem("admin");
        sessionStorage.clear();
  
        // Chuyển về trang đăng nhập
        window.location.href = "login.html";
  
      } catch (error) {
        console.error(error);
        alert("Không thể đăng xuất.");
      }
    });
  }
  
  // =====================================
  // INIT
  // =====================================
  
  async function init() {
  
    showCurrentDate();
  
    await loadAdminInfo();
  
    await loadDashboardStatistics();
  
    await loadLatestOrders();
  
    await loadBestSeller();
  
  }
  
  // =====================================
  // START
  // =====================================
  
  document.addEventListener("DOMContentLoaded", () => {
    init();
  });