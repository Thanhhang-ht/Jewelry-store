// =========================================
// CART - KẾT NỐI API THỰC TẾ
// Giỏ hàng lưu tại localStorage, 
// thông tin sản phẩm lấy từ API
// =========================================

const API_URL = "/api";

function formatMoney(value) {
  return Number(value).toLocaleString("vi-VN") + "đ";
}

// Lấy giỏ hàng từ localStorage
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

// Lưu giỏ hàng vào localStorage
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Render toàn bộ giỏ hàng
function renderCart() {
  const container = document.getElementById("cartItems");
  if (!container) return;

  const cart = getCart();

  if (cart.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 60px 20px; font-size: 1.1rem; color: #666;">
        🛒 Giỏ hàng của bạn đang trống.<br><br>
        <a href="products.html" style="color: #d4af37; text-decoration: underline; font-weight: bold; font-size: 1rem;">
          Mua sắm ngay →
        </a>
      </div>
    `;
    updateOrderInfo();
    return;
  }

  container.innerHTML = cart
    .map((item) => {
      const itemTotal = Number(item.price) * item.quantity;
      const isChecked = item.checked !== false;

      return `
      <div class="cart-item" data-id="${item.id}">
        <div class="check" onclick="toggleItemCheck(${item.id})">
          <i class="fa-regular ${isChecked ? "fa-circle-check" : "fa-circle"}"></i>
        </div>

        <div class="product" onclick="window.location.href='product-detail.html?id=${item.id}'" style="cursor: pointer;">
          <img src="${item.image || "../image/image 24.png"}" alt="${item.name}">
          <div class="info">
            <h3>${item.name}</h3>
            <p>Chất liệu: ${item.material || "Bạc 925"}</p>
            <p>Mã: ${item.code || "SP" + item.id}</p>
          </div>
        </div>

        <div class="price">${formatMoney(item.price)}</div>

        <div class="quantity">
          <button onclick="changeQty(${item.id}, -1)">-</button>
          <span>${item.quantity}</span>
          <button onclick="changeQty(${item.id}, 1)">+</button>
        </div>

        <div class="total">${formatMoney(itemTotal)}</div>

        <div class="delete" onclick="deleteCartItem(${item.id})">
          <i class="fa-regular fa-trash-can"></i>
        </div>
      </div>
    `;
    })
    .join("");

  updateOrderInfo();
  updateSelectAllState();
}

// Tích chọn / bỏ chọn sản phẩm
window.toggleItemCheck = function (productId) {
  const cart = getCart();
  const item = cart.find((i) => i.id == productId);
  if (item) {
    item.checked = !item.checked;
    saveCart(cart);
    renderCart();
  }
};

// Thay đổi số lượng (+1 hoặc -1)
window.changeQty = function (productId, delta) {
  const cart = getCart();
  const item = cart.find((i) => i.id == productId);

  if (item) {
    const newQty = item.quantity + delta;
    if (newQty < 1) return;

    // Kiểm tra tồn kho qua API
    fetch(`${API_URL}/products/${productId}`)
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          const stock = result.data.stock;
          if (newQty > stock) {
            alert(`Sản phẩm này chỉ còn ${stock} sản phẩm trong kho!`);
            return;
          }
          item.quantity = newQty;
          saveCart(cart);
          renderCart();
        }
      })
      .catch(() => {
        // Nếu API lỗi, vẫn cho phép thay đổi
        item.quantity = newQty;
        saveCart(cart);
        renderCart();
      });
  }
};

// Xóa sản phẩm khỏi giỏ hàng
window.deleteCartItem = function (productId) {
  if (confirm("Bạn có muốn xóa sản phẩm này khỏi giỏ hàng?")) {
    let cart = getCart();
    cart = cart.filter((i) => i.id != productId);
    saveCart(cart);
    renderCart();
  }
};

// Tính lại tổng tiền
function updateOrderInfo() {
  const cart = getCart();
  let subtotal = 0;

  cart.forEach((item) => {
    if (item.checked !== false) {
      subtotal += Number(item.price) * item.quantity;
    }
  });

  const subtotalEl = document.querySelector(".order-box .row span:last-child");
  const totalEl = document.querySelector(".total-order span:last-child");

  if (subtotalEl) subtotalEl.innerText = formatMoney(subtotal);
  if (totalEl) totalEl.innerText = formatMoney(subtotal);
}

// Chức năng Chọn tất cả
function initSelectAll() {
  const selectAllBtn = document.querySelector(".select-all");
  if (selectAllBtn) {
    selectAllBtn.style.cursor = "pointer";
    selectAllBtn.addEventListener("click", () => {
      const cart = getCart();
      const icon = selectAllBtn.querySelector("i");
      const isAllChecked = icon.classList.contains("fa-circle-check");

      cart.forEach((item) => {
        item.checked = !isAllChecked;
      });

      saveCart(cart);
      renderCart();
    });
  }
}

// Cập nhật trạng thái nút "Chọn tất cả"
function updateSelectAllState() {
  const selectAllIcon = document.querySelector(".select-all i");
  if (!selectAllIcon) return;

  const cart = getCart();
  if (cart.length === 0) {
    selectAllIcon.classList.remove("fa-circle-check");
    selectAllIcon.classList.add("fa-circle");
    return;
  }

  const allChecked = cart.every((item) => item.checked !== false);
  if (allChecked) {
    selectAllIcon.classList.remove("fa-circle");
    selectAllIcon.classList.add("fa-circle-check");
  } else {
    selectAllIcon.classList.remove("fa-circle-check");
    selectAllIcon.classList.add("fa-circle");
  }
}

// Tìm kiếm trong giỏ hàng
const searchInput = document.getElementById("searchInput");
if (searchInput) {
  searchInput.addEventListener("input", () => {
    const keyword = searchInput.value.toLowerCase();
    document.querySelectorAll(".cart-item").forEach((item) => {
      const name = item.querySelector("h3").innerText.toLowerCase();
      item.style.display = name.includes(keyword) ? "grid" : "none";
    });
  });
}

// Chuyển sang trang Thanh toán
window.goToCheckout = function () {
  const cart = getCart();
  const hasCheckedItem = cart.some((item) => item.checked !== false);

  if (!hasCheckedItem) {
    alert("Vui lòng tích chọn ít nhất một sản phẩm để thanh toán!");
    return;
  }

  window.location.href = "checkout.html";
};

// Nút Tiếp tục mua sắm
document.querySelector(".continue-btn")?.addEventListener("click", () => {
  window.location.href = "products.html";
});

// Nút Cập nhật giỏ hàng
document.querySelector(".update-btn")?.addEventListener("click", () => {
  renderCart();
  alert("Giỏ hàng đã được cập nhật!");
});

// Khởi chạy khi tải trang
document.addEventListener("DOMContentLoaded", () => {
  renderCart();
  initSelectAll();
});
