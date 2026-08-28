// =========================
// DỮ LIỆU YÊU THÍCH TỪ LOCALSTORAGE
// =========================

let wishlistProducts = JSON.parse(localStorage.getItem("wishlist")) || [];

// CẤU HÌNH PHÂN TRANG
const productsPerPage = 4;
let currentPage = 1;

// FORMAT GIÁ
function formatPrice(price) {
  return Number(price).toLocaleString("vi-VN") + "đ";
}

// CẬP NHẬT SỐ LƯỢNG YÊU THÍCH
function updateWishlistCount() {
  const count = document.getElementById("wishlistCount");
  if (!count) return;
  count.textContent = wishlistProducts.length;
}

// HIỂN THỊ SẢN PHẨM YÊU THÍCH
function renderProducts() {
  const container = document.getElementById("wishlistProducts");
  if (!container) return;

  const start = (currentPage - 1) * productsPerPage;
  const end = start + productsPerPage;
  const pageProducts = wishlistProducts.slice(start, end);

  let html = "";

  pageProducts.forEach((product) => {
    html += `
          <div class="product-card" data-id="${product.id}">
              <button
                  class="remove-btn"
                  data-id="${product.id}"
                  type="button">
                  <i class="fa-solid fa-xmark"></i>
              </button>

              <img
                  src="${product.image || '../image/image 24.png'}"
                  alt="${product.name}">

              <h4>${product.name}</h4>

              <p class="price">
                  ${formatPrice(product.price)}
              </p>

              <div class="card-actions">
                  <button
                      class="cart-btn"
                      data-id="${product.id}"
                      type="button">
                      Thêm vào giỏ hàng
                  </button>

                  <button
                      class="heart-btn"
                      data-id="${product.id}"
                      type="button">
                      <i class="fa-solid fa-heart" style="color: red;"></i>
                  </button>
              </div>
          </div>
      `;
  });

  container.innerHTML = html;
  updateWishlistCount();
  renderPagination();
  checkEmptyWishlist();
}

// PHÂN TRANG
function renderPagination() {
  const pagination = document.getElementById("pagination");
  if (!pagination) return;

  const totalPages = Math.ceil(wishlistProducts.length / productsPerPage);
  pagination.innerHTML = "";

  if (totalPages <= 1) return;

  let html = `
      <button
          type="button"
          ${currentPage === 1 ? "disabled" : ""}
          data-page="${currentPage - 1}">
          &lt;
      </button>
  `;

  for (let i = 1; i <= totalPages; i++) {
    html += `
          <button
              type="button"
              class="${i === currentPage ? "active" : ""}"
              data-page="${i}">
              ${i}
          </button>
      `;
  }

  html += `
      <button
          type="button"
          ${currentPage === totalPages ? "disabled" : ""}
          data-page="${currentPage + 1}">
          &gt;
      </button>
  `;

  pagination.innerHTML = html;
}

function changePage(page) {
  const totalPages = Math.ceil(wishlistProducts.length / productsPerPage);
  if (page < 1 || page > totalPages) return;
  currentPage = page;
  renderProducts();
}

// XÓA SẢN PHẨM KHỎI YÊU THÍCH
function removeProduct(productId) {
  if (!confirm("Bạn muốn xóa sản phẩm khỏi danh sách yêu thích?")) return;

  wishlistProducts = wishlistProducts.filter(
    (product) => product.id != productId
  );
  localStorage.setItem("wishlist", JSON.stringify(wishlistProducts));

  const totalPages = Math.ceil(wishlistProducts.length / productsPerPage);
  if (currentPage > totalPages && totalPages > 0) {
    currentPage = totalPages;
  }
  if (wishlistProducts.length === 0) {
    currentPage = 1;
  }

  renderProducts();
}

// XÓA TOÀN BỘ DANH SÁCH YÊU THÍCH
function clearWishlist() {
  if (wishlistProducts.length === 0) return;
  if (!confirm("Bạn muốn xóa toàn bộ danh sách yêu thích?")) return;

  wishlistProducts = [];
  localStorage.setItem("wishlist", JSON.stringify([]));
  currentPage = 1;
  renderProducts();
}

// THÊM VÀO GIỎ HÀNG THỰC TẾ
function addToCart(productId) {
  const product = wishlistProducts.find((item) => item.id == productId);
  if (!product) return;

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existingItem = cart.find((item) => item.id == productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert(`🎉 Đã thêm "${product.name}" vào giỏ hàng!`);
}

// KIỂM TRA DANH SÁCH RỖNG
function checkEmptyWishlist() {
  const emptyBox = document.getElementById("emptyWishlist");
  const productGrid = document.getElementById("wishlistProducts");
  const pagination = document.getElementById("pagination");

  if (!emptyBox || !productGrid) return;

  if (wishlistProducts.length === 0) {
    emptyBox.style.display = "block";
    productGrid.style.display = "none";
    if (pagination) pagination.style.display = "none";
  } else {
    emptyBox.style.display = "none";
    productGrid.style.display = "grid";
    if (pagination) pagination.style.display = "flex";
  }
}

// LOAD TRANG
document.addEventListener("DOMContentLoaded", () => {
  wishlistProducts = JSON.parse(localStorage.getItem("wishlist")) || [];

  // Đăng xuất
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (confirm("Bạn có muốn đăng xuất không?")) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "login.html";
      }
    });
  }

  // Mua sắm ngay
  const shopNowBtn = document.getElementById("shopNowBtn");
  if (shopNowBtn) {
    shopNowBtn.addEventListener("click", () => {
      window.location.href = "products.html";
    });
  }

  // Xóa tất cả
  const clearWishlistBtn = document.getElementById("clearWishlistBtn");
  if (clearWishlistBtn) {
    clearWishlistBtn.addEventListener("click", clearWishlist);
  }

  // Event Delegation
  document.addEventListener("click", (e) => {
    // Xóa sản phẩm
    const removeBtn = e.target.closest(".remove-btn, .heart-btn");
    if (removeBtn) {
      removeProduct(Number(removeBtn.dataset.id));
      return;
    }

    // Thêm vào giỏ hàng
    const cartBtn = e.target.closest(".cart-btn");
    if (cartBtn) {
      addToCart(Number(cartBtn.dataset.id));
      return;
    }

    // Phân trang
    const pageBtn = e.target.closest("#pagination button");
    if (pageBtn) {
      changePage(Number(pageBtn.dataset.page));
    }
  });

  renderProducts();
});
