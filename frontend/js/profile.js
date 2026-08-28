const API_URL = "/api";

const logoutBtn = document.getElementById("logoutBtn");
const editBtn = document.getElementById("editProfileBtn");
const addAddressBtn = document.getElementById("addAddressBtn");
const addressList = document.getElementById("addressList");

// ======================================================
// ĐĂNG XUẤT
// ======================================================
if (logoutBtn) {
  logoutBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const confirmLogout = confirm("Bạn có muốn đăng xuất không?");
    if (confirmLogout) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "login.html";
    }
  });
}

// ======================================================
// CHỈNH SỬA THÔNG TIN
// ======================================================
// CHỈNH SỬA THÔNG TIN
// ======================================================
if (editBtn) {
  editBtn.addEventListener("click", async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const currentName = document.getElementById("userName")?.textContent || "";
    const currentPhone = document.getElementById("userPhone")?.textContent || "";
    const currentAddress = localStorage.getItem("user_address") || "";

    const newName = prompt("Nhập họ và tên mới:", currentName);
    if (newName === null) return;

    const newPhone = prompt("Nhập số điện thoại mới:", currentPhone === "Chưa cập nhật" ? "" : currentPhone);
    if (newPhone === null) return;

    const newAddress = prompt("Nhập địa chỉ mới:", currentAddress);
    if (newAddress === null) return;

    try {
      const res = await fetch(`${API_URL}/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          fullname: newName.trim(),
          phone: newPhone.trim(),
          address: newAddress.trim()
        })
      });
      const result = await res.json();
      if (result.success) {
        alert("🎉 Cập nhật thông tin cá nhân thành công!");
        loadProfile();
      } else {
        alert("Lỗi: " + result.message);
      }
    } catch (err) {
      console.error(err);
      alert("Không thể kết nối đến máy chủ!");
    }
  });
}

// ======================================================
// TẠO HTML ĐỊA CHỈ THỰC TẾ
// ======================================================
function createAddressHTML(user) {
  return `
  <div class="address-card" data-id="${user.id}">
      <div class="address-top">
          <div>
              <input type="radio" name="address" checked>
              <span>Địa chỉ mặc định</span>
          </div>
      </div>
      <h4 class="receiver-name">${user.fullname}</h4>
      <p class="receiver-phone">${user.phone || "Chưa có SĐT"}</p>
      <p class="receiver-address">${user.address || "Chưa có địa chỉ"}</p>
  </div>`;
}

// ======================================================
// XEM TẤT CẢ ĐƠN HÀNG
// ======================================================
const orderLink = document.getElementById("viewAllOrders");
if (orderLink) {
  orderLink.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = "history.html";
  });
}

// ======================================================
// LOAD PROFILE TỪ BACKEND
// ======================================================
async function loadProfile() {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "login.html";
    return;
  }

  try {
    const res = await fetch(`${API_URL}/auth/profile`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    const result = await res.json();
    
    if (result.success) {
      const user = result.data;
      localStorage.setItem("user_address", user.address || "");
      
      const sidebarName = document.getElementById("sidebarUserName");
      const sidebarEmail = document.getElementById("sidebarUserEmail");
      if (sidebarName) sidebarName.textContent = user.fullname;
      if (sidebarEmail) sidebarEmail.textContent = user.email;

      const userName = document.getElementById("userName");
      const userEmail = document.getElementById("userEmail");
      const userPhone = document.getElementById("userPhone");
      const joinDate = document.getElementById("joinDate");

      if (userName) userName.textContent = user.fullname;
      if (userEmail) userEmail.textContent = user.email;
      if (userPhone) userPhone.textContent = user.phone || "Chưa cập nhật";
      
      if (joinDate) {
        const d = new Date(user.created_at);
        joinDate.textContent = `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`;
      }

      // Render địa chỉ thật của người dùng
      if (addressList) {
        addressList.innerHTML = createAddressHTML(user);
      }
    } else {
      localStorage.removeItem("token");
      window.location.href = "login.html";
    }
  } catch (err) {
    console.error(err);
  }
}

// ======================================================
// RENDER ĐƠN HÀNG GẦN ĐÂY THỰC TẾ
// ======================================================
async function loadOrders() {
  const token = localStorage.getItem("token");
  if (!token) return;

  const tbody = document.getElementById("orderTable");
  if (!tbody) return;

  try {
    const res = await fetch(`${API_URL}/orders/my-orders`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    const result = await res.json();
    if (result.success && result.data && result.data.length > 0) {
      const recentOrders = result.data.slice(0, 5);

      tbody.innerHTML = recentOrders.map(o => {
        let statusClass = 'processing';
        let statusText = 'Đang xử lý';

        if (o.status === 'shipping') {
          statusClass = 'shipping';
          statusText = 'Đang giao';
        } else if (o.status === 'completed') {
          statusClass = 'success';
          statusText = 'Hoàn thành';
        } else if (o.status === 'cancelled') {
          statusClass = 'cancel';
          statusText = 'Đã hủy';
        }

        const dateStr = new Date(o.created_at).toLocaleDateString('vi-VN');
        const totalStr = Number(o.total_price).toLocaleString('vi-VN') + 'đ';

        return `
          <tr data-id="${o.id}">
            <td>${o.order_code}</td>
            <td>${dateStr}</td>
            <td>${totalStr}</td>
            <td>
              <span class="status ${statusClass}">
                ${statusText}
              </span>
            </td>
            <td>
              <a href="order-detail.html?id=${o.id}" class="detail-btn">
                Xem chi tiết
              </a>
            </td>
          </tr>
        `;
      }).join('');
    } else {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 20px; color: #666;">Bạn chưa có đơn hàng nào gần đây.</td></tr>`;
    }
  } catch (err) {
    console.error("Lỗi tải đơn hàng gần đây:", err);
  }
}

// KHỞI TẠO TRANG
document.addEventListener("DOMContentLoaded", () => {
  loadProfile();
  loadOrders();
});
