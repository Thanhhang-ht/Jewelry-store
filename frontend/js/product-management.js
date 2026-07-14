// ==========================================
// PRODUCT MANAGEMENT
// Jewelry Store Admin
// ==========================================
const API_URL = "http://localhost:3000/api";

const ProductManager = {
  products: [],
  filteredProducts: [],
  categories: [],
  selectedCategory: "all",
  searchKeyword: "",
  currentPage: 1,
  pageSize: 10,
};

function formatMoney(price) {
  return Number(price).toLocaleString("vi-VN") + "đ";
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("vi-VN");
}

const ProductAPI = {
  async getAll() {
    const res = await fetch(`${API_URL}/products`);
    const result = await res.json();
    return result.success ? result.data : [];
  },

  async getById(id) {
    const res = await fetch(`${API_URL}/products/${id}`);
    const result = await res.json();
    return result.success ? result.data : null;
  },

  async remove(id) {
    const res = await fetch(`${API_URL}/products/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    });
    return await res.json();
  }
};

const CategoryAPI = {
  async getAll() {
    const res = await fetch(`${API_URL}/categories`);
    const result = await res.json();
    return result.success ? result.data : [];
  }
};

async function loadData() {
  const [productsData, categoriesData] = await Promise.all([
    ProductAPI.getAll(),
    CategoryAPI.getAll()
  ]);

  ProductManager.products = productsData;
  ProductManager.filteredProducts = [...productsData];
  ProductManager.categories = categoriesData;

  const categoryFilter = document.getElementById("categoryFilter");
  if (categoryFilter) {
    categoryFilter.innerHTML = `<option value="all">Tất cả danh mục</option>`;
    categoriesData.forEach(cat => {
      categoryFilter.innerHTML += `<option value="${cat.id}">${cat.name}</option>`;
    });
  }
}

function renderProductRow(product) {
  const statusClass = product.status === "selling" ? "selling" : "out-stock";
  const statusText = product.status === "selling" ? "Đang bán" : "Hết hàng";
  const catName = product.category ? product.category.name : "Không rõ";
  const image = product.image || '../image/image 4.png';

  return `
        <tr>
            <td><input type="checkbox" class="product-checkbox" data-id="${product.id}"></td>
            <td>
                <div class="product-info">
                    <img src="${image}" alt="${product.name}" style="width:40px;height:40px;object-fit:cover;border-radius:4px;">
                    <div>
                        <h4>${product.name}</h4>
                        <span>${product.code}</span>
                    </div>
                </div>
            </td>
            <td>${catName}</td>
            <td>${formatMoney(product.price)}</td>
            <td>${product.stock}</td>
            <td>
                <span class="status ${statusClass}">
                    ${statusText}
                </span>
            </td>
            <td>${formatDate(product.created_at)}</td>
            <td>
                <div class="action-buttons">
                    <a href="product-form.html?mode=edit&id=${product.id}" class="edit-btn">
                        <i class="fa-solid fa-pen"></i>
                    </a>
                    <button class="delete-btn" data-id="${product.id}">
                        <i class="fa-regular fa-trash-can"></i>
                    </button>
                </div>
            </td>
        </tr>
    `;
}

function renderTable() {
  const tbody = document.getElementById("productTableBody");
  if (!tbody) return;

  const start = (ProductManager.currentPage - 1) * ProductManager.pageSize;
  const end = start + ProductManager.pageSize;
  const pageProducts = ProductManager.filteredProducts.slice(start, end);

  if (pageProducts.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" class="empty-data" style="text-align:center;">Không có sản phẩm.</td></tr>`;
    return;
  }
  tbody.innerHTML = pageProducts.map(renderProductRow).join("");
}

function renderPagination() {
  const totalPages = Math.ceil(ProductManager.filteredProducts.length / ProductManager.pageSize);
  const pagination = document.querySelector(".pagination");
  if (!pagination) return;

  let html = `
    <button class="page-btn" onclick="changePage(${ProductManager.currentPage - 1})">
      &lt;
    </button>
  `;

  for (let i = 1; i <= totalPages; i++) {
    html += `
      <button class="page-btn ${i === ProductManager.currentPage ? 'active' : ''}" onclick="changePage(${i})">
        ${i}
      </button>
    `;
  }

  html += `
    <button class="page-btn" onclick="changePage(${ProductManager.currentPage + 1})">
      &gt;
    </button>
    <select id="pageSize" onchange="changePageSize(this)" style="margin-left: 15px; padding: 4px 8px; border-radius: 4px; border: 1px solid #ccc;">
      <option value="5" ${ProductManager.pageSize === 5 ? 'selected' : ''}>5/Trang</option>
      <option value="10" ${ProductManager.pageSize === 10 ? 'selected' : ''}>10/Trang</option>
      <option value="20" ${ProductManager.pageSize === 20 ? 'selected' : ''}>20/Trang</option>
    </select>
  `;

  pagination.innerHTML = html;
}

window.changePage = function (page) {
  const totalPages = Math.ceil(ProductManager.filteredProducts.length / ProductManager.pageSize);
  if (page < 1 || page > totalPages) return;
  ProductManager.currentPage = page;
  renderProducts();
};

window.changePageSize = function (selectEl) {
  ProductManager.pageSize = parseInt(selectEl.value);
  ProductManager.currentPage = 1;
  renderProducts();
};

function renderProducts() {
  renderTable();
  renderPagination();
}

function searchProducts() {
  ProductManager.searchKeyword = document.getElementById("searchInput").value.trim().toLowerCase();
  applyFilters();
}

function filterCategory() {
  ProductManager.selectedCategory = document.getElementById("categoryFilter").value;
  applyFilters();
}

function applyFilters() {
  ProductManager.filteredProducts = ProductManager.products.filter(
    (product) => {
      const matchCategory =
        ProductManager.selectedCategory === "all" ||
        product.category_id == ProductManager.selectedCategory;
      const keyword = ProductManager.searchKeyword;
      const matchKeyword =
        product.name.toLowerCase().includes(keyword) ||
        product.code.toLowerCase().includes(keyword);
      return matchCategory && matchKeyword;
    }
  );
  ProductManager.currentPage = 1;
  renderProducts();
}

function checkAllProducts() {
  const checked = document.getElementById("checkAll").checked;
  document.querySelectorAll(".product-checkbox").forEach((item) => {
    item.checked = checked;
  });
}

async function deleteProduct(id) {
  if (!confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
  const result = await ProductAPI.remove(id);
  if (result.success) {
    alert("Xóa thành công!");
    ProductManager.products = ProductManager.products.filter(p => p.id != id);
    applyFilters();
  } else {
    alert("Lỗi: " + result.message);
  }
}

function bindEvents() {
  document.getElementById("searchBtn")?.addEventListener("click", searchProducts);
  document.getElementById("searchInput")?.addEventListener("keyup", function (e) {
      if (e.key === "Enter") searchProducts();
  });
  document.getElementById("categoryFilter")?.addEventListener("change", filterCategory);
  document.getElementById("checkAll")?.addEventListener("change", checkAllProducts);
  
  document.addEventListener("click", async function (event) {
    const deleteBtn = event.target.closest(".delete-btn");
    if (deleteBtn) {
      const id = deleteBtn.dataset.id;
      await deleteProduct(id);
    }
  });
}

const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", function (e) {
    e.preventDefault();
    if (confirm("Bạn có chắc muốn đăng xuất?")) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      window.location.href = "login.html";
    }
  });
}

async function init() {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "login.html";
    return;
  }
  
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const adminName = document.getElementById("adminName");
  if (adminName && user.fullname) adminName.textContent = user.fullname;

  await loadData();
  renderProducts();
  bindEvents();
}

document.addEventListener("DOMContentLoaded", init);
