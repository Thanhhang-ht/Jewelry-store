// =========================================
// DYNAMIC ORDER MANAGEMENT LOGIC
// =========================================

const OrderManager = {
  orders: [],
  filteredOrders: [],
  statusFilter: "all",
  searchKeyword: "",
  currentPage: 1,
  pageSize: 10
};

function formatMoney(value) {
  return Number(value).toLocaleString("vi-VN") + "đ";
}

function getStatusText(status) {
  switch (status) {
    case "processing": return "Chờ xử lý";
    case "shipping": return "Đang vận chuyển";
    case "completed": return "Hoàn thành";
    case "cancelled": return "Đã hủy";
    default: return status;
  }
}

function getPaymentText(payment) {
  return payment === "cod" ? "COD" : "Chuyển khoản";
}

// Load and aggregate counts
function loadOrders() {
  const orders = DB.getOrders();
  OrderManager.orders = orders;
  
  updateStatusCounts();
  applyFilters();
}

function updateStatusCounts() {
  const orders = OrderManager.orders;
  
  document.getElementById("countAll").innerText = orders.length;
  document.getElementById("countProcessing").innerText = orders.filter(o => o.status === "processing").length;
  document.getElementById("countShipping").innerText = orders.filter(o => o.status === "shipping").length;
  document.getElementById("countCompleted").innerText = orders.filter(o => o.status === "completed").length;
  document.getElementById("countCancelled").innerText = orders.filter(o => o.status === "cancelled").length;
}

function applyFilters() {
  const keyword = OrderManager.searchKeyword.toLowerCase();
  const filter = OrderManager.statusFilter;

  OrderManager.filteredOrders = OrderManager.orders.filter((order) => {
    const matchStatus = filter === "all" || order.status === filter;
    const matchKeyword = 
      order.id.toLowerCase().includes(keyword) || 
      order.customerName.toLowerCase().includes(keyword) ||
      (order.phone && order.phone.includes(keyword));
    return matchStatus && matchKeyword;
  });

  OrderManager.currentPage = 1;
  renderOrders();
}

