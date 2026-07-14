const API_URL = "http://localhost:3000/api/products";
const CATEGORY_API = "http://localhost:3000/api/categories";

let allProducts = [];
let currentCategory = "all";

async function initPage() {
  await loadCategories();
  await loadProducts();
}

async function loadCategories() {
  try {
    const res = await fetch(CATEGORY_API);
    const result = await res.json();
    if (result.success) {
      renderCategories(result.data);
    }
  } catch (err) {
    console.error("Lỗi tải danh mục:", err);
  }
}

function renderCategories(categories) {
  const catList = document.querySelector(".category-list");
  if (!catList) return;
  
  // Nút Tất cả
  let html = `<button class="active" data-id="all">Tất cả</button>`;
  
  categories.forEach(cat => {
    html += `<button data-id="${cat.id}">${cat.name}</button>`;
  });
  
  catList.innerHTML = html;
  
  // Gắn sự kiện click
  catList.querySelectorAll("button").forEach((btn) => {
    btn.onclick = () => {
      catList.querySelectorAll("button").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentCategory = btn.dataset.id;
      filterProducts();
    };
  });
}

async function loadProducts() {
  try {
    const res = await fetch(API_URL);
    const result = await res.json();
    if (result.success) {
      allProducts = result.data.filter(p => p.status !== 'hidden');
      filterProducts();
    }
  } catch (err) {
    console.error("Lỗi tải sản phẩm:", err);
  }
}

function filterProducts() {
  const searchInput = document.getElementById("searchInput");
  const keyword = searchInput ? searchInput.value.toLowerCase() : "";
  
  let filtered = allProducts.filter(p => {
    const matchCategory = currentCategory === "all" || p.category_id == currentCategory;
    const matchSearch = p.name.toLowerCase().includes(keyword);
    return matchCategory && matchSearch;
  });
  
  renderProducts(filtered);
}

const searchInput = document.getElementById("searchInput");
if (searchInput) {
  searchInput.addEventListener("input", filterProducts);
}

function renderProducts(list) {
  const container = document.getElementById("productList");
  if (!container) return;

  if (list.length === 0) {
    container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; padding: 20px;">Không tìm thấy sản phẩm nào.</p>`;
    return;
  }

  container.innerHTML = list
    .map(
      (p) => `
    <div class="card" data-id="${p.id}">

      <img src="${p.image || '../image/image 24.png'}" alt="${p.name}">

      <div class="content">
        <h3>${p.name}</h3>
        <p class="price">${Number(p.price).toLocaleString('vi-VN')}đ</p>

        <div class="action">
          <a href="product-detail.html?id=${p.id}" class="detail-btn">
            Xem chi tiết
          </a>

          <i class="fa-regular fa-heart love"></i>
        </div>
        
        <button class="cart-btn" data-id="${p.id}" style="width: 100%; margin-top: 10px; background: #333; color: white; border: none; padding: 8px; border-radius: 4px; cursor: pointer;">
          Thêm vào giỏ
        </button>
      </div>

    </div>
  `
    )
    .join("");

  bindEvents();
}

function bindEvents() {
  // LOVE
  document.querySelectorAll(".love").forEach((icon) => {
    icon.onclick = () => {
      icon.classList.toggle("fa-regular");
      icon.classList.toggle("fa-solid");
      icon.style.color = icon.classList.contains("fa-solid") ? "red" : "#000";
    };
  });

  // CART
  document.querySelectorAll(".cart-btn").forEach((btn) => {
    btn.onclick = () => {
      const id = btn.dataset.id;
      addToCart(id);
    };
  });
}

function addToCart(productId) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  const product = allProducts.find(p => p.id == productId);
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

document.addEventListener("DOMContentLoaded", () => {
  initPage();
});
