// ======================================================
// KHAI BÁO
// ======================================================

const API = {
  orders: "/api/orders",
};

// =========================
// DỮ LIỆU MẪU
// =========================

let orders = [
  {
    id: 1,
    code: "DH001",
    date: "15/06/2026",
    total: "670.000đ",
    status: "processing",
  },

  {
    id: 2,
    code: "DH002",
    date: "14/06/2026",
    total: "1.250.000đ",
    status: "shipping",
  },

  {
    id: 3,
    code: "DH003",
    date: "10/06/2026",
    total: "950.000đ",
    status: "success",
  },

  {
    id: 4,
    code: "DH004",
    date: "08/06/2026",
    total: "1.500.000đ",
    status: "cancel",
  },

  {
    id: 5,
    code: "DH005",
    date: "05/06/2026",
    total: "480.000đ",
    status: "success",
  },

  {
    id: 6,
    code: "DH006",
    date: "01/06/2026",
    total: "570.000đ",
    status: "processing",
  },
];

// ======================================================
// CẤU HÌNH PHÂN TRANG
// ======================================================

const rowsPerPage = 5;

let currentPage = 1;

// ======================================================
// LẤY TÊN TRẠNG THÁI
// ======================================================

function getStatusText(status) {
  switch (status) {
    case "processing":
      return "Đang xử lý";

    case "shipping":
      return "Đang giao";

    case "success":
      return "Hoàn thành";

    case "cancel":
      return "Đã hủy";

    default:
      return "";
  }
}

// ======================================================
// HIỂN THỊ ĐƠN HÀNG
// ======================================================

function renderOrders(orderList = orders) {
  const tbody = document.getElementById("orderTable");

  if (!tbody) return;

  tbody.innerHTML = "";

  const start = (currentPage - 1) * rowsPerPage;

  const end = start + rowsPerPage;

  const pageOrders = orderList.slice(start, end);

  pageOrders.forEach((order) => {
    tbody.innerHTML += `

      <tr data-id="${order.id}">

          <td>${order.code}</td>

          <td>${order.date}</td>

          <td>${order.total}</td>

          <td>

              <span class="status ${order.status}">

                  ${getStatusText(order.status)}

              </span>

          </td>

          <td>

              <a
                  href="#"
                  class="detail-btn"
                  data-id="${order.id}">

                  Xem chi tiết

              </a>

          </td>

      </tr>

      `;
  });

  renderPagination(orderList);
}

// ======================================================
// PHÂN TRANG
// ======================================================

function renderPagination(orderList = orders) {
  const pagination = document.getElementById("pagination");

  if (!pagination) return;

  pagination.innerHTML = "";

  const totalPages = Math.ceil(orderList.length / rowsPerPage);

  // ===== NÚT LÙI =====

  const prevBtn = document.createElement("button");

  prevBtn.innerHTML = "&lt;";

  prevBtn.disabled = currentPage === 1;

  prevBtn.addEventListener("click", () => {
    changePage(currentPage - 1);
  });

  pagination.appendChild(prevBtn);

  // ===== DANH SÁCH TRANG =====

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");

    btn.textContent = i;

    if (i === currentPage) {
      btn.classList.add("active");
    }

    btn.addEventListener("click", () => {
      changePage(i);
    });

    pagination.appendChild(btn);
  }

  // ===== NÚT TIẾN =====

  const nextBtn = document.createElement("button");

  nextBtn.innerHTML = "&gt;";

  nextBtn.disabled = currentPage === totalPages;

  nextBtn.addEventListener("click", () => {
    changePage(currentPage + 1);
  });

  pagination.appendChild(nextBtn);
}
// ======================================================
// ĐỔI TRANG
// ======================================================

function changePage(page) {
  const totalPages = Math.ceil(orders.length / rowsPerPage);

  if (page < 1 || page > totalPages) {
    return;
  }

  currentPage = page;

  renderOrders();
}

// ======================================================
// ĐĂNG XUẤT
// ======================================================

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const confirmLogout = confirm("Bạn có muốn đăng xuất không?");

    if (confirmLogout) {
      // Backend:
      // await fetch("/logout",{method:"POST"});

      localStorage.removeItem("user");

      window.location.href = "login.html";
    }
  });
}

// ======================================================
// EVENT DELEGATION
// ======================================================

document.addEventListener("click", (e) => {
  // =====================
  // XEM CHI TIẾT ĐƠN HÀNG
  // =====================

  if (e.target.classList.contains("detail-btn")) {
    e.preventDefault();

    const orderId = e.target.dataset.id;

    // Backend sau này:
    // window.location.href =
    // `order-detail.html?id=${orderId}`;

    window.location.href = `order-detail.html?id=${orderId}`;
  }
});

// ======================================================
// LOAD ĐƠN HÀNG
// ======================================================

function loadOrders() {
  /*
  Backend:

  fetch(API.orders)
      .then(res => res.json())
      .then(data => {

          orders = data;

          renderOrders();

      });

  */

  renderOrders();
}

// ======================================================
// LOAD THÔNG TIN USER
// ======================================================

function loadUser() {
  /*
  Backend:

  fetch("/api/profile")
      .then(res => res.json())
      .then(user => {

          document.getElementById("sidebarUserName").textContent =
              user.name;

          document.getElementById("sidebarUserEmail").textContent =
              user.email;

      });

  */
}

// ======================================================
// KHỞI TẠO TRANG
// ======================================================

document.addEventListener("DOMContentLoaded", () => {
  loadUser();

  loadOrders();
});