// Render Table
function renderTable() {
  const tbody = document.getElementById("orderTableBody");
  if (!tbody) return;

  const start = (OrderManager.currentPage - 1) * OrderManager.pageSize;
  const end = start + OrderManager.pageSize;
  const pageOrders = OrderManager.filteredOrders.slice(start, end);

  if (pageOrders.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="empty-data" style="text-align: center; padding: 20px; color: #888;">
          Không có đơn hàng nào.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = pageOrders
    .map((order) => {
      const statusClass = order.status;
      const paymentClass = order.payment;

      return `
      <tr data-order-id="${order.id}">
        <td>${order.id}</td>
        <td>${order.customerName}</td>
        <td>${order.phone || ""}</td>
        <td>${order.date}</td>
        <td class="price">${formatMoney(order.total)}</td>
        <td>
          <span class="status ${statusClass}" style="padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; font-weight: bold; display: inline-block;">
            ${getStatusText(order.status)}
          </span>
        </td>
        <td>
          <span class="payment ${paymentClass}" style="padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; font-weight: bold; display: inline-block;">
            ${getPaymentText(order.payment)}
          </span>
        </td>
        <td>
          <div class="action-group" style="display: flex; gap: 8px;">
            <button class="action-btn view-btn" onclick="viewOrderDetail('${order.id}')" style="background: none; border: 1px solid #ccc; border-radius: 4px; padding: 4px 8px; cursor: pointer; color: #1a73e8;">
              <i class="fa-regular fa-eye"></i> Xem
            </button>
            <button class="action-btn delete-btn" onclick="deleteOrder('${order.id}')" style="background: none; border: 1px solid #fce8e6; border-radius: 4px; padding: 4px 8px; cursor: pointer; color: #d93025;">
              <i class="fa-regular fa-trash-can"></i> Xóa
            </button>
          </div>
        </td>
      </tr>
    `;
    })
    .join("");
}

// Render Pagination
function renderPagination() {
  const totalPages = Math.ceil(OrderManager.filteredOrders.length / OrderManager.pageSize);
  const pagination = document.querySelector(".pagination");
  if (!pagination) return;

  let html = `
    <button class="page-btn" onclick="changePage(${OrderManager.currentPage - 1})">
      &lt;
    </button>
  `;

  for (let i = 1; i <= totalPages; i++) {
    html += `
      <button class="page-btn ${i === OrderManager.currentPage ? 'active' : ''}" onclick="changePage(${i})">
        ${i}
      </button>
    `;
  }

  html += `
    <button class="page-btn" onclick="changePage(${OrderManager.currentPage + 1})">
      &gt;
    </button>
    <select id="pageSize" onchange="changePageSize(this)" style="margin-left: 15px; padding: 4px 8px; border-radius: 4px; border: 1px solid #ccc;">
      <option value="5" ${OrderManager.pageSize === 5 ? 'selected' : ''}>5/Trang</option>
      <option value="10" ${OrderManager.pageSize === 10 ? 'selected' : ''}>10/Trang</option>
      <option value="25" ${OrderManager.pageSize === 25 ? 'selected' : ''}>25/Trang</option>
    </select>
  `;

  pagination.innerHTML = html;
}

window.changePage = function (page) {
  const totalPages = Math.ceil(OrderManager.filteredOrders.length / OrderManager.pageSize);
  if (page < 1 || page > totalPages) return;
  OrderManager.currentPage = page;
  renderOrders();
};

window.changePageSize = function (selectEl) {
  OrderManager.pageSize = parseInt(selectEl.value);
  OrderManager.currentPage = 1;
  renderOrders();
};

function renderOrders() {
  renderTable();
  renderPagination();
}

// Show Order Detail Modal
window.viewOrderDetail = function (orderId) {
  const order = OrderManager.orders.find((o) => o.id === orderId);
  if (!order) return;

  const products = DB.getProducts();
  const modal = document.getElementById("orderModal");
  const detailContainer = document.getElementById("orderDetail");

  if (!modal || !detailContainer) return;

  // Render sản phẩm đã mua
  const itemsHtml = order.items
    .map((item) => {
      const p = products.find((prod) => prod.id === item.productId);
      const name = p ? p.name : "Sản phẩm đã xóa";
      const image = p ? p.image : "../image/image 4.png";
      const code = p ? p.code : "N/A";
      return `
      <div style="display: flex; gap: 15px; align-items: center; margin-bottom: 12px; border-bottom: 1px solid #eee; padding-bottom: 8px;">
        <img src="${image}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;">
        <div style="flex-grow: 1;">
          <h4 style="margin: 0 0 3px 0; font-size: 0.9rem; color: #333;">${name}</h4>
          <span style="font-size: 0.8rem; color: #666;">Mã: ${code} | SL: ${item.quantity}</span>
        </div>
        <div style="font-weight: bold; color: #333;">${formatMoney(item.price * item.quantity)}</div>
      </div>
    `;
    })
    .join("");

  detailContainer.innerHTML = `
    <div style="font-family: inherit; line-height: 1.5; color: #333;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px dashed #ccc;">
        <div>
          <strong>Mã đơn hàng:</strong> <span style="color: #d4af37; font-weight: bold;">${order.id}</span>
        </div>
        <div>
          <strong>Ngày đặt:</strong> ${order.date}
        </div>
      </div>

      <div style="margin-bottom: 20px;">
        <h4 style="margin: 0 0 10px 0; color: #d4af37; border-left: 3px solid #d4af37; padding-left: 8px;">Thông tin khách hàng</h4>
        <p style="margin: 3px 0;"><strong>Họ tên:</strong> ${order.customerName}</p>
        <p style="margin: 3px 0;"><strong>Số điện thoại:</strong> ${order.phone || "N/A"}</p>
        <p style="margin: 3px 0;"><strong>Địa chỉ:</strong> ${order.address || "Chưa cung cấp"}</p>
      </div>

      <div style="margin-bottom: 20px;">
        <h4 style="margin: 0 0 10px 0; color: #d4af37; border-left: 3px solid #d4af37; padding-left: 8px;">Danh sách sản phẩm</h4>
        ${itemsHtml}
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; font-size: 1.1rem;">
        <strong>Tổng thanh toán:</strong>
        <strong style="color: #c5221f; font-size: 1.25rem;">${formatMoney(order.total)}</strong>
      </div>

      <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; display: flex; align-items: center; justify-content: space-between; gap: 15px;">
        <div>
          <strong>Phương thức:</strong> <span style="font-weight: bold;">${getPaymentText(order.payment)}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 10px;">
          <strong>Trạng thái:</strong>
          <select id="updateStatusSelect" onchange="updateOrderStatus('${order.id}', this)" style="padding: 6px 12px; border-radius: 4px; border: 1px solid #ccc; font-weight: bold; background: white; cursor: pointer;">
            <option value="processing" ${order.status === "processing" ? "selected" : ""}>Chờ xử lý</option>
            <option value="shipping" ${order.status === "shipping" ? "selected" : ""}>Đang vận chuyển</option>
            <option value="completed" ${order.status === "completed" ? "selected" : ""}>Hoàn thành</option>
            <option value="cancelled" ${order.status === "cancelled" ? "selected" : ""}>Đã hủy</option>
          </select>
        </div>
      </div>
    </div>
  `;

  modal.style.display = "flex";
};

// Update order status on select change
window.updateOrderStatus = function (orderId, selectEl) {
  const newStatus = selectEl.value;
  const orders = DB.getOrders();
  const index = orders.findIndex((o) => o.id === orderId);

  if (index !== -1) {
    orders[index].status = newStatus;
    DB.saveOrders(orders);
    
    // Nếu hủy đơn hàng, ta có thể hoàn lại tồn kho cho các sản phẩm?
    // Để giữ đơn giản cho Mock, ta chỉ đổi trạng thái
    alert("Cập nhật trạng thái đơn hàng thành công!");
    loadOrders(); // Tải lại bảng & bộ đếm
  }
};

// Delete Order
window.deleteOrder = function (orderId) {
  if (!confirm(`Bạn có chắc chắn muốn xóa đơn hàng ${orderId}?`)) return;

  let orders = DB.getOrders();
  orders = orders.filter((o) => o.id !== orderId);
  DB.saveOrders(orders);

  alert("Đã xóa đơn hàng thành công!");
  loadOrders();
};

// Bind filters toolbar buttons
function bindToolbarFilters() {
  const buttons = document.querySelectorAll(".status-filter .status-btn");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      
      OrderManager.statusFilter = btn.dataset.status;
      applyFilters();
    });
  });
}

// Search
const searchInput = document.getElementById("searchOrder");
if (searchInput) {
  searchInput.addEventListener("input", () => {
    OrderManager.searchKeyword = searchInput.value.trim();
    applyFilters();
  });
}

// Close Modal Bindings
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("orderModal");
  const closeModal = document.getElementById("closeModal");

  if (closeModal && modal) {
    closeModal.onclick = function () {
      modal.style.display = "none";
    };
    
    window.onclick = function (event) {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    };
  }

  // Admin Profile Logout
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.onclick = function (e) {
      e.preventDefault();
      if (confirm("Bạn có muốn đăng xuất không?")) {
        localStorage.removeItem("user");
        window.location.href = "login.html";
      }
    };
  }

  loadOrders();
  bindToolbarFilters();
});