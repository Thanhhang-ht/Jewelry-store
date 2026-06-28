// ==========================================
// PRODUCT MANAGEMENT
// Jewelry Store Admin
// ==========================================

// ==========================================
// CONFIG
// ==========================================

const CONFIG = {
  pageSize: 10,

  currentPage: 1,
};

// ==========================================
// STATE
// ==========================================

const ProductManager = {
  products: [],

  filteredProducts: [],

  selectedCategory: "all",

  searchKeyword: "",

  currentPage: 1,

  pageSize: 10,
};

// ==========================================
// UTILITIES
// ==========================================

// Format tiền

function formatMoney(price) {
  return Number(price).toLocaleString("vi-VN") + "đ";
}

// Format ngày

function formatDate(date) {
  return new Date(date).toLocaleDateString("vi-VN");
}

// ==========================================
// API
// Hiện tại dùng dữ liệu giả
// Sau này chỉ sửa phần này
// ==========================================

const ProductAPI = {
  async getAll() {
    return DB.getProducts();
  },

  async getById(id) {
    return DB.getProducts().find((product) => product.id == id);
  },

  async create(product) {
    const products = DB.getProducts();
    products.unshift(product);
    DB.saveProducts(products);
  },

  async update(id, product) {
    const products = DB.getProducts();
    const index = products.findIndex((p) => p.id == id);
    if (index !== -1) {
      products[index] = { ...products[index], ...product };
      DB.saveProducts(products);
    }
  },

  async remove(id) {
    let products = DB.getProducts();
    products = products.filter((product) => product.id != id);
    DB.saveProducts(products);
  }
};

// ==========================================
// LOAD DATA
// ==========================================

async function loadProducts() {
  const data = await ProductAPI.getAll();

  ProductManager.products = data;

  ProductManager.filteredProducts = [...data];
}
// ==========================================
// RENDER 1 DÒNG SẢN PHẨM
// ==========================================

function renderProductRow(product) {
  const statusClass = product.status === "selling" ? "selling" : "out-stock";

  const statusText = product.status === "selling" ? "Đang bán" : "Hết hàng";

  return `

        <tr>

            <td>

                <input
                    type="checkbox"
                    class="product-checkbox"
                    data-id="${product.id}"
                >

            </td>

            <td>

                <div class="product-info">

                    <img src="${product.image}" alt="${product.name}">

                    <div>

                        <h4>${product.name}</h4>

                        <span>${product.code}</span>

                    </div>

                </div>

            </td>

            <td>${product.category}</td>

            <td>${formatMoney(product.price)}</td>

            <td>${product.stock}</td>

            <td>

                <span class="status ${statusClass}">
                    ${statusText}
                </span>

            </td>

            <td>${formatDate(product.createdAt)}</td>

            <td>

                <div class="action-buttons">

                    <a
                        href="../html/product-form.html?mode=edit&id=${
                          product.id
                        }"
                        class="edit-btn"
                    >
                        <i class="fa-solid fa-pen"></i>
                    </a>

                    <button
                        class="view-btn"
                        data-id="${product.id}"
                    >
                        <i class="fa-regular fa-eye"></i>
                    </button>

                    <button
                        class="delete-btn"
                        data-id="${product.id}"
                    >
                        <i class="fa-regular fa-trash-can"></i>
                    </button>

                </div>

            </td>

        </tr>

    `;
}

// ==========================================
// RENDER TABLE
// ==========================================

function renderTable() {
  const tbody = document.getElementById("productTableBody");

  if (!tbody) return;

  const start = (ProductManager.currentPage - 1) * ProductManager.pageSize;

  const end = start + ProductManager.pageSize;

  const pageProducts = ProductManager.filteredProducts.slice(start, end);

  if (pageProducts.length === 0) {
    tbody.innerHTML = `

            <tr>

                <td colspan="8" class="empty-data">

                    Không có sản phẩm.

                </td>

            </tr>

        `;

    return;
  }

  tbody.innerHTML = pageProducts.map(renderProductRow).join("");
}

// ==========================================
// RENDER PHÂN TRANG
// ==========================================

function renderPagination() {
  const totalPages = Math.ceil(
    ProductManager.filteredProducts.length / ProductManager.pageSize
  );

  const pageButtons = document.querySelectorAll(".page-btn");

  pageButtons.forEach((button) => {
    const value = Number(button.textContent);

    if (!isNaN(value)) {
      button.classList.toggle(
        "active",

        value === ProductManager.currentPage
      );
    }
  });

  console.log(`Page ${ProductManager.currentPage}/${totalPages}`);
}

// ==========================================
// RENDER TOÀN BỘ
// ==========================================

function renderProducts() {
  renderTable();

  renderPagination();
}
// ==========================================
// TÌM KIẾM
// ==========================================

function searchProducts() {
  const keyword = document
    .getElementById("searchInput")
    .value.trim()
    .toLowerCase();

  ProductManager.searchKeyword = keyword;

  applyFilters();
}

// ==========================================
// LỌC DANH MỤC
// ==========================================

function filterCategory() {
  const category = document.getElementById("categoryFilter").value;

  ProductManager.selectedCategory = category;

  applyFilters();
}

// ==========================================
// ÁP DỤNG FILTER
// ==========================================

function applyFilters() {
  ProductManager.filteredProducts = ProductManager.products.filter(
    (product) => {
      const matchCategory =
        ProductManager.selectedCategory === "all" ||
        product.category === ProductManager.selectedCategory;

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

// ==========================================
// CHECK ALL
// ==========================================

function checkAllProducts() {
  const checked = document.getElementById("checkAll").checked;

  document.querySelectorAll(".product-checkbox").forEach((item) => {
    item.checked = checked;
  });
}

// ==========================================
// XEM CHI TIẾT
// ==========================================

async function viewProduct(id) {
  const product = await ProductAPI.getById(id);

  if (!product) return;

  // Sau này có thể mở Modal

  alert(
    `Mã: ${product.code}

Tên: ${product.name}

Danh mục: ${product.category}

Giá: ${formatMoney(product.price)}

Tồn kho: ${product.stock}`
  );
}

// ==========================================
// XÓA SẢN PHẨM
// ==========================================

async function deleteProduct(id) {
  const confirmDelete = confirm("Bạn có chắc muốn xóa sản phẩm này?");

  if (!confirmDelete) return;

  await ProductAPI.remove(id);

  ProductManager.products = ProductManager.products.filter(
    (product) => product.id != id
  );

  applyFilters();
}

// ==========================================
// EVENT VIEW / DELETE
// ==========================================

document.addEventListener("click", async function (event) {
  const viewBtn = event.target.closest(".view-btn");

  if (viewBtn) {
    const id = viewBtn.dataset.id;

    await viewProduct(id);
  }

  const deleteBtn = event.target.closest(".delete-btn");

  if (deleteBtn) {
    const id = deleteBtn.dataset.id;

    await deleteProduct(id);
  }
});
// ==========================================
// PAGINATION
// ==========================================

function changePage(page) {
  const totalPages = Math.ceil(
    ProductManager.filteredProducts.length / ProductManager.pageSize
  );

  if (page < 1 || page > totalPages) return;

  ProductManager.currentPage = page;

  renderProducts();
}

// ==========================================
// PAGE SIZE
// ==========================================

function changePageSize() {
  ProductManager.pageSize = Number(document.getElementById("pageSize").value);

  ProductManager.currentPage = 1;

  renderProducts();
}

// ==========================================
// BIND EVENTS
// ==========================================

function bindEvents() {
  // Search

  document

    .getElementById("searchBtn")

    .addEventListener("click", searchProducts);

  document

    .getElementById("searchInput")

    .addEventListener("keyup", function (e) {
      if (e.key === "Enter") {
        searchProducts();
      }
    });

  // Category

  document

    .getElementById("categoryFilter")

    .addEventListener("change", filterCategory);

  // Check All

  document

    .getElementById("checkAll")

    .addEventListener("change", checkAllProducts);

  // Page Size

  document

    .getElementById("pageSize")

    .addEventListener("change", changePageSize);

  // Pagination

  document

    .querySelectorAll(".page-btn")

    .forEach((button) => {
      button.addEventListener("click", function () {
        const value = this.textContent.trim();

        if (value === "") return;

        if (value === "<") {
          changePage(ProductManager.currentPage - 1);

          return;
        }

        if (value === ">") {
          changePage(ProductManager.currentPage + 1);

          return;
        }

        const page = Number(value);

        if (!isNaN(page)) {
          changePage(page);
        }
      });
    });
}

// ==========================================
// LOGOUT
// ==========================================

function logout() {
  if (confirm("Bạn có chắc muốn đăng xuất?")) {
    localStorage.removeItem("user");

    window.location.href = "login.html";
  }
}

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", function (e) {
    e.preventDefault();

    logout();
  });
}

// ==========================================
// INIT
// ==========================================

async function init() {
  await loadProducts();

  renderProducts();

  bindEvents();

  console.log("Product Management Loaded");
}

// ==========================================
// START
// ==========================================

document.addEventListener(
  "DOMContentLoaded",

  init
);

// ==========================================
// TODO BACKEND
// ==========================================

/*

Sau này chỉ cần sửa ProductAPI

async getAll(){

    const response = await fetch(

        "http://localhost:8080/api/products"

    );

    return await response.json();

}

async create(product){

    return fetch(...)

}

async update(id,product){

    return fetch(...)

}

async remove(id){

    return fetch(...)

}

Các hàm dưới KHÔNG PHẢI SỬA

✔ renderTable()

✔ renderProducts()

✔ searchProducts()

✔ filterCategory()

✔ pagination()

✔ events()

*/
