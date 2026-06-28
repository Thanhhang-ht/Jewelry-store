// ======================================================
// KHAI BÁO
// ======================================================

const API = {
  profile: "/api/profile",
  orders: "/api/orders",
  addresses: "/api/addresses",
};

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
      // Backend sau này:
      // await fetch("/logout",{method:"POST"});

      window.location.href = "login.html";
    }
  });
}

// ======================================================
// CHỈNH SỬA THÔNG TIN
// ======================================================

if (editBtn) {
  editBtn.addEventListener("click", () => {
    alert("Chức năng chỉnh sửa sẽ được kết nối Backend.");
  });
}

// ======================================================
// CHỌN ĐỊA CHỈ MẶC ĐỊNH
// ======================================================

function bindAddressRadio() {
  const radios = document.querySelectorAll('.address-card input[type="radio"]');

  radios.forEach((radio) => {
    radio.addEventListener("change", () => {
      document.querySelectorAll(".address-card").forEach((card) => {
        card.classList.remove("active-address");
      });

      radio.closest(".address-card").classList.add("active-address");
    });
  });
}

bindAddressRadio();

// ======================================================
// TẠO HTML ĐỊA CHỈ
// ======================================================

function createAddressHTML(address) {
  return `

  <div
      class="address-card"
      data-id="${address.id}">

      <div class="address-top">

          <div>

              <input
                  type="radio"
                  name="address">

              <span>${address.label}</span>

          </div>

          <i class="fa-solid fa-ellipsis-vertical menu-btn"></i>

      </div>

      <h4 class="receiver-name">
          ${address.name}
      </h4>

      <p class="receiver-phone">
          ${address.phone}
      </p>

      <p class="receiver-address">
          ${address.address}
      </p>

  </div>

  `;
}

// ======================================================
// THÊM ĐỊA CHỈ
// ======================================================

if (addAddressBtn) {
  addAddressBtn.addEventListener("click", () => {
    const name = prompt("Nhập họ tên:");

    if (!name) return;

    const phone = prompt("Nhập số điện thoại:");

    if (!phone) return;

    const address = prompt("Nhập địa chỉ:");

    if (!address) return;

    const addressCard = document.createElement("div");

    addressCard.innerHTML = createAddressHTML({
      id: Date.now(),

      label: "Địa chỉ mới",

      name: name,

      phone: phone,

      address: address,
    });

    addressList.appendChild(addressCard.firstElementChild);

    bindAddressRadio();

    attachMenuEvents();
  });
}

// ======================================================
// MENU 3 CHẤM
// ======================================================

function attachMenuEvents() {
  const menuBtns = document.querySelectorAll(".menu-btn");

  menuBtns.forEach((btn) => {
    btn.removeEventListener("click", menuClickHandler);

    btn.addEventListener("click", menuClickHandler);
  });
}

function menuClickHandler() {
  const card = this.closest(".address-card");

  const nameEl = card.querySelector(".receiver-name");
  const phoneEl = card.querySelector(".receiver-phone");
  const addressEl = card.querySelector(".receiver-address");

  const choice = prompt(
    `Chọn chức năng

1 - Sửa địa chỉ

2 - Xóa địa chỉ`
  );

  // =====================
  // SỬA
  // =====================

  if (choice === "1") {
    const newName = prompt("Họ tên:", nameEl.innerText);

    const newPhone = prompt("Số điện thoại:", phoneEl.innerText);

    const newAddress = prompt("Địa chỉ:", addressEl.innerText);

    if (newName) {
      nameEl.innerText = newName;
    }

    if (newPhone) {
      phoneEl.innerText = newPhone;
    }

    if (newAddress) {
      addressEl.innerText = newAddress;
    }

    // Backend:
    // fetch(API.addresses + "/" + card.dataset.id)
  }

  // =====================
  // XÓA
  // =====================
  else if (choice === "2") {
    const confirmDelete = confirm("Bạn có chắc muốn xóa địa chỉ này?");

    if (confirmDelete) {
      // Backend:
      // fetch(API.addresses + "/" + card.dataset.id,{
      //      method:"DELETE"
      // });

      card.remove();
    }
  }
}

attachMenuEvents();
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
    // window.location.href = `order-detail.html?id=${orderId}`;

    window.location.href = "order-detail.html";
  }
});

// ======================================================
// LOAD PROFILE
// ======================================================

function loadProfile() {
  /*
    Backend:

    fetch(API.profile)
        .then(res => res.json())
        .then(user => {

            document.getElementById("sidebarUserName").textContent = user.name;
            document.getElementById("sidebarUserEmail").textContent = user.email;

            document.getElementById("userName").textContent = user.name;
            document.getElementById("userEmail").textContent = user.email;
            document.getElementById("userPhone").textContent = user.phone;
            document.getElementById("joinDate").textContent = user.joinDate;

        });

    */
}

// ======================================================
// LOAD ĐƠN HÀNG
// ======================================================

function loadOrders() {
  /*
    Backend:

    fetch(API.orders)
        .then(res => res.json())
        .then(renderOrders);

    */
}

// ======================================================
// LOAD ĐỊA CHỈ
// ======================================================

function loadAddresses() {
  /*
    Backend:

    fetch(API.addresses)
        .then(res => res.json())
        .then(renderAddresses);

    */
}

// ======================================================
// RENDER ĐƠN HÀNG
// ======================================================

function renderOrders(orders) {
  const orderTable = document.getElementById("orderTable");

  orderTable.innerHTML = "";

  orders.forEach((order) => {
    orderTable.innerHTML += `

        <tr data-id="${order.id}">

            <td>${order.code}</td>

            <td>${order.date}</td>

            <td>${order.total}</td>

            <td>

                <span class="status ${order.statusClass}">
                    ${order.status}
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
}

// ======================================================
// RENDER ĐỊA CHỈ
// ======================================================

function renderAddresses(addresses) {
  addressList.innerHTML = "";

  addresses.forEach((address) => {
    addressList.innerHTML += createAddressHTML(address);
  });

  bindAddressRadio();

  attachMenuEvents();
}

// ======================================================
// KHỞI TẠO TRANG
// ======================================================

document.addEventListener("DOMContentLoaded", () => {
  loadProfile();

  loadOrders();

  loadAddresses();
});
