// ==========================================
// PRODUCT FORM PROCESS
// ==========================================

const params = new URLSearchParams(window.location.search);
const mode = params.get("mode") || "add";
const editId = parseInt(params.get("id"));

// DOM
const formTitle = document.getElementById("formTitle");
const productForm = document.getElementById("productForm");
const btnSave = document.getElementById("btnSave");
const btnDelete = document.getElementById("btnDelete");
const btnCancel = document.getElementById("btnCancel");
const btnBack = document.getElementById("btnBack");
const imageInput = document.getElementById("productImages");
const previewList = document.getElementById("previewList");

// INPUT
const productName = document.getElementById("productName");
const categoryId = document.getElementById("categoryId");
const material = document.getElementById("material");
const price = document.getElementById("price");
const quantity = document.getElementById("quantity");
const description = document.getElementById("description");

let imageFiles = [];
let existingImage = "";
let uploadedImageBase64 = "";

// INIT
window.addEventListener("DOMContentLoaded", () => {
  loadCategories();
  initPage();
});

// LOAD CATEGORIES
function loadCategories() {
  if (!categoryId) return;
  
  const categories = DB.getCategories();
  categoryId.innerHTML = `<option value="">-- Chọn danh mục --</option>`;

  categories.forEach((cat) => {
    if (cat.status === "active") {
      const option = document.createElement("option");
      option.value = cat.name;
      option.textContent = cat.name;
      categoryId.appendChild(option);
    }
  });
}

// INIT PAGE MODE
function initPage() {
  switch (mode) {
    case "add":
      if (formTitle) formTitle.textContent = "Thêm sản phẩm";
      if (btnSave) btnSave.textContent = "Lưu sản phẩm";
      if (btnDelete) btnDelete.style.display = "none";
      break;

    case "edit":
      if (formTitle) formTitle.textContent = "Sửa sản phẩm";
      if (btnSave) btnSave.textContent = "Cập nhật sản phẩm";
      if (btnDelete) btnDelete.style.display = "block";
      loadProductData();
      break;

    case "view":
      if (formTitle) formTitle.textContent = "Chi tiết sản phẩm";
      if (btnSave) btnSave.style.display = "none";
      if (btnDelete) btnDelete.style.display = "none";
      loadProductData();
      disableForm();
      break;
  }
}

// DISABLE FORM
function disableForm() {
  if (!productForm) return;
  const controls = productForm.querySelectorAll("input, textarea, select");
  controls.forEach((item) => {
    item.disabled = true;
  });
}

// LOAD DATA
function loadProductData() {
  const products = DB.getProducts();
  const p = products.find((prod) => prod.id === editId);

  if (!p) {
    alert("Không tìm thấy sản phẩm!");
    window.location.href = "product-management.html";
    return;
  }

  productName.value = p.name;
  categoryId.value = p.category;
  material.value = p.material || "";
  price.value = Number(p.price).toLocaleString("vi-VN");
  quantity.value = p.stock;
  description.value = p.description || "";
  existingImage = p.image || "";

  // Set status radio
  const statusRadio = document.querySelector(`input[name="status"][value="${p.status}"]`);
  if (statusRadio) statusRadio.checked = true;

  // Show image preview
  if (p.image) {
    renderPreview();
  }
}

// PRICE FORMAT
if (price) {
  price.addEventListener("input", function () {
    let value = this.value;
    value = value.replace(/\D/g, "");
    if (value === "") {
      this.value = "";
      return;
    }
    this.value = Number(value).toLocaleString("vi-VN");
  });
}

// UPLOAD IMAGE
if (imageInput) {
  imageInput.addEventListener("change", function () {
    const files = [...this.files];
    if (files.length === 0) return;

    imageFiles = files; // Lưu trữ file hiện tại
    const reader = new FileReader();
    reader.onload = function (e) {
      uploadedImageBase64 = e.target.result;
      renderPreview();
    };
    reader.readAsDataURL(files[0]);
  });
}

// RENDER IMAGE PREVIEW
function renderPreview() {
  if (!previewList) return;
  previewList.innerHTML = "";

  const imgSrc = uploadedImageBase64 || existingImage;
  if (!imgSrc) return;

  const div = document.createElement("div");
  div.className = "preview-item";
  div.style.position = "relative";
  div.style.display = "inline-block";

  div.innerHTML = `
    <img src="${imgSrc}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 5px;">
    <button type="button" class="remove-image" style="position: absolute; top: -5px; right: -5px; background: red; color: white; border: none; border-radius: 50%; width: 20px; height: 20px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 0.75rem;">
      <i class="fa-solid fa-xmark"></i>
    </button>
  `;

  div.querySelector(".remove-image").addEventListener("click", () => {
    uploadedImageBase64 = "";
    existingImage = "";
    imageFiles = [];
    if (imageInput) imageInput.value = "";
    previewList.innerHTML = "";
  });

  previewList.appendChild(div);
}

// VALIDATE
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

// SUBMIT FORM (Save or Update DB)
if (productForm) {
  productForm.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!validateForm()) return;

    const products = DB.getProducts();
    const parsedPrice = parseInt(price.value.replace(/\D/g, ""));
    const parsedStock = parseInt(quantity.value.replace(/\D/g, ""));
    const statusVal = document.querySelector("input[name='status']:checked")?.value || "selling";
    
    // Gán ảnh mới hoặc ảnh cũ
    const finalImage = uploadedImageBase64 || existingImage || "../image/image 4.png"; // default fallback

    if (mode === "add") {
      let maxId = 0;
      products.forEach((p) => {
        if (p.id > maxId) maxId = p.id;
      });
      const newId = maxId + 1;
      const code = `SP${String(newId).padStart(3, "0")}`;

      const now = new Date();
      const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

      const newProduct = {
        id: newId,
        code: code,
        name: productName.value.trim(),
        category: categoryId.value,
        price: parsedPrice,
        stock: parsedStock,
        status: parsedStock <= 0 ? "out-stock" : statusVal,
        createdAt: dateStr,
        image: finalImage,
        material: material.value.trim(),
        description: description.value.trim()
      };

      products.unshift(newProduct);
      DB.saveProducts(products);
      alert("Thêm sản phẩm thành công!");
    } else if (mode === "edit") {
      const index = products.findIndex((p) => p.id === editId);
      if (index !== -1) {
        products[index] = {
          ...products[index],
          name: productName.value.trim(),
          category: categoryId.value,
          price: parsedPrice,
          stock: parsedStock,
          status: parsedStock <= 0 ? "out-stock" : statusVal,
          image: finalImage,
          material: material.value.trim(),
          description: description.value.trim()
        };
        DB.saveProducts(products);
        alert("Cập nhật sản phẩm thành công!");
      }
    }

    window.location.href = "product-management.html";
  });
}

// CANCEL
if (btnCancel) {
  btnCancel.addEventListener("click", (e) => {
    e.preventDefault();
    if (confirm("Bạn có muốn hủy bỏ thay đổi?")) {
      window.location.href = "product-management.html";
    }
  });
}

// BACK
if (btnBack) {
  btnBack.addEventListener("click", () => {
    window.location.href = "product-management.html";
  });
}

// DELETE PRODUCT
if (btnDelete) {
  btnDelete.addEventListener("click", () => {
    if (!confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;

    let products = DB.getProducts();
    products = products.filter((p) => p.id !== editId);
    DB.saveProducts(products);

    alert("Đã xóa sản phẩm thành công!");
    window.location.href = "product-management.html";
  });
}

// NUMBER ONLY FOR QUANTITY
if (quantity) {
  quantity.addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, "");
  });
}
