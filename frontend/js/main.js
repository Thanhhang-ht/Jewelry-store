const API_URL = "http://localhost:3000/api";

let products = [];

async function loadLatestProducts() {
  try {
    const res = await fetch(`${API_URL}/products`);
    const result = await res.json();
    if (result.success) {
      // Chỉ lấy 4 sản phẩm mới nhất để hiển thị ở trang chủ
      products = result.data.slice(0, 4);
      renderProducts(products);
    }
  } catch (err) {
    console.error("Không thể tải sản phẩm:", err);
  }
}

function renderProducts(list) {
  const container = document.getElementById("productList");
  if (!container) return;

  container.innerHTML = list
    .map(
      (p) => `
    <div class="pro-item" data-id="${p.id}">

      <div class="pro-img">
        <img src="${p.image || '../image/image 24.png'}" alt="${p.name}">
        <i class="fa-regular fa-heart love"></i>
      </div>

      <div class="pro-info">
        <h4>${p.name}</h4>
        <p>${Number(p.price).toLocaleString('vi-VN')}đ</p>
      </div>

      <div class="pro-btn">
        <button class="detail-btn" data-id="${p.id}">
          Xem chi tiết
        </button>

        <button class="cart-btn" data-id="${p.id}">
          <i class="fa-solid fa-cart-plus"></i>
        </button>
      </div>

    </div>
  `
    )
    .join("");

  bindEvents();
}

function bindEvents() {
  // ADD TO CART
  document.querySelectorAll(".cart-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = e.currentTarget.dataset.id;
      addToCart(id);
    });
  });

  // LOVE / FAVORITE
  document.querySelectorAll(".love").forEach((icon) => {
    icon.addEventListener("click", () => {
      icon.classList.toggle("fa-regular");
      icon.classList.toggle("fa-solid");
      icon.style.color = icon.classList.contains("fa-solid") ? "red" : "black";
    });
  });

  // DETAIL BUTTON
  document.querySelectorAll(".detail-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = e.currentTarget.dataset.id;
      goToDetail(id);
    });
  });
}

function addToCart(productId) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  const product = products.find(p => p.id == productId);
  if (!product) return;
  
  const existingItem = cart.find(item => item.id == productId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
  alert(`Đã thêm "${product.name}" vào giỏ hàng!`);
}

function goToDetail(id) {
  window.location.href = `product-detail.html?id=${id}`;
}

async function chatAI() {
  const msg = document.getElementById("msg").value;
  if (!msg.trim()) {
    alert("Vui lòng nhập nội dung");
    return;
  }
  alert("Tính năng AI hiện đang được bảo trì!");
}

window.onload = () => {
  loadLatestProducts();
};
