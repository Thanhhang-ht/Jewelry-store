// ==========================================
// CATEGORY FORM PROCESS
// ==========================================

const params = new URLSearchParams(window.location.search);
const mode = params.get("mode") || "add";
const editId = parseInt(params.get("id"));

// DOM
const formTitle = document.getElementById("formTitle");
const categoryForm = document.getElementById("categoryForm");
const categoryName = document.getElementById("categoryName");
const description = document.getElementById("description");
const imageInput = document.getElementById("categoryImage");
const previewImg = document.getElementById("previewImg");
const uploadBox = document.getElementById("uploadBox");
const deleteBtn = document.getElementById("deleteBtn");

let currentImageBase64 = "";

// INIT
document.addEventListener("DOMContentLoaded", () => {
  initPage();
});

// IMAGE PREVIEW & CACHE BASE64
if (imageInput) {
  imageInput.addEventListener("change", function () {
    const file = this.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      previewImg.src = e.target.result;
      previewImg.style.display = "block";
      uploadBox.style.display = "none";
      currentImageBase64 = e.target.result; // Lưu trữ base64 để lưu vào localStorage
    };
    reader.readAsDataURL(file);
  });
}

function initPage() {
  if (mode === "add") {
    document.title = "Thêm danh mục";
    if (formTitle) formTitle.textContent = "Thêm danh mục";
    if (deleteBtn) deleteBtn.style.display = "none";
  } else if (mode === "edit") {
    document.title = "Sửa danh mục";
    if (formTitle) formTitle.textContent = "Sửa danh mục";
    if (deleteBtn) deleteBtn.style.display = "block";
    loadCategoryData();
  }
}

function loadCategoryData() {
  const categories = DB.getCategories();
  const category = categories.find((c) => c.id === editId);

  if (!category) {
    alert("Không tìm thấy danh mục!");
    window.location.href = "category-management.html";
    return;
  }

  categoryName.value = category.name;
  description.value = category.description || "";
  currentImageBase64 = category.image || "";

  if (category.image) {
    previewImg.src = category.image;
    previewImg.style.display = "block";
    uploadBox.style.display = "none";
  }

  // Set status
  const statusRadio = document.querySelector(`input[name="status"][value="${category.status}"]`);
  if (statusRadio) statusRadio.checked = true;
}

function validateForm() {
  if (categoryName.value.trim() === "") {
    alert("Vui lòng nhập tên danh mục!");
    categoryName.focus();
    return false;
  }
  return true;
}

// Submit Form (Save or Update in DB)
if (categoryForm) {
  categoryForm.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!validateForm()) return;

    const categories = DB.getCategories();
    const statusVal = document.querySelector("input[name='status']:checked")?.value || "active";

    if (mode === "add") {
      let maxId = 0;
      categories.forEach((c) => {
        if (c.id > maxId) maxId = c.id;
      });
      const newId = maxId + 1;

      const newCategory = {
        id: newId,
        name: categoryName.value.trim(),
        description: description.value.trim(),
        status: statusVal,
        image: currentImageBase64 || "../image/emojione-monotone_ring.png" // fallback
      };

      categories.push(newCategory);
      DB.saveCategories(categories);
      alert("Thêm danh mục thành công!");
    } else if (mode === "edit") {
      const index = categories.findIndex((c) => c.id === editId);
      if (index !== -1) {
        categories[index].name = categoryName.value.trim();
        categories[index].description = description.value.trim();
        categories[index].status = statusVal;
        if (currentImageBase64) {
          categories[index].image = currentImageBase64;
        }
        DB.saveCategories(categories);
        alert("Cập nhật danh mục thành công!");
      }
    }

    window.location.href = "category-management.html";
  });
}

// Cancel / Reset
const cancelBtn = document.querySelector(".cancel-btn");
if (cancelBtn) {
  cancelBtn.addEventListener("click", () => {
    window.location.href = "category-management.html";
  });
}

// Delete Category
if (deleteBtn) {
  deleteBtn.addEventListener("click", () => {
    if (!confirm("Bạn có chắc muốn xóa danh mục này?")) return;

    let categories = DB.getCategories();
    categories = categories.filter((c) => c.id !== editId);
    DB.saveCategories(categories);

    alert("Đã xóa danh mục thành công!");
    window.location.href = "category-management.html";
  });
}
