const API_URL = "/api/products";
const CATEGORY_API = "/api/categories";

let allProducts = [];
let currentCategory = "all";
let currentPage = 1;
const pageSize = 8;

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
  
  // Đọc tham số category từ URL (ví dụ: products.html?category=Nhẫn)
  const urlParams = new URLSearchParams(window.location.search);
  const paramCategory = urlParams.get("category");
  if (paramCategory) {
    const matchedCat = categories.find(
      (c) => c.name.toLowerCase() === paramCategory.toLowerCase() || c.id == paramCategory
    );
    if (matchedCat) {
      currentCategory = matchedCat.id;
    }
  }

  // Nút Tất cả
  let html = `<button class="${currentCategory === 'all' ? 'active' : ''}" data-id="all">Tất cả</button>`;
  
  categories.forEach(cat => {
    const isActive = currentCategory == cat.id ? "active" : "";
    html += `<button class="${isActive}" data-id="${cat.id}">${cat.name}</button>`;
  });
  
  catList.innerHTML = html;
  
  // Gắn sự kiện click danh mục
  catList.querySelectorAll("button").forEach((btn) => {
    btn.onclick = () => {
      catList.querySelectorAll("button").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentCategory = btn.dataset.id;
      currentPage = 1; // Reset về trang 1 khi đổi danh mục
      filterProducts();
    };
  });
}

async function loadProducts() {
  try {
    const res = await fetch(API_URL);
    const result = await res.json();
    if (result.success) {
      allProducts = result.data.filter(p => p.status !== 'inactive' && p.status !== 'hidden' && p.status !== 'stop');
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
  
  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  if (currentPage > totalPages) currentPage = 1;

  const startIndex = (currentPage - 1) * pageSize;
  const pageItems = filtered.slice(startIndex, startIndex + pageSize);

  renderProducts(pageItems);
  renderPagination(totalPages);
}

const searchInput = document.getElementById("searchInput");
if (searchInput) {
  searchInput.addEventListener("input", () => {
    currentPage = 1; // Reset về trang 1 khi tìm kiếm
    filterProducts();
  });
}

function getProductAvatar(imageField) {
  if (!imageField) return '../image/image 4.png';
  if (Array.isArray(imageField)) return imageField[0] || '../image/image 4.png';
  if (typeof imageField === 'string' && imageField.trim().startsWith('[')) {
    try {
      const arr = JSON.parse(imageField);
      if (Array.isArray(arr) && arr.length > 0) return arr[0];
    } catch(e) {}
  }
  return imageField;
}

if (!window.isProductInWishlist) {
  window.isProductInWishlist = function(productId) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    return wishlist.some(item => item.id == productId);
  };
}

if (!window.toggleWishlist) {
  window.toggleWishlist = function(product) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const index = wishlist.findIndex(item => item.id == product.id);

    if (index !== -1) {
      wishlist.splice(index, 1);
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      alert(`Đã xóa "${product.name}" khỏi danh sách yêu thích.`);
      return false;
    } else {
      const avatar = getProductAvatar(product.image);
      wishlist.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: avatar
      });
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      alert(`💖 Đã thêm "${product.name}" vào danh sách yêu thích!`);
      return true;
    }
  };
}

function renderProducts(list) {
  const container = document.getElementById("productList");
  if (!container) return;

  if (list.length === 0) {
    container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; padding: 40px 20px; font-size: 1.1rem; color: #666;">Không tìm thấy sản phẩm nào.</p>`;
    return;
  }

  container.innerHTML = list
    .map(
      (p) => {
        const avatar = getProductAvatar(p.image);
        const inWishlist = window.isProductInWishlist(p.id);
        const heartClass = inWishlist ? "fa-solid fa-heart love" : "fa-regular fa-heart love";
        const heartColor = inWishlist ? "color: red;" : "color: #000;";
        return `
    <div class="card" data-id="${p.id}">

      <img src="${avatar}" alt="${p.name}">

      <div class="content">
        <h3>${p.name}</h3>
        <p class="price">${Number(p.price).toLocaleString('vi-VN')}đ</p>

        <div class="action">
          <a href="product-detail.html?id=${p.id}" class="detail-btn">
            Xem chi tiết
          </a>

          <i class="${heartClass}" style="${heartColor}" title="Thêm vào yêu thích"></i>
        </div>
      </div>

    </div>
  `;
      }
    )
    .join("");

  bindEvents();
}

function renderPagination(totalPages) {
  const paginationContainer = document.querySelector(".pagination");
  if (!paginationContainer) return;

  if (totalPages <= 1) {
    paginationContainer.style.display = "none";
    return;
  }

  paginationContainer.style.display = "flex";
  
  let html = `<button class="prev-page" ${currentPage === 1 ? "disabled style='opacity:0.4;cursor:not-allowed;'" : ""}>&lt;</button>`;

  for (let i = 1; i <= totalPages; i++) {
    const activeClass = i === currentPage ? "active" : "";
    html += `<button class="page-num ${activeClass}" data-page="${i}">${i}</button>`;
  }

  html += `<button class="next-page" ${currentPage === totalPages ? "disabled style='opacity:0.4;cursor:not-allowed;'" : ""}>&gt;</button>`;

  paginationContainer.innerHTML = html;

  // Gắn sự kiện chuyển trang
  paginationContainer.querySelectorAll(".page-num").forEach((btn) => {
    btn.onclick = () => {
      currentPage = parseInt(btn.dataset.page);
      filterProducts();
      window.scrollTo({ top: 250, behavior: "smooth" });
    };
  });

  const prevBtn = paginationContainer.querySelector(".prev-page");
  if (prevBtn && currentPage > 1) {
    prevBtn.onclick = () => {
      currentPage--;
      filterProducts();
      window.scrollTo({ top: 250, behavior: "smooth" });
    };
  }

  const nextBtn = paginationContainer.querySelector(".next-page");
  if (nextBtn && currentPage < totalPages) {
    nextBtn.onclick = () => {
      currentPage++;
      filterProducts();
      window.scrollTo({ top: 250, behavior: "smooth" });
    };
  }
}

function bindEvents() {
  // LOVE (Yêu thích)
  document.querySelectorAll(".love").forEach((icon) => {
    icon.onclick = (e) => {
      const card = e.currentTarget.closest(".card");
      const id = card ? card.dataset.id : null;
      const product = allProducts.find(p => p.id == id);
      if (!product) return;

      const isAdded = window.toggleWishlist ? window.toggleWishlist(product) : false;
      icon.classList.toggle("fa-regular", !isAdded);
      icon.classList.toggle("fa-solid", isAdded);
      icon.style.color = isAdded ? "red" : "#000";
    };
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initPage();
});
