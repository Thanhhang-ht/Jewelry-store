// =========================================
// DYNAMIC CART PROCESSING
// =========================================

// Format money
function formatMoney(value) {
  return value.toLocaleString("vi-VN") + "đ";
}

// Load cart and products, and render dynamic cart list
function renderCart() {
  const container = document.getElementById("cartItems");
  if (!container) return;

  const cart = DB.getCart();
  const products = DB.getProducts();

  if (cart.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px 20px; font-size: 1.2rem; color: #666;">
        Giỏ hàng của bạn đang trống.<br><br>
        <a href="products.html" style="color: #d4af37; text-decoration: underline; font-weight: bold;">
          Mua sắm ngay
        </a>
      </div>
    `;
    updateOrderInfo();
    return;
  }

  container.innerHTML = cart
    .map((item) => {
      const p = products.find((prod) => prod.id === item.productId);
      if (!p) return ""; // Phòng hờ sản phẩm bị xóa khỏi db

      const itemTotal = p.price * item.quantity;
      const isChecked = item.checked !== false; // Mặc định true nếu chưa định nghĩa

      return `
      <div class="cart-item" data-id="${p.id}">
        <div class="check" onclick="toggleItemCheck(${p.id})">
          <i class="fa-regular ${isChecked ? 'fa-circle-check' : 'fa-circle'}"></i>
        </div>

        <div class="product" onclick="window.location.href='product-detail.html?id=${p.id}'" style="cursor: pointer;">
          <img src="${p.image}">
          <div class="info">
            <h3>${p.name}</h3>
            <p>Chất liệu: ${p.material || "Bạc 925"}</p>
            <p>Mã: ${p.code}</p>
          </div>
        </div>

        <div class="price">${formatMoney(p.price)}</div>

        <div class="quantity">
          <button onclick="changeQty(${p.id}, -1)">-</button>
          <span>${item.quantity}</span>
          <button onclick="changeQty(${p.id}, 1)">+</button>
        </div>

        <div class="total">${formatMoney(itemTotal)}</div>

        <div class="delete" onclick="deleteCartItem(${p.id})">
          <i class="fa-regular fa-trash-can"></i>
        </div>
      </div>
    `;
    })
    .join("");

  updateOrderInfo();
  updateSelectAllState();
}

// Check/Uncheck item
window.toggleItemCheck = function (productId) {
  const cart = DB.getCart();
  const item = cart.find((i) => i.productId === productId);
  if (item) {
    item.checked = !item.checked;
    DB.saveCart(cart);
    renderCart();
  }
};

// Change Quantity (+1 or -1)
window.changeQty = function (productId, delta) {
  const cart = DB.getCart();
  const products = DB.getProducts();
  const item = cart.find((i) => i.productId === productId);
  const p = products.find((prod) => prod.id === productId);

  if (item && p) {
    const newQty = item.quantity + delta;
    if (newQty < 1) return;
    if (newQty > p.stock) {
      alert(`Sản phẩm này chỉ còn ${p.stock} sản phẩm trong kho!`);
      return;
    }
    item.quantity = newQty;
    DB.saveCart(cart);
    renderCart();
  }
};

// Delete item
window.deleteCartItem = function (productId) {
  if (confirm("Bạn có muốn xóa sản phẩm này khỏi giỏ hàng?")) {
    let cart = DB.getCart();
    cart = cart.filter((i) => i.productId !== productId);
    DB.saveCart(cart);
    renderCart();
  }
};

// Recalculate totals
function updateOrderInfo() {
  const cart = DB.getCart();
  const products = DB.getProducts();
  let subtotal = 0;

  cart.forEach((item) => {
    if (item.checked !== false) {
      const p = products.find((prod) => prod.id === item.productId);
      if (p) {
        subtotal += p.price * item.quantity;
      }
    }
  });

  const subtotalEl = document.querySelector(".order-box .row span:last-child");
  const totalEl = document.querySelector(".total-order span:last-child");

  if (subtotalEl) subtotalEl.innerText = formatMoney(subtotal);
  if (totalEl) totalEl.innerText = formatMoney(subtotal);
}

// Select All functionality
function initSelectAll() {
  const selectAllBtn = document.querySelector(".select-all");
  if (selectAllBtn) {
    selectAllBtn.style.cursor = "pointer";
    selectAllBtn.addEventListener("click", () => {
      const cart = DB.getCart();
      const icon = selectAllBtn.querySelector("i");
      const isAllChecked = icon.classList.contains("fa-circle-check");

      cart.forEach((item) => {
        item.checked = !isAllChecked;
      });

      DB.saveCart(cart);
      renderCart();
    });
  }
}

// Update select-all state based on cart items check status
function updateSelectAllState() {
  const selectAllIcon = document.querySelector(".select-all i");
  if (!selectAllIcon) return;

  const cart = DB.getCart();
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

// Search items within cart
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

// Go to checkout page
window.goToCheckout = function () {
  const cart = DB.getCart();
  const hasCheckedItem = cart.some((item) => item.checked !== false);

  if (!hasCheckedItem) {
    alert("Vui lòng tích chọn ít nhất một sản phẩm để thanh toán!");
    return;
  }

  window.location.href = "../html/checkout.html";
};

// Continue shopping
document.querySelector(".continue-btn")?.addEventListener("click", () => {
  window.location.href = "../html/products.html";
});

// Update cart button
document.querySelector(".update-btn")?.addEventListener("click", () => {
  alert("Giỏ hàng đã được cập nhật!");
});

// Load init
document.addEventListener("DOMContentLoaded", () => {
  renderCart();
  initSelectAll();
});
