// =================================
// DỮ LIỆU ĐỊA CHỈ
// =================================

let addresses = JSON.parse(localStorage.getItem("addresses")) || [
  {
    id: 1,
    label: "Địa chỉ mặc định",
    receiver: "Phan Thanh Hằng",
    phone: "0364665798",
    address: "789 Đại Từ, Đại Kim, Hoàng Mai, Hà Nội",
    isDefault: true,
  },

  {
    id: 2,
    label: "Địa chỉ công ty",
    receiver: "Phan Thanh Hằng",
    phone: "0364665798",
    address: "689 Trương Định, Thịnh Liệt, Hoàng Mai, Hà Nội",
    isDefault: false,
  },
];

// =================================
// LƯU LOCAL STORAGE
// =================================

function saveAddresses() {
  localStorage.setItem("addresses", JSON.stringify(addresses));
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


        <div class="address-card 
        ${item.isDefault ? "active-address" : ""}"
        data-id="${item.id}">


            <div class="address-top">


                <label>


                    <input 
                    type="radio"
                    name="defaultAddress"
                    data-id="${item.id}"
                    ${item.isDefault ? "checked" : ""}>


                    <span>
                    ${item.label}
                    </span>


                </label>


            </div>



            <h4 class="receiver-name">
                ${item.receiver}
            </h4>



            <p class="receiver-phone">
                ${item.phone}
            </p>



            <p class="receiver-address">
                ${item.address}
            </p>



            <div class="address-actions">


                <button 
                class="edit-btn"
                data-id="${item.id}">


                    <i class="fa-solid fa-pen"></i>
                    Sửa


                </button>



                <button 
                class="delete-btn"
                data-id="${item.id}">


                    <i class="fa-solid fa-trash"></i>
                    Xóa


                </button>


            </div>



        </div>


        `;
  });

  updateAddressCount();

  checkEmptyAddress();
}

// =================================
// CẬP NHẬT SỐ LƯỢNG
// =================================

function updateAddressCount() {
  const count = document.getElementById("addressCount");

  if (count) {
    count.innerText = addresses.length;
  }
}

// =================================
// KIỂM TRA RỖNG
// =================================

function checkEmptyAddress() {
  const list = document.getElementById("addressList");

  const empty = document.getElementById("emptyAddress");

  if (addresses.length === 0) {
    list.style.display = "none";

    empty.style.display = "block";
  } else {
    list.style.display = "grid";

    empty.style.display = "none";
  }
}

// =================================
// THÊM ĐỊA CHỈ
// =================================

function addAddress() {
  const receiver = prompt("Nhập họ và tên:");

  if (!receiver) return;

  const phone = prompt("Nhập số điện thoại:");

  if (!phone) return;

  const address = prompt("Nhập địa chỉ:");

  if (!address) return;

  const label = prompt("Tên địa chỉ (Nhà riêng/Công ty):") || "Địa chỉ mới";

  const newAddress = {
    id: Date.now(),

    label: label,

    receiver: receiver,

    phone: phone,

    address: address,

    isDefault: false,
  };

  addresses.push(newAddress);

  saveAddresses();

  renderAddresses();

  alert("Thêm địa chỉ thành công!");
}

// =================================
// SỬA ĐỊA CHỈ
// =================================

function editAddress(id) {
  const item = addresses.find((address) => address.id === id);

  if (!item) return;

  const receiver = prompt("Họ tên:", item.receiver);

  if (receiver === null) return;

  const phone = prompt("Số điện thoại:", item.phone);

  if (phone === null) return;

  const address = prompt("Địa chỉ:", item.address);

  if (address === null) return;

  const label = prompt("Tên địa chỉ:", item.label);

  if (label === null) return;

  item.receiver = receiver;

  item.phone = phone;

  item.address = address;

  item.label = label;

  saveAddresses();

  renderAddresses();
}

// =================================
// XÓA ĐỊA CHỈ
// =================================

function deleteAddress(id) {
  const confirmDelete = confirm("Bạn có chắc muốn xóa địa chỉ này?");

  if (!confirmDelete) return;

  addresses = addresses.filter((item) => item.id !== id);

  // Nếu không còn địa chỉ mặc định
  if (addresses.length > 0 && !addresses.some((item) => item.isDefault)) {
    addresses[0].isDefault = true;

    addresses[0].label = "Địa chỉ mặc định";
  }

  saveAddresses();

  renderAddresses();
}

// =================================
// CHỌN ĐỊA CHỈ MẶC ĐỊNH
// =================================

function setDefaultAddress(id) {
  addresses.forEach((item) => {
    if (item.id === id) {
      item.isDefault = true;

      item.label = "Địa chỉ mặc định";
    } else {
      item.isDefault = false;
    }
  });

  saveAddresses();

  renderAddresses();
}

// =================================
// ĐĂNG XUẤT
// =================================

function logout() {
  if (confirm("Bạn có muốn đăng xuất không?")) {
    localStorage.removeItem("user");

    window.location.href = "login.html";
  }
}

// =================================
// LOAD TRANG
// =================================

document.addEventListener("DOMContentLoaded", () => {
  renderAddresses();

  // thêm địa chỉ

  const addBtn = document.getElementById("addAddressBtn");

  if (addBtn) {
    addBtn.onclick = () => addAddress();
  }

  const addFirstBtn = document.getElementById("addFirstAddressBtn");

  if (addFirstBtn) {
    addFirstBtn.onclick = () => addAddress();
  }

  // logout

  const logoutBtn = document.getElementById("logoutBtn");

  if (logoutBtn) {
    logoutBtn.onclick = (e) => {
      e.preventDefault();

      logout();
    };
  }
});

// =================================
// CLICK SỬA / XÓA
// =================================

document.addEventListener("click", (e) => {
  const edit = e.target.closest(".edit-btn");

  if (edit) {
    editAddress(Number(edit.dataset.id));
  }

  const del = e.target.closest(".delete-btn");

  if (del) {
    deleteAddress(Number(del.dataset.id));
  }
});

// =================================
// RADIO ĐỊA CHỈ
// =================================

document.addEventListener("change", (e) => {
  if (e.target.matches('input[name="defaultAddress"]')) {
    setDefaultAddress(Number(e.target.dataset.id));
  }
});
