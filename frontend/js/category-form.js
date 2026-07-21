const API_URL = "/api";
const params = new URLSearchParams(window.location.search);
const mode = params.get("mode") || "add";
const editId = params.get("id");

const formTitle = document.getElementById("formTitle");
const categoryForm = document.getElementById("categoryForm");
const categoryName = document.getElementById("categoryName");
const description = document.getElementById("description");
const imageInput = document.getElementById("categoryImage");
const previewImg = document.getElementById("previewImg");
const uploadBox = document.getElementById("uploadBox");

let currentImageBase64 = "";

document.addEventListener("DOMContentLoaded", () => {
  initPage();
});

if (imageInput) {
  imageInput.addEventListener("change", function () {
    const file = this.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      previewImg.src = e.target.result;
      previewImg.style.display = "block";
      if (uploadBox) uploadBox.style.display = "none";
      currentImageBase64 = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

function initPage() {
  if (mode === "add") {
    document.title = "Thêm danh mục";
    if (formTitle) formTitle.textContent = "Thêm danh mục";
  } else if (mode === "edit") {
    document.title = "Sửa danh mục";
    if (formTitle) formTitle.textContent = "Sửa danh mục";
    loadCategoryData();
  }
}

async function loadCategoryData() {
  try {
    const res = await fetch(`${API_URL}/categories/${editId}`);
    const result = await res.json();

    if (result.success) {
      const category = result.data;
      categoryName.value = category.name;
      description.value = category.description || "";
      currentImageBase64 = category.image || "";

      if (category.image) {
        previewImg.src = category.image;
        previewImg.style.display = "block";
        if (uploadBox) uploadBox.style.display = "none";
      }

      const statusSelect = document.getElementById("status");
      if (statusSelect) {
          statusSelect.value = category.status;
      }
    } else {
      alert("Không tìm thấy danh mục!");
      window.location.href = "category-management.html";
    }
  } catch (err) {
    console.error("Lỗi:", err);
  }
}

if (categoryForm) {
  categoryForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    if (categoryName.value.trim() === "") {
      alert("Vui lòng nhập tên danh mục!");
      categoryName.focus();
      return;
    }

    const statusSelect = document.getElementById("status");
    const statusVal = statusSelect ? statusSelect.value : "active";

    const payload = {
      name: categoryName.value.trim(),
      description: description.value.trim(),
      status: statusVal,
      image: currentImageBase64
    };

    try {
      const url = mode === "add" ? `${API_URL}/categories` : `${API_URL}/categories/${editId}`;
      const method = mode === "add" ? "POST" : "PUT";
      
      const res = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(payload)
      });
      
      const result = await res.json();
      if (result.success) {
        alert(mode === "add" ? "Thêm danh mục thành công!" : "Cập nhật danh mục thành công!");
        window.location.href = "category-management.html";
      } else {
        alert("Lỗi: " + result.message);
      }
    } catch (err) {
      console.error(err);
      alert("Đã xảy ra lỗi hệ thống!");
    }
  });
}
