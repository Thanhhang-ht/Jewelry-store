// =========================================
// ORDER MANAGEMENT LOGIC (API CONNECTED)
// =========================================
const API_URL = "http://localhost:3000/api";

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

function formatDate(dateString) {
  const d = new Date(dateString);
  return `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}`;
}

function getStatusText(status) {
  switch (status) {
    case "pending":
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

async function loadOrders() {
  try {
    const res = await fetch(`${API_URL}/orders`, {
      headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
    });
    const result = await res.json();
    if (result.success) {
      OrderManager.orders = result.data;
      updateStatusCounts();
      applyFilters();
    }
  } catch (err) {
    console.error(err);
  }
}

function updateStatusCounts() {
  const orders = OrderManager.orders;
  document.getElementById("countAll").innerText = orders.length;
  document.getElementById("countProcessing").innerText = orders.filter(o => ["pending", "processing"].includes(o.status)).length;
  document.getElementById("countShipping").innerText = orders.filter(o => o.status === "shipping").length;
  document.getElementById("countCompleted").innerText = orders.filter(o => o.status === "completed").length;
  document.getElementById("countCancelled").innerText = orders.filter(o => o.status === "cancelled").length;
}

function applyFilters() {
  const keyword = OrderManager.searchKeyword.toLowerCase();
  const filter = OrderManager.statusFilter;

  OrderManager.filteredOrders = OrderManager.orders.filter((order) => {
    let s = order.status;
    if (s === "pending") s = "processing";
    const matchStatus = filter === "all" || s === filter;
    
    const orderCode = order.order_code ? order.order_code.toLowerCase() : String(order.id);
    const matchKeyword = 
      orderCode.includes(keyword) || 
      order.customer_name.toLowerCase().includes(keyword) ||
      (order.phone && order.phone.includes(keyword));
      
    return matchStatus && matchKeyword;
  });

  OrderManager.currentPage = 1;
  renderOrders();
}

function renderTable() {
  const tbody = document.getElementById("orderTableBody");
  if (!tbody) return;

  const start = (OrderManager.currentPage - 1) * OrderManager.pageSize;
  const end = start + OrderManager.pageSize;
  const pageOrders = OrderManager.filteredOrders.slice(start, end);

  if (pageOrders.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" class="empty-data" style="text-align:center;padding:20px;">Không có đơn hàng nào.</td></tr>`;
    return;
  }

  tbody.innerHTML = pageOrders.map((order) => {
    let s = order.status;
    if (s === "pending") s = "processing";
    
    return `
      <tr data-order-id="${order.id}">
        <td>${order.order_code || order.id}</td>
        <td>${order.customer_name}</td>
        <td>${order.phone || ""}</td>
        <td>${formatDate(order.created_at)}</td>
        <td class="price">${formatMoney(order.total_price)}</td>
        <td><span class="status ${s}" style="padding:4px 8px;border-radius:4px;font-size:0.8rem;font-weight:bold;">${getStatusText(s)}</span></td>
        <td><span class="payment ${order.payment_method}" style="padding:4px 8px;border-radius:4px;font-size:0.8rem;font-weight:bold;">${getPaymentText(order.payment_method)}</span></td>
        <td>
          <div class="action-group" style="display:flex;gap:8px;">
            <button class="action-btn view-btn" onclick="viewOrderDetail('${order.id}')" style="background:none;border:1px solid #ccc;border-radius:4px;padding:4px 8px;cursor:pointer;color:#1a73e8;">
              <i class="fa-regular fa-eye"></i> Xem
            </button>
            <button class="action-btn delete-btn" onclick="deleteOrder('${order.id}')" style="background:none;border:1px solid #fce8e6;border-radius:4px;padding:4px 8px;cursor:pointer;color:#d93025;">
              <i class="fa-regular fa-trash-can"></i> Xóa
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

function renderPagination() {
  const totalPages = Math.ceil(OrderManager.filteredOrders.length / OrderManager.pageSize);
  const pagination = document.querySelector(".pagination");
  if (!pagination) return;

  let html = `<button class="page-btn" onclick="changePage(${OrderManager.currentPage - 1})">&lt;</button>`;
  for (let i = 1; i <= totalPages; i++) {
    html += `<button class="page-btn ${i === OrderManager.currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
  }
  html += `
    <button class="page-btn" onclick="changePage(${OrderManager.currentPage + 1})">&gt;</button>
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

window.viewOrderDetail = async function (orderId) {
  const order = OrderManager.orders.find((o) => o.id == orderId);
  if (!order) return;

  const modal = document.getElementById("orderModal");
  const detailContainer = document.getElementById("orderDetail");
  if (!modal || !detailContainer) return;

  const itemsHtml = order.items.map((item) => {
    return `
      <div style="display: flex; gap: 15px; align-items: center; margin-bottom: 12px; border-bottom: 1px solid #eee; padding-bottom: 8px;">
        <img src="../image/image 4.png" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;">
        <div style="flex-grow: 1;">
          <h4 style="margin: 0 0 3px 0; font-size: 0.9rem; color: #333;">${item.product_name}</h4>
          <span style="font-size: 0.8rem; color: #666;">SL: ${item.quantity}</span>
        </div>
        <div style="font-weight: bold; color: #333;">${formatMoney(item.price * item.quantity)}</div>
      </div>
    `;
  }).join("");

  let s = order.status;
  if (s === "pending") s = "processing";

  detailContainer.innerHTML = `
    <div style="font-family: inherit; line-height: 1.5; color: #333;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px dashed #ccc;">
        <div><strong>Mã đơn hàng:</strong> <span style="color: #d4af37; font-weight: bold;">${order.order_code || order.id}</span></div>
        <div><strong>Ngày đặt:</strong> ${formatDate(order.created_at)}</div>
      </div>
      <div style="margin-bottom: 20px;">
        <h4 style="margin: 0 0 10px 0; color: #d4af37; border-left: 3px solid #d4af37; padding-left: 8px;">Thông tin khách hàng</h4>
        <p style="margin: 3px 0;"><strong>Họ tên:</strong> ${order.customer_name}</p>
        <p style="margin: 3px 0;"><strong>Số điện thoại:</strong> ${order.phone || "N/A"}</p>
        <p style="margin: 3px 0;"><strong>Địa chỉ:</strong> ${order.shipping_address || "Chưa cung cấp"}</p>
      </div>
      <div style="margin-bottom: 20px;">
        <h4 style="margin: 0 0 10px 0; color: #d4af37; border-left: 3px solid #d4af37; padding-left: 8px;">Danh sách sản phẩm</h4>
        ${itemsHtml}
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; font-size: 1.1rem;">
        <strong>Tổng thanh toán:</strong>
        <strong style="color: #c5221f; font-size: 1.25rem;">${formatMoney(order.total_price)}</strong>
      </div>
      <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; display: flex; align-items: center; justify-content: space-between; gap: 15px;">
        <div><strong>Phương thức:</strong> <span style="font-weight: bold;">${getPaymentText(order.payment_method)}</span></div>
        <div style="display: flex; align-items: center; gap: 10px;">
          <strong>Trạng thái:</strong>
          <select id="updateStatusSelect" onchange="updateOrderStatus('${order.id}', this)" style="padding: 6px 12px; border-radius: 4px; border: 1px solid #ccc; font-weight: bold; background: white; cursor: pointer;">
            <option value="processing" ${s === "processing" ? "selected" : ""}>Chờ xử lý</option>
            <option value="shipping" ${s === "shipping" ? "selected" : ""}>Đang vận chuyển</option>
            <option value="completed" ${s === "completed" ? "selected" : ""}>Hoàn thành</option>
            <option value="cancelled" ${s === "cancelled" ? "selected" : ""}>Đã hủy</option>
          </select>
        </div>
      </div>
    </div>
  `;
  modal.style.display = "flex";
};

window.updateOrderStatus = async function (orderId, selectEl) {
  const newStatus = selectEl.value;
  try {
    const res = await fetch(`${API_URL}/orders/${orderId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({ status: newStatus })
    });
    const result = await res.json();
    if (result.success) {
      alert("Cập nhật trạng thái đơn hàng thành công!");
      loadOrders();
    } else {
      alert("Lỗi: " + result.message);
    }
  } catch (err) {
    console.error(err);
  }
};

window.deleteOrder = function () {
  alert("Xóa đơn hàng đã bị vô hiệu hóa vì lý do bảo mật dữ liệu. Vui lòng chuyển trạng thái sang 'Đã hủy'.");
};

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

const searchInput = document.getElementById("searchOrder");
if (searchInput) {
  searchInput.addEventListener("input", () => {
    OrderManager.searchKeyword = searchInput.value.trim();
    applyFilters();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "login.html";
    return;
  }
  
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const adminName = document.getElementById("adminName");
  if (adminName && user.fullname) adminName.textContent = user.fullname;

  const modal = document.getElementById("orderModal");
  const closeModal = document.getElementById("closeModal");
  if (closeModal && modal) {
    closeModal.onclick = () => modal.style.display = "none";
    window.onclick = (event) => { if (event.target === modal) modal.style.display = "none"; };
  }

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.onclick = function (e) {
      e.preventDefault();
      if (confirm("Bạn có muốn đăng xuất không?")) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        window.location.href = "login.html";
      }
    };
  }

  loadOrders();
  bindToolbarFilters();
});