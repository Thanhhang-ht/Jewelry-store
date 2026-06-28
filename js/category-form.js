// ==========================================
// CATEGORY FORM
// FRONTEND
// ==========================================

// ==============================
// URL MODE
// ==============================

const params = new URLSearchParams(window.location.search);

const mode = params.get("mode") || "add";

// ==============================
// DOM
// ==============================

const formTitle = document.getElementById("formTitle");

const categoryForm = document.getElementById("categoryForm");

const categoryName = document.getElementById("categoryName");

const description = document.getElementById("description");

const imageInput = document.getElementById("categoryImage");

const previewImg = document.getElementById("previewImg");

const uploadBox = document.getElementById("uploadBox");

const deleteBtn = document.getElementById("deleteBtn");

// ==============================
// INIT
// ==============================

document.addEventListener("DOMContentLoaded", () => {
  initPage();
});

// ==============================
// INIT PAGE
// ==============================

function initPage() {
  if (mode === "add") {
    document.title = "Thêm danh mục";

    formTitle.textContent = "Thêm danh mục";

    deleteBtn.style.display = "none";
  } else if (mode === "edit") {
    document.title = "Sửa danh mục";

    formTitle.textContent = "Sửa danh mục";

    loadDemoData();
  }
}
// ==============================
// IMAGE PREVIEW
// ==============================

imageInput.addEventListener("change", function () {
  const file = this.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = function (e) {
    previewImg.src = e.target.result;

    previewImg.style.display = "block";

    uploadBox.style.display = "none";
  };

  reader.readAsDataURL(file);
});
// ==============================
// VALIDATE
// ==============================

function validateForm() {
  if (categoryName.value.trim() === "") {
    alert("Vui lòng nhập tên danh mục!");

    categoryName.focus();

    return false;
  }

  return true;
}
// ==============================
// SUBMIT
// ==============================

categoryForm.addEventListener("submit", function (e) {
  e.preventDefault();

  if (!validateForm()) return;

  const category = {
    name: categoryName.value,

    description: description.value,

    status: document.querySelector("input[name='status']:checked").value,

    image: imageInput.files[0],
  };

  console.clear();

  console.log(category);

  if (mode === "add") {
    alert("Thêm danh mục thành công!");
  }

  if (mode === "edit") {
    alert("Cập nhật danh mục thành công!");
  }
});
// ==============================
// RESET
// ==============================

document
  .querySelector(".cancel-btn")

  .addEventListener("click", function () {
    if (!confirm("Bạn có muốn xóa toàn bộ dữ liệu?")) return;

    categoryForm.reset();

    previewImg.src = "";

    previewImg.style.display = "none";

    uploadBox.style.display = "flex";
  });
// ==============================
// DELETE
// ==============================

deleteBtn.addEventListener("click", function () {
  if (!confirm("Bạn có chắc muốn xóa danh mục?")) return;

  alert("Đã xóa danh mục (Demo)");

  location.href = "category-management.html";
});
// ==============================
// DEMO DATA
// ==============================

function loadDemoData() {
  categoryName.value = "Nhẫn";

  description.value = "Danh mục các sản phẩm nhẫn vàng, bạc và kim cương.";
}
// ==============================
// ESC CLEAR
// ==============================

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    categoryForm.reset();
  }
});
// ==============================
// ESC CLEAR
// ==============================

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    categoryForm.reset();
  }
});
