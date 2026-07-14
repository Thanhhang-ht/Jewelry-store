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

    const response = await fetch(`${API_BASE}/auth/profile`, {
      headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
    });

    if (!response.ok) {
      throw new Error("Không thể tải thông tin Admin");
    }

    const result = await response.json();
    const data = result.data;

    adminName.textContent = data.fullname || "Admin";
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

    const response = await fetch(`${API_BASE}/dashboard/statistics`, {
      headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
    });

    if (!response.ok) {
      throw new Error("Không thể tải thống kê");
    }

    const result = await response.json();
    const data = result.data;

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
  
    const response = await fetch(`${API_BASE}/dashboard/latest-orders`, {
      headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
    });

    if (!response.ok) {
      throw new Error("Không thể tải đơn hàng");
    }

    const result = await response.json();
    renderOrders(result.data);
  
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
  
    const response = await fetch(`${API_BASE}/dashboard/best-sellers`, {
      headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
    });

    if (!response.ok) {
      throw new Error("Không thể tải sản phẩm bán chạy");
    }

    const result = await response.json();
    renderBestSeller(result.data);
  
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
        localStorage.removeItem("token");
        localStorage.removeItem("user");
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