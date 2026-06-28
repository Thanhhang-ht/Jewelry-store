// ==========================================
// CATEGORY MANAGEMENT
// FRONTEND
// ==========================================

// ==============================
// DOM
// ==============================

const checkAll = document.getElementById("checkAll");

const checkboxes = document.querySelectorAll(".category-checkbox");

const searchInput = document.getElementById("searchCategory");

const tableBody = document.getElementById("categoryTableBody");

const deleteButtons = document.querySelectorAll(".delete-btn");

const pageButtons = document.querySelectorAll(".page-btn");

const pageSize = document.getElementById("pageSize");

const filterBtn = document.querySelector(".filter-btn");

// ==============================
// CHECK ALL
// ==============================

if (checkAll) {
  checkAll.addEventListener("change", function () {
    checkboxes.forEach((item) => {
      item.checked = this.checked;
    });
  });
}

// ==============================
// UPDATE CHECK ALL
// ==============================

checkboxes.forEach((item) => {
  item.addEventListener("change", () => {
    const total = checkboxes.length;

    const checked = document.querySelectorAll(
      ".category-checkbox:checked"
    ).length;

    checkAll.checked = total === checked;
  });
});

// ==============================
// SEARCH
// ==============================

searchInput.addEventListener("keyup", function () {
  const keyword = this.value.toLowerCase();

  const rows = tableBody.querySelectorAll("tr");

  rows.forEach((row) => {
    const text = row.innerText.toLowerCase();

    row.style.display = text.includes(keyword) ? "" : "none";
  });
});

// ==============================
// DELETE
// ==============================

deleteButtons.forEach((button) => {
  button.addEventListener("click", function () {
    const row = this.closest("tr");

    const categoryName = row.querySelector(".category-info h4").innerText;

    const ok = confirm(`Bạn có chắc muốn xóa danh mục "${categoryName}" ?`);

    if (!ok) return;

    row.remove();

    alert("Đã xóa thành công!");
  });
});

// ==============================
// FILTER (DEMO)
// ==============================

filterBtn.addEventListener("click", function () {
  alert("Bộ lọc sẽ được phát triển khi kết nối Backend.");
});

// ==============================
// PAGINATION DEMO
// ==============================

pageButtons.forEach((btn) => {
  btn.addEventListener("click", function () {
    pageButtons.forEach((item) => {
      item.classList.remove("active");
    });

    if (!this.querySelector("i")) {
      this.classList.add("active");
    }
  });
});

// ==============================
// PAGE SIZE
// ==============================

pageSize.addEventListener("change", function () {
  console.log(
    "Hiển thị:",

    this.value,

    "dòng"
  );
});

// ==============================
// TABLE HOVER
// ==============================

const rows = tableBody.querySelectorAll("tr");

rows.forEach((row) => {
  row.addEventListener("mouseenter", () => {
    row.style.transition = ".2s";
  });
});

// ==============================
// ESC CLEAR SEARCH
// ==============================

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    searchInput.value = "";

    searchInput.dispatchEvent(new Event("keyup"));
  }
});

// ==============================
// READY
// ==============================

document.addEventListener("DOMContentLoaded", () => {
  console.log("Category Management Ready");
});
