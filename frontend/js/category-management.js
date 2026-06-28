// ==========================================
// CATEGORY MANAGEMENT LOGIC
// ==========================================

const CategoryManager = {
  categories: [],
  filteredCategories: [],
  searchKeyword: "",
  currentPage: 1,
  pageSize: 10
};

// Format quantity
function formatCount(count) {
  return count + " sản phẩm";
}

// Load categories & count products dynamically
function loadCategoriesData() {
  const categories = DB.getCategories();
  const products = DB.getProducts();

  // Đếm số sản phẩm động cho mỗi danh mục
  CategoryManager.categories = categories.map((cat) => {
    const productCount = products.filter((p) => p.category === cat.name).length;
    return {
      ...cat,
      productCount: productCount
    };
  });

  applyFilters();
}

function applyFilters() {
  const keyword = CategoryManager.searchKeyword.toLowerCase();
  CategoryManager.filteredCategories = CategoryManager.categories.filter((cat) => {
    return (
      cat.name.toLowerCase().includes(keyword) ||
      (cat.description && cat.description.toLowerCase().includes(keyword))
    );
  });

  CategoryManager.currentPage = 1;
  renderCategories();
}

// Render Table Rows
function renderTable() {
  const tbody = document.getElementById("categoryTableBody");
  if (!tbody) return;

  const start = (CategoryManager.currentPage - 1) * CategoryManager.pageSize;
  const end = start + CategoryManager.pageSize;
  const pageCategories = CategoryManager.filteredCategories.slice(start, end);

  if (pageCategories.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="empty-data" style="text-align: center; padding: 20px; color: #888;">
          Không có danh mục nào.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = pageCategories
    .map((cat) => {
      const statusClass = cat.status === "active" ? "active" : "inactive";
      const statusText = cat.status === "active" ? "Hoạt động" : "Khóa";

      return `
      <tr>
        <td>
          <input type="checkbox" class="category-checkbox" data-id="${cat.id}">
        </td>
        <td>
          <div class="category-info" style="display: flex; align-items: center; gap: 10px;">
            <img src="${cat.image || '../image/emojione-monotone_ring.png'}" alt="${cat.name}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 5px;">
            <div>
              <h4 style="margin: 0; font-size: 0.95rem; color: #333;">${cat.name}</h4>
            </div>
          </div>
        </td>
        <td style="max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
          ${cat.description || ""}
        </td>
        <td>${cat.productCount}</td>
        <td>
          <span class="status ${statusClass}" style="padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; font-weight: bold; background: ${cat.status === 'active' ? '#e6f4ea' : '#fce8e6'}; color: ${cat.status === 'active' ? '#137333' : '#c5221f'};">
            ${statusText}
          </span>
        </td>
        <td>
          <div class="action-buttons">
            <a href="category-form.html?mode=edit&id=${cat.id}" class="edit-btn" style="margin-right: 10px; color: #1a73e8;">
              <i class="fa-solid fa-pen"></i>
            </a>
            <button class="delete-btn" onclick="deleteCategory(${cat.id})" style="background: none; border: none; cursor: pointer; color: #d93025;">
              <i class="fa-regular fa-trash-can"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
    })
    .join("");

  bindCheckboxEvents();
}

// Check All & Individual Checkboxes
function bindCheckboxEvents() {
  const checkAll = document.getElementById("checkAll");
  const checkboxes = document.querySelectorAll(".category-checkbox");

  if (checkAll) {
    checkAll.checked = false;
    checkAll.onchange = function () {
      checkboxes.forEach((cb) => {
        cb.checked = this.checked;
      });
    };
  }

  checkboxes.forEach((cb) => {
    cb.onchange = function () {
      const checkedCount = document.querySelectorAll(".category-checkbox:checked").length;
      if (checkAll) {
        checkAll.checked = checkedCount === checkboxes.length;
      }
    };
  });
}

// Pagination Rendering
function renderPagination() {
  const totalPages = Math.ceil(CategoryManager.filteredCategories.length / CategoryManager.pageSize);
  const pagination = document.querySelector(".pagination");
  if (!pagination) return;

  let html = `
    <button class="page-btn" onclick="changePage(${CategoryManager.currentPage - 1})">
      &lt;
    </button>
  `;

  for (let i = 1; i <= totalPages; i++) {
    html += `
      <button class="page-btn ${i === CategoryManager.currentPage ? 'active' : ''}" onclick="changePage(${i})">
        ${i}
      </button>
    `;
  }

  html += `
    <button class="page-btn" onclick="changePage(${CategoryManager.currentPage + 1})">
      &gt;
    </button>
    <select id="pageSize" onchange="changePageSize(this)" style="margin-left: 15px; padding: 4px 8px; border-radius: 4px; border: 1px solid #ccc;">
      <option value="5" ${CategoryManager.pageSize === 5 ? 'selected' : ''}>5/Trang</option>
      <option value="10" ${CategoryManager.pageSize === 10 ? 'selected' : ''}>10/Trang</option>
      <option value="20" ${CategoryManager.pageSize === 20 ? 'selected' : ''}>20/Trang</option>
    </select>
  `;

  pagination.innerHTML = html;
}

window.changePage = function (page) {
  const totalPages = Math.ceil(CategoryManager.filteredCategories.length / CategoryManager.pageSize);
  if (page < 1 || page > totalPages) return;
  CategoryManager.currentPage = page;
  renderCategories();
};

window.changePageSize = function (selectEl) {
  CategoryManager.pageSize = parseInt(selectEl.value);
  CategoryManager.currentPage = 1;
  renderCategories();
};

function renderCategories() {
  renderTable();
  renderPagination();
}

// Delete Category Function
window.deleteCategory = function (id) {
  const cat = CategoryManager.categories.find((c) => c.id === id);
  if (!cat) return;

  // Cảnh báo nếu danh mục này có chứa sản phẩm
  if (cat.productCount > 0) {
    if (!confirm(`Danh mục "${cat.name}" hiện đang có ${cat.productCount} sản phẩm. Xóa danh mục sẽ ảnh hưởng đến hiển thị sản phẩm. Bạn vẫn muốn tiếp tục xóa?`)) {
      return;
    }
  } else {
    if (!confirm(`Bạn có chắc chắn muốn xóa danh mục "${cat.name}"?`)) {
      return;
    }
  }

  let categories = DB.getCategories();
  categories = categories.filter((c) => c.id !== id);
  DB.saveCategories(categories);

  alert("Đã xóa danh mục thành công!");
  loadCategoriesData();
};

// Search bind
const searchInput = document.getElementById("searchCategory");
if (searchInput) {
  searchInput.addEventListener("input", () => {
    CategoryManager.searchKeyword = searchInput.value.trim();
    applyFilters();
  });
}

// Logout Admin
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (confirm("Bạn có muốn đăng xuất không?")) {
      localStorage.removeItem("user");
      window.location.href = "login.html";
    }
  });
}

// Initialize on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  loadCategoriesData();
});
