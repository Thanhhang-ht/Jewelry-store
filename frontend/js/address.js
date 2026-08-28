// =================================
// DỮ LIỆU ĐỊA CHỈ & HÀM KẾT NỐI API
// =================================

let addresses = JSON.parse(localStorage.getItem("addresses")) || [];
let currentUserProfile = null;

function saveAddresses() {
  localStorage.setItem("addresses", JSON.stringify(addresses));
}

// Lấy thông tin tài khoản từ Backend API
async function loadAddressFromBackend() {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const res = await fetch("/api/auth/profile", {
      headers: { "Authorization": `Bearer ${token}` }
    });
    const result = await res.json();
    if (result.success) {
      currentUserProfile = result.data;
      
      const sidebarName = document.getElementById("sidebarUserName");
      const sidebarEmail = document.getElementById("sidebarUserEmail");
      if (sidebarName) sidebarName.textContent = currentUserProfile.fullname;
      if (sidebarEmail) sidebarEmail.textContent = currentUserProfile.email;

      // Nếu chưa có danh sách địa chỉ trong localStorage, khởi tạo địa chỉ mặc định từ Profile CSDL
      if (addresses.length === 0) {
        addresses = [
          {
            id: 1,
            label: "Địa chỉ mặc định",
            receiver: currentUserProfile.fullname,
            phone: currentUserProfile.phone || "",
            address: currentUserProfile.address || "",
            isDefault: true
          }
        ];
        saveAddresses();
      }
      renderAddresses();
    }
  } catch (err) {
    console.error("Lỗi tải thông tin tài khoản:", err);
  }
}

// Đồng bộ địa chỉ mặc định lên CSDL MySQL Backend
async function syncDefaultAddressToBackend(fullname, phone, address) {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    await fetch("/api/auth/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ fullname, phone, address })
    });
  } catch (err) {
    console.error("Lỗi đồng bộ CSDL:", err);
  }
}

// =================================
// HIỂN THỊ DANH SÁCH ĐỊA CHỈ
// =================================
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
          <p class="receiver-phone">${item.phone || "Chưa có SĐT"}</p>
          <p class="receiver-address">${item.address || "Chưa có địa chỉ"}</p>
          <div class="address-actions">
              <button class="edit-btn" data-id="${item.id}">
                  <i class="fa-solid fa-pen"></i> Sửa
              </button>
              <button class="delete-btn" data-id="${item.id}">
                  <i class="fa-solid fa-trash"></i> Xóa
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

// =================================
// QUẢN LÝ MODAL THÊM / SỬA ĐỊA CHỈ
// =================================
const modal = document.getElementById("addressModal");
const closeModalBtn = document.getElementById("closeModal");
const cancelBtn = document.getElementById("cancelBtn");
const addressForm = document.getElementById("addressForm");
const modalTitle = document.getElementById("modalTitle");

function openModal(isEdit = false, item = null) {
  if (!modal) return;
  modal.style.display = "flex";
  modal.classList.add("show");

  if (isEdit && item) {
    if (modalTitle) modalTitle.innerText = "Chỉnh sửa địa chỉ";
    document.getElementById("addressId").value = item.id;
    document.getElementById("receiver").value = item.receiver || "";
    document.getElementById("phone").value = item.phone || "";
    document.getElementById("address").value = item.address || "";
    document.getElementById("label").value = item.label || "Nhà riêng";
    document.getElementById("isDefault").checked = !!item.isDefault;
  } else {
    if (modalTitle) modalTitle.innerText = "Thêm địa chỉ mới";
    document.getElementById("addressId").value = "";
    document.getElementById("receiver").value = currentUserProfile?.fullname || "";
    document.getElementById("phone").value = currentUserProfile?.phone || "";
    document.getElementById("address").value = "";
    document.getElementById("label").value = "Nhà riêng";
    document.getElementById("isDefault").checked = addresses.length === 0;
  }
}

function closeModal() {
  if (!modal) return;
  modal.style.display = "none";
  modal.classList.remove("show");
  if (addressForm) addressForm.reset();
}

