// ===========================================
// CUSTOMER MANAGEMENT
// Jewelry Store Admin
// ===========================================

// ===============================
// DỮ LIỆU TẠM THỜI
// Sau này thay bằng API
// ===============================

let customers = [
  {
    id: 1,
    name: "Phan Thanh Hằng",
    phone: "0365954848",
    email: "thanhhang23905@gmail.com",
    registerDate: "20/06/2026",
    totalOrders: 9,
    totalSpent: 5900000,
  },
  {
    id: 2,
    name: "Thái Lê Minh Hiếu",
    phone: "0324789989",
    email: "hieule114@gmail.com",
    registerDate: "19/06/2026",
    totalOrders: 8,
    totalSpent: 5300000,
  },
  {
    id: 3,
    name: "Lê Nguyễn Bảo Ngọc",
    phone: "0924685989",
    email: "lengocnguyen@gmail.com",
    registerDate: "19/06/2026",
    totalOrders: 8,
    totalSpent: 5000000,
  },
  {
    id: 4,
    name: "Trần Huy Hoàng",
    phone: "0726685284",
    email: "hoangtran@gmail.com",
    registerDate: "19/06/2026",
    totalOrders: 10,
    totalSpent: 6700000,
  },
  {
    id: 5,
    name: "Trần Anh Tuấn",
    phone: "0728885294",
    email: "anhtuan@gmail.com",
    registerDate: "18/06/2026",
    totalOrders: 6,
    totalSpent: 3800000,
  },
  {
    id: 6,
    name: "Phan Đình Bảo",
    phone: "0725815494",
    email: "phanbao@gmail.com",
    registerDate: "16/06/2026",
    totalOrders: 9,
    totalSpent: 5600000,
  },
  {
    id: 7,
    name: "Phan Thái Sang",
    phone: "0325815594",
    email: "thsang15@gmail.com",
    registerDate: "16/06/2026",
    totalOrders: 5,
    totalSpent: 3600000,
  },
  {
    id: 8,
    name: "Trần Bích Ngọc",
    phone: "0915616584",
    email: "bichngoctran@gmail.com",
    registerDate: "15/02/2026",
    totalOrders: 2,
    totalSpent: 1000000,
  },
];

// ===============================
// PHÂN TRANG
// ===============================

const customersPerPage = 8;
let currentPage = 1;
let filteredCustomers = [...customers];

// ===============================
// FORMAT TIỀN
// ===============================

function formatMoney(number) {
  return number.toLocaleString("vi-VN") + "đ";
}

// ===============================
// HIỂN THỊ KHÁCH HÀNG
// ===============================

function renderCustomers() {
  const tbody = document.getElementById("customerTableBody");

  if (!tbody) return;

  tbody.innerHTML = "";

  const start = (currentPage - 1) * customersPerPage;
  const end = start + customersPerPage;

  const pageData = filteredCustomers.slice(start, end);

  pageData.forEach((customer, index) => {
    tbody.innerHTML += `
        <tr>

            <td>${start + index + 1}</td>

            <td>${customer.name}</td>

            <td>${customer.phone}</td>

            <td>

                <a href="mailto:${customer.email}">
                    ${customer.email}
                </a>

            </td>

            <td>${customer.registerDate}</td>

            <td>${customer.totalOrders}</td>

            <td>${formatMoney(customer.totalSpent)}</td>

            <td>

                <button
                    class="delete-btn"
                    onclick="deleteCustomer(${customer.id})">

                    <i class="fa-regular fa-trash-can"></i>

                </button>

            </td>

        </tr>
        `;
  });

  renderPagination();
  updateStatistics();
}

// ===============================
// PHÂN TRANG
// ===============================

function renderPagination() {
  const pagination = document.querySelector(".pagination");

  if (!pagination) return;

  const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);

  pagination.innerHTML = "";

  pagination.innerHTML += `
        <button
            class="page-btn"
            onclick="changePage(${currentPage - 1})">

            &lt;

        </button>
    `;

  for (let i = 1; i <= totalPages; i++) {
    pagination.innerHTML += `
            <button
                class="page-btn ${i === currentPage ? "active" : ""}"
                onclick="changePage(${i})">

                ${i}

            </button>
        `;
  }

  pagination.innerHTML += `
        <button
            class="page-btn"
            onclick="changePage(${currentPage + 1})">

            &gt;

        </button>
    `;
}

// ===============================
// ĐỔI TRANG
// ===============================

function changePage(page) {
  const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);

  if (page < 1 || page > totalPages) return;

  currentPage = page;

  renderCustomers();
}

// ===============================
// TÌM KIẾM
// ===============================

const searchInput = document.getElementById("searchCustomer");

if (searchInput) {
  searchInput.addEventListener("keyup", function () {
    const keyword = this.value.toLowerCase();

    filteredCustomers = customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(keyword) ||
        customer.phone.includes(keyword) ||
        customer.email.toLowerCase().includes(keyword)
    );

    currentPage = 1;

    renderCustomers();
  });
}

// ===============================
// XÓA KHÁCH HÀNG
// ===============================

function deleteCustomer(id) {
  const confirmDelete = confirm("Bạn có chắc muốn xóa khách hàng này?");

  if (!confirmDelete) return;

  customers = customers.filter((customer) => customer.id !== id);

  filteredCustomers = [...customers];

  const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);

  if (currentPage > totalPages) {
    currentPage = totalPages || 1;
  }

  renderCustomers();
}

// ===============================
// CẬP NHẬT THỐNG KÊ
// ===============================

function updateStatistics() {
  const totalCustomers = customers.length;

  const totalOrders = customers.reduce((sum, c) => sum + c.totalOrders, 0);

  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);

  document.getElementById("totalCustomers").textContent = totalCustomers;

  document.getElementById("newCustomers").textContent = 5;

  document.getElementById("totalOrders").textContent = totalOrders;

  document.getElementById("totalRevenue").textContent =
    formatMoney(totalRevenue);
}

// ===============================
// ĐĂNG XUẤT
// ===============================

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", function () {
    const ok = confirm("Bạn có muốn đăng xuất không?");

    if (!ok) return;

    localStorage.removeItem("user");

    window.location.href = "login.html";
  });
}

// ===============================
// LOAD
// ===============================

document.addEventListener("DOMContentLoaded", function () {
  renderCustomers();
});
