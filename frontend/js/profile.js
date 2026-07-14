const API_URL = "http://localhost:3000/api";

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
if (editBtn) {
  editBtn.addEventListener("click", () => {
    alert("Chức năng chỉnh sửa thông tin đang được cập nhật (Tùy chọn tương lai).");
  });
}

// ======================================================
// TẠO HTML ĐỊA CHỈ (MOCK)
// ======================================================
function createAddressHTML(address) {
  return `
  <div class="address-card" data-id="${address.id}">
      <div class="address-top">
          <div>
              <input type="radio" name="address">
              <span>${address.label}</span>
          </div>
          <i class="fa-solid fa-ellipsis-vertical menu-btn"></i>
      </div>
      <h4 class="receiver-name">${address.name}</h4>
      <p class="receiver-phone">${address.phone}</p>
      <p class="receiver-address">${address.address}</p>
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
    } else {
      localStorage.removeItem("token");
      window.location.href = "login.html";
    }
  } catch (err) {
    console.error(err);
  }
}

// ======================================================
// RENDER ĐƠN HÀNG (MOCK TẠM TRƯỚC KHI LÀM PHASE 4)
// ======================================================
function loadOrders() {
  // Sẽ tích hợp ở Phase 4 (History/Orders)
}

// ======================================================
// RENDER ĐỊA CHỈ (MOCK)
// ======================================================
function loadAddresses() {
  if (addressList) {
    addressList.innerHTML = createAddressHTML({
        id: 1, label: "Nhà riêng", name: "Nguyễn Văn A", phone: "0123456789", address: "123 Đường ABC, Quận XYZ, TP.HCM"
    });
  }
}

// ======================================================
// KHỞI TẠO TRANG
// ======================================================
document.addEventListener("DOMContentLoaded", () => {
  loadProfile();
  loadOrders();
  loadAddresses();
});