// Xử lý nộp form Thêm / Sửa địa chỉ
if (addressForm) {
  addressForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = document.getElementById("addressId").value;
    const receiver = document.getElementById("receiver").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const address = document.getElementById("address").value.trim();
    const label = document.getElementById("label").value;
    const isDefault = document.getElementById("isDefault").checked;

    if (!receiver || !phone || !address) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    if (id) {
      // Chỉnh sửa
      const item = addresses.find((a) => a.id == id);
      if (item) {
        item.receiver = receiver;
        item.phone = phone;
        item.address = address;
        item.label = isDefault ? "Địa chỉ mặc định" : label;

        if (isDefault) {
          addresses.forEach((a) => {
            if (a.id != id) a.isDefault = false;
          });
          item.isDefault = true;
          await syncDefaultAddressToBackend(receiver, phone, address);
        }
      }
      alert("🎉 Cập nhật địa chỉ thành công!");
    } else {
      // Thêm mới
      const newId = Date.now();
      if (isDefault || addresses.length === 0) {
        addresses.forEach((a) => (a.isDefault = false));
      }

      const newAddress = {
        id: newId,
        label: isDefault || addresses.length === 0 ? "Địa chỉ mặc định" : label,
        receiver,
        phone,
        address,
        isDefault: isDefault || addresses.length === 0,
      };

      addresses.push(newAddress);
      if (newAddress.isDefault) {
        await syncDefaultAddressToBackend(receiver, phone, address);
      }
      alert("🎉 Thêm địa chỉ mới thành công!");
    }

    saveAddresses();
    renderAddresses();
    closeModal();
  });
}

// Xóa địa chỉ
function deleteAddress(id) {
  if (!confirm("Bạn có chắc chắn muốn xóa địa chỉ này?")) return;
  addresses = addresses.filter((a) => a.id != id);

  if (addresses.length > 0 && !addresses.some((a) => a.isDefault)) {
    addresses[0].isDefault = true;
    addresses[0].label = "Địa chỉ mặc định";
    syncDefaultAddressToBackend(addresses[0].receiver, addresses[0].phone, addresses[0].address);
  }

  saveAddresses();
  renderAddresses();
}

// Đặt địa chỉ mặc định khi chọn radio button
function setDefaultAddress(id) {
  addresses.forEach((a) => {
    if (a.id == id) {
      a.isDefault = true;
      a.label = "Địa chỉ mặc định";
      syncDefaultAddressToBackend(a.receiver, a.phone, a.address);
    } else {
      a.isDefault = false;
    }
  });
  saveAddresses();
  renderAddresses();
}

// Đăng xuất
function logout() {
  if (confirm("Bạn có muốn đăng xuất không?")) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "login.html";
  }
}

// KHỞI TẠO EVENT LISTENERS
document.addEventListener("DOMContentLoaded", () => {
  loadAddressFromBackend();

  // Nút mở Modal thêm địa chỉ
  const addBtn = document.getElementById("addAddressBtn");
  if (addBtn) addBtn.onclick = () => openModal(false);

  const addFirstBtn = document.getElementById("addFirstAddressBtn");
  if (addFirstBtn) addFirstBtn.onclick = () => openModal(false);

  // Nút đóng modal
  if (closeModalBtn) closeModalBtn.onclick = closeModal;
  if (cancelBtn) cancelBtn.onclick = closeModal;

  window.onclick = (e) => {
    if (e.target === modal) closeModal();
  };

  // Nút đăng xuất
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.onclick = (e) => {
      e.preventDefault();
      logout();
    };
  }
});

// EVENT DELEGATION SỬA / XÓA
document.addEventListener("click", (e) => {
  const edit = e.target.closest(".edit-btn");
  if (edit) {
    const id = Number(edit.dataset.id);
    const item = addresses.find((a) => a.id == id);
    if (item) openModal(true, item);
  }

  const del = e.target.closest(".delete-btn");
  if (del) {
    const id = Number(del.dataset.id);
    deleteAddress(id);
  }
});

// ĐỔI ĐỊA CHỈ MẶC ĐỊNH KHI CHỌN RADIO
document.addEventListener("change", (e) => {
  if (e.target.matches('input[name="defaultAddress"]')) {
    setDefaultAddress(Number(e.target.dataset.id));
  }
});
