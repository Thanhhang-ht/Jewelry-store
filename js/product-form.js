// ==========================================
// PRODUCT FORM
// FRONTEND ONLY
// ==========================================

//===============================
// URL MODE
//===============================

const params = new URLSearchParams(window.location.search);

const mode = params.get("mode") || "add";

//===============================
// DOM
//===============================

const formTitle = document.getElementById("formTitle");

const productForm = document.getElementById("productForm");

const btnSave = document.getElementById("btnSave");

const btnDelete = document.getElementById("btnDelete");

const btnCancel = document.getElementById("btnCancel");

const btnBack = document.getElementById("btnBack");

const imageInput = document.getElementById("productImages");

const previewList = document.getElementById("previewList");

//===============================
// INPUT
//===============================

const productName = document.getElementById("productName");

const categoryId = document.getElementById("categoryId");

const material = document.getElementById("material");

const price = document.getElementById("price");

const quantity = document.getElementById("quantity");

const description = document.getElementById("description");

//===============================
// IMAGE
//===============================

let imageFiles = [];

//===============================
// INIT
//===============================

window.addEventListener("DOMContentLoaded", () => {
  initPage();
});
window.addEventListener("DOMContentLoaded", () => {
  loadCategories();

  initPage();
});
//===============================
// PAGE MODE
//===============================

function initPage() {
  switch (mode) {
    case "add":
      formTitle.textContent = "Thêm sản phẩm";

      btnSave.textContent = "Lưu sản phẩm";

      btnDelete.style.display = "none";

      break;

    case "edit":
      formTitle.textContent = "Sửa sản phẩm";

      btnSave.textContent = "Cập nhật sản phẩm";

      loadDemoData();

      break;

    case "view":
      formTitle.textContent = "Chi tiết sản phẩm";

      btnSave.style.display = "none";

      btnDelete.style.display = "none";

      loadDemoData();

      disableForm();

      break;
  }
}

//===============================
// DISABLE FORM
//===============================

function disableForm() {
  const controls = productForm.querySelectorAll("input, textarea, select");

  controls.forEach((item) => {
    item.disabled = true;
  });
}

//===============================
// PRICE FORMAT
//===============================

price.addEventListener("input", function () {
  let value = this.value;

  value = value.replace(/\D/g, "");

  if (value === "") {
    this.value = "";

    return;
  }

  this.value = Number(value).toLocaleString("vi-VN");
});

//===============================
// UPLOAD IMAGE
//===============================

imageInput.addEventListener("change", function () {
  const files = [...this.files];

  files.forEach((file) => {
    imageFiles.push(file);
  });

  renderPreview();
});

//===============================
// RENDER IMAGE
//===============================

function renderPreview() {
  previewList.innerHTML = "";

  imageFiles.forEach((file, index) => {
    const reader = new FileReader();

    reader.onload = function (e) {
      const div = document.createElement("div");

      div.className = "preview-item";

      div.innerHTML = `

                <img src="${e.target.result}">

                <button
                    type="button"
                    class="remove-image">

                    <i class="fa-solid fa-xmark"></i>

                </button>

            `;

      div.querySelector(".remove-image").addEventListener("click", () => {
        removeImage(index);
      });

      previewList.appendChild(div);
    };

    reader.readAsDataURL(file);
  });
}

//===============================
// REMOVE IMAGE
//===============================

function removeImage(index) {
  imageFiles.splice(index, 1);

  renderPreview();
}
// ==========================================
// VALIDATE FORM
// ==========================================

function validateForm() {
  if (productName.value.trim() === "") {
    alert("Vui lòng nhập tên sản phẩm!");
    productName.focus();
    return false;
  }

  if (categoryId.value === "") {
    alert("Vui lòng chọn danh mục!");
    categoryId.focus();
    return false;
  }

  if (price.value.trim() === "") {
    alert("Vui lòng nhập giá bán!");
    price.focus();
    return false;
  }

  if (quantity.value.trim() === "") {
    alert("Vui lòng nhập số lượng!");
    quantity.focus();
    return false;
  }

  return true;
}

// ==========================================
// SUBMIT FORM
// ==========================================

productForm.addEventListener("submit", function (e) {
  e.preventDefault();

  if (!validateForm()) return;

  const product = {
    productName: productName.value,

    category: categoryId.value,

    material: material.value,

    price: price.value,

    quantity: quantity.value,

    description: description.value,

    images: imageFiles,
  };

  console.clear();

  console.log("====== PRODUCT ======");

  console.log(product);

  if (mode === "add") {
    alert("Thêm sản phẩm thành công!");
  }

  if (mode === "edit") {
    alert("Cập nhật sản phẩm thành công!");
  }
});

// ==========================================
// CANCEL
// ==========================================

btnCancel.addEventListener("click", function () {
  if (confirm("Bạn có muốn xóa toàn bộ dữ liệu đã nhập?")) {
    productForm.reset();

    imageFiles = [];

    previewList.innerHTML = "";
  }
});

// ==========================================
// BACK
// ==========================================

btnBack.addEventListener("click", function () {
  location.href = "product-management.html";
});

// ==========================================
// DELETE
// ==========================================

if (btnDelete) {
  btnDelete.addEventListener("click", function () {
    const ok = confirm("Bạn có chắc muốn xóa sản phẩm này?");

    if (!ok) return;

    alert("Đã xóa sản phẩm (Demo)");

    location.href = "product-management.html";
  });
}

// ==========================================
// LOAD DEMO DATA
// ==========================================

function loadDemoData() {
  productName.value = "Dây chuyền bạc nữ";

  categoryId.value = "Dây chuyền";

  material.value = "Bạc S925";

  price.value = "670.000";

  quantity.value = "50";

  description.value = "Dây chuyền bạc nữ cao cấp thiết kế hiện đại.";
}

// ==========================================
// NUMBER ONLY
// ==========================================

quantity.addEventListener("input", function () {
  this.value = this.value.replace(/\D/g, "");
});

// ==========================================
// LIMIT NAME
// ==========================================

productName.addEventListener("input", function () {
  if (this.value.length > 100) {
    this.value = this.value.slice(0, 100);
  }
});

// ==========================================
// LIMIT DESCRIPTION
// ==========================================

description.addEventListener("input", function () {
  if (this.value.length > 1000) {
    this.value = this.value.slice(0, 1000);
  }
});

// ==========================================
// PREVENT ENTER SUBMIT
// ==========================================

document.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") {
    e.preventDefault();
  }
});

// ==========================================
// PAGE TITLE
// ==========================================

switch (mode) {
  case "add":
    document.title = "Thêm sản phẩm";

    break;

  case "edit":
    document.title = "Sửa sản phẩm";

    break;

  case "view":
    document.title = "Chi tiết sản phẩm";

    break;
}

// ==========================================
// END
// ==========================================
// ===============================
// CATEGORY
// ===============================

const categories = ["Nhẫn", "Dây chuyền", "Vòng tay", "Bông tai"];

function loadCategories() {
  categoryId.innerHTML = `
        <option value="">-- Chọn danh mục --</option>
    `;

  categories.forEach((category) => {
    const option = document.createElement("option");

    option.value = category;

    option.textContent = category;

    categoryId.appendChild(option);
  });
}
