// =================================
// DỮ LIỆU ĐỊA CHỈ & HÀM KẾT NỐI API
// =================================

let addresses = [];

function saveAddresses() {
  localStorage.setItem("addresses", JSON.stringify(addresses));
}

// Lấy thông tin địa chỉ từ CSDL qua API
async function loadAddressFromBackend() {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const res = await fetch("/api/auth/profile", {
      headers: { "Authorization": `Bearer ${token}` }
    });
    const result = await res.json();
    if (result.success) {
      const user = result.data;
      
      const sidebarName = document.getElementById("sidebarUserName");
      const sidebarEmail = document.getElementById("sidebarUserEmail");
      if (sidebarName) sidebarName.textContent = user.fullname;
      if (sidebarEmail) sidebarEmail.textContent = user.email;

      addresses = [
        {
          id: user.id,
          label: "Địa chỉ mặc định",
          receiver: user.fullname,
          phone: user.phone || "Chưa cập nhật SĐT",
          address: user.address || "Chưa cập nhật địa chỉ",
          isDefault: true
        }
      ];
      renderAddresses();
    }
  } catch (err) {
    console.error("Lỗi tải địa chỉ:", err);
  }
}

// Cập nhật địa chỉ vào CSDL MySQL
async function updateAddressToBackend(fullname, phone, address) {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const res = await fetch("/api/auth/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ fullname, phone, address })
    });
    const result = await res.json();
    if (result.success) {
      alert("🎉 Cập nhật địa chỉ thành công!");
      await loadAddressFromBackend();
      return true;
    } else {
      alert("Lỗi: " + result.message);
      return false;
    }
  } catch (err) {
    console.error(err);
    alert("Không thể kết nối đến máy chủ!");
    return false;
  }
}

// HIỂN THỊ DANH SÁCH ĐỊA CHỈ
function renderAddresses() {
  const addressList = document.getElementById("addressList");
  if (!addressList) return;

  addressList.innerHTML = "";

  addresses.forEach((item) => {
    addressList.innerHTML += `
        <div class="address-card ${item.isDefault ? "active-address" : ""}" data-id="${item.id}">
            <div class="address-top">
                <label>
                    <input type="radio" name="defaultAddress" data-id="${item.id}" ${item.isDefault ? "checked" : ""}>
                    <span>${item.label}</span>
                </label>
            </div>
            <h4 class="receiver-name">${item.receiver}</h4>
            <p class="receiver-phone">${item.phone}</p>
            <p class="receiver-address">${item.address}</p>
            <div class="address-actions">
                <button class="edit-btn" data-id="${item.id}">
                    <i class="fa-solid fa-pen"></i> Sửa
                </button>
            </div>
        </div>
        `;
  });

  updateAddressCount();
  checkEmptyAddress();
}

function updateAddressCount() {
  const count = document.getElementById("addressCount");
  if (count) count.innerText = addresses.length;
}

function checkEmptyAddress() {
  const list = document.getElementById("addressList");
  const empty = document.getElementById("emptyAddress");
  if (!list || !empty) return;

  if (addresses.length === 0) {
    list.style.display = "none";
    empty.style.display = "block";
  } else {
    list.style.display = "grid";
    empty.style.display = "none";
  }
}

// THÊM ĐỊA CHỈ
async function addAddress() {
  const receiver = prompt("Nhập họ và tên:");
  if (!receiver) return;

  const phone = prompt("Nhập số điện thoại:");
  if (!phone) return;

  const address = prompt("Nhập địa chỉ:");
  if (!address) return;

  await updateAddressToBackend(receiver, phone, address);
}

// SỬA ĐỊA CHỈ
async function editAddress(id) {
  const item = addresses.find((a) => a.id === id) || addresses[0];
  if (!item) return;

  const receiver = prompt("Họ tên người nhận:", item.receiver);
  if (receiver === null) return;

  const phone = prompt("Số điện thoại:", item.phone);
  if (phone === null) return;

  const address = prompt("Địa chỉ nhận hàng:", item.address);
  if (address === null) return;

  await updateAddressToBackend(receiver, phone, address);
}

// ĐĂNG XUẤT
function logout() {
  if (confirm("Bạn có muốn đăng xuất không?")) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "login.html";
  }
}

// LOAD TRANG
document.addEventListener("DOMContentLoaded", () => {
  loadAddressFromBackend();

  const addBtn = document.getElementById("addAddressBtn");
  if (addBtn) addBtn.onclick = () => addAddress();

  const addFirstBtn = document.getElementById("addFirstAddressBtn");
  if (addFirstBtn) addFirstBtn.onclick = () => addAddress();

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.onclick = (e) => {
      e.preventDefault();
      logout();
    };
  }
});

// CLICK SỬA
document.addEventListener("click", (e) => {
  const edit = e.target.closest(".edit-btn");
  if (edit) {
    editAddress(Number(edit.dataset.id));
  }
});
