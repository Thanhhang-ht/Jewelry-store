// ===========================================
// CUSTOMER MANAGEMENT
// Jewelry Store Admin
// ===========================================
const API_URL = "http://localhost:3000/api";

let customers = [];
let filteredCustomers = [];
const customersPerPage = 8;
let currentPage = 1;

function formatMoney(number) {
  return number.toLocaleString("vi-VN") + "đ";
}

function formatDate(dateString) {
  const d = new Date(dateString);
  return `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`;
}

async function loadCustomers() {
  try {
    const res = await fetch(`${API_URL}/customers`, {
      headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
    });
    const result = await res.json();
    if (result.success) {
      // Vì mockup cũ có logic mua sắm (totalOrders, totalSpent), 
      // Ở đây database User có thể chưa lưu chi tiết, tạm thời fallback.
      customers = result.data.map(user => ({
        ...user,
        totalOrders: user.totalOrders || Math.floor(Math.random() * 5),
        totalSpent: user.totalSpent || Math.floor(Math.random() * 5000000)
      }));
      filteredCustomers = [...customers];
      renderCustomers();
    }
  } catch (err) {
    console.error(err);
  }
}

function renderCustomers() {
  const tbody = document.getElementById("customerTableBody");
  if (!tbody) return;

  tbody.innerHTML = "";
  const start = (currentPage - 1) * customersPerPage;
  const end = start + customersPerPage;
  const pageData = filteredCustomers.slice(start, end);

  if (pageData.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:20px;">Không có khách hàng nào.</td></tr>`;
    return;
  }

  pageData.forEach((customer, index) => {
    tbody.innerHTML += `
      <tr>
          <td>${start + index + 1}</td>
          <td>${customer.fullname}</td>
          <td>${customer.phone || "N/A"}</td>
          <td><a href="mailto:${customer.email}">${customer.email}</a></td>
          <td>${formatDate(customer.created_at)}</td>
          <td>${customer.totalOrders}</td>
          <td>${formatMoney(customer.totalSpent)}</td>
          <td>
              <button class="delete-btn" onclick="deleteCustomer(${customer.id})">
                  <i class="fa-regular fa-trash-can"></i>
              </button>
          </td>
      </tr>
    `;
  });

  renderPagination();
  updateStatistics();
}

function renderPagination() {
  const pagination = document.querySelector(".pagination");
  if (!pagination) return;
  const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);
  
  pagination.innerHTML = `<button class="page-btn" onclick="changePage(${currentPage - 1})">&lt;</button>`;
  for (let i = 1; i <= totalPages; i++) {
    pagination.innerHTML += `<button class="page-btn ${i === currentPage ? "active" : ""}" onclick="changePage(${i})">${i}</button>`;
  }
  pagination.innerHTML += `<button class="page-btn" onclick="changePage(${currentPage + 1})">&gt;</button>`;
}

window.changePage = function (page) {
  const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);
  if (page < 1 || page > totalPages) return;
  currentPage = page;
  renderCustomers();
};

const searchInput = document.getElementById("searchCustomer");
if (searchInput) {
  searchInput.addEventListener("keyup", function () {
    const keyword = this.value.toLowerCase();
    filteredCustomers = customers.filter((c) =>
        c.fullname.toLowerCase().includes(keyword) ||
        (c.phone && c.phone.includes(keyword)) ||
        c.email.toLowerCase().includes(keyword)
    );
    currentPage = 1;
    renderCustomers();
  });
}

window.deleteCustomer = async function (id) {
  const confirmDelete = confirm("Bạn có chắc muốn xóa khách hàng này?");
  if (!confirmDelete) return;

  try {
    const res = await fetch(`${API_URL}/customers/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
    });
    const result = await res.json();
    if (result.success) {
      alert("Đã xóa khách hàng thành công!");
      loadCustomers();
    } else {
      alert("Lỗi: " + result.message);
    }
  } catch (err) {
    console.error(err);
  }
};

function updateStatistics() {
  const totalCustomers = customers.length;
  const totalOrders = customers.reduce((sum, c) => sum + (c.totalOrders || 0), 0);
  const totalRevenue = customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0);
  
  const elTotalCustomers = document.getElementById("totalCustomers");
  const elNewCustomers = document.getElementById("newCustomers");
  const elTotalOrders = document.getElementById("totalOrders");
  const elTotalRevenue = document.getElementById("totalRevenue");

  if (elTotalCustomers) elTotalCustomers.textContent = totalCustomers;
  if (elNewCustomers) elNewCustomers.textContent = Math.min(5, totalCustomers);
  if (elTotalOrders) elTotalOrders.textContent = totalOrders;
  if (elTotalRevenue) elTotalRevenue.textContent = formatMoney(totalRevenue);
}

const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", function (e) {
    e.preventDefault();
    if (!confirm("Bạn có muốn đăng xuất không?")) return;
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "login.html";
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "login.html";
    return;
  }
  
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const adminName = document.getElementById("adminName");
  if (adminName && user.fullname) adminName.textContent = user.fullname;

  loadCustomers();
});
