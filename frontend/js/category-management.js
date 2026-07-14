const API_URL = "http://localhost:3000/api";

const CategoryManager = {
  categories: [],
  filteredCategories: [],
  searchKeyword: "",
  currentPage: 1,
  pageSize: 10
};

async function loadCategoriesData() {
  try {
    const res = await fetch(`${API_URL}/categories`);
    const result = await res.json();
    if (result.success) {
      // Backend api/categories trả về kèm thuộc tính để ta tính productCount, 
      // Nhưng nếu chưa có, ta cứ đếm số lượng product nếu có array products.
      CategoryManager.categories = result.data.map(cat => ({
        ...cat,
        productCount: cat.products ? cat.products.length : 0 // nếu có include Products
      }));
      applyFilters();
    }
  } catch (err) {
    console.error("Lỗi:", err);
  }
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
          <input type="checkbox" class="category-checkbox" value="${cat.id}">
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
        <td>${cat.productCount || 0}</td>
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

function bindCheckboxEvents() {
  const checkAll = document.getElementById("checkAll");
  const checkboxes = document.querySelectorAll(".category-checkbox");

  if (checkAll) {
    checkAll.checked = false;
    checkAll.onchange = function () {
      checkboxes.forEach((cb) => { cb.checked = this.checked; });
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

window.deleteCategory = async function (id) {
  if (!confirm("Bạn có chắc chắn muốn xóa danh mục này?")) return;

  try {
    const res = await fetch(`${API_URL}/categories/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    });
    const result = await res.json();
    if (result.success) {
      alert("Đã xóa danh mục thành công!");
      loadCategoriesData();
    } else {
      alert("Lỗi: " + result.message);
    }
  } catch (err) {
    console.error("Lỗi:", err);
    alert("Không thể xóa danh mục!");
  }
};

const searchInput = document.getElementById("searchCategory");
if (searchInput) {
  searchInput.addEventListener("input", () => {
    CategoryManager.searchKeyword = searchInput.value.trim();
    applyFilters();
  });
}

const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (confirm("Bạn có muốn đăng xuất không?")) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      window.location.href = "login.html";
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "login.html";
    return;
  }
  
  // Update admin info
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const adminName = document.getElementById("adminName");
  if (adminName && user.fullname) adminName.textContent = user.fullname;

  loadCategoriesData();
});
