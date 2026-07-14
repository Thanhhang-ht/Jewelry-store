const API_URL = "http://localhost:3000/api";
const params = new URLSearchParams(window.location.search);
const mode = params.get("mode") || "add";
const editId = params.get("id");

const formTitle = document.getElementById("formTitle");
const productForm = document.getElementById("productForm");
const btnSave = document.getElementById("btnSave");
const btnDelete = document.getElementById("btnDelete");
const btnCancel = document.getElementById("btnCancel");
const imageInput = document.getElementById("productImages");
const previewList = document.getElementById("previewList");

const productName = document.getElementById("productName");
const categoryId = document.getElementById("categoryId");
const material = document.getElementById("material");
const price = document.getElementById("price");
const quantity = document.getElementById("quantity");
const description = document.getElementById("description");

let uploadedImageBase64 = "";
let existingImage = "";

window.addEventListener("DOMContentLoaded", async () => {
  await loadCategories();
  initPage();
});

async function loadCategories() {
  if (!categoryId) return;
  try {
    const res = await fetch(`${API_URL}/categories`);
    const result = await res.json();
    if (result.success) {
      categoryId.innerHTML = `<option value="">-- Chọn danh mục --</option>`;
      result.data.forEach((cat) => {
        if (cat.status === "active") {
          const option = document.createElement("option");
          option.value = cat.id;
          option.textContent = cat.name;
          categoryId.appendChild(option);
        }
      });
    }
  } catch (err) {
    console.error(err);
  }
}

function initPage() {
  if (mode === "add") {
    if (formTitle) formTitle.textContent = "Thêm sản phẩm";
    if (btnSave) btnSave.textContent = "Lưu sản phẩm";
    if (btnDelete) btnDelete.style.display = "none";
  } else if (mode === "edit") {
    if (formTitle) formTitle.textContent = "Sửa sản phẩm";
    if (btnSave) btnSave.textContent = "Cập nhật sản phẩm";
    if (btnDelete) btnDelete.style.display = "block";
    loadProductData();
  }
}

async function loadProductData() {
  try {
    const res = await fetch(`${API_URL}/products/${editId}`);
    const result = await res.json();

    if (!result.success) {
      alert("Không tìm thấy sản phẩm!");
      window.location.href = "product-management.html";
      return;
    }

    const p = result.data;
    productName.value = p.name;
    categoryId.value = p.category_id;
    material.value = p.material || "";
    price.value = Number(p.price).toLocaleString("vi-VN");
    quantity.value = p.stock;
    description.value = p.description || "";
    existingImage = p.image || "";

    const statusRadio = document.querySelector(`input[name="status"][value="${p.status}"]`);
    if (statusRadio) statusRadio.checked = true;

    if (p.image) {
      renderPreview();
    }
  } catch (err) {
    console.error(err);
  }
}

if (price) {
  price.addEventListener("input", function () {
    let value = this.value.replace(/\D/g, "");
    if (value === "") {
      this.value = "";
      return;
    }
    this.value = Number(value).toLocaleString("vi-VN");
  });
}

if (quantity) {
  quantity.addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, "");
  });
}

if (imageInput) {
  imageInput.addEventListener("change", function () {
    const files = [...this.files];
    if (files.length === 0) return;
    const reader = new FileReader();
    reader.onload = function (e) {
      uploadedImageBase64 = e.target.result;
      renderPreview();
    };
    reader.readAsDataURL(files[0]);
  });
}

function renderPreview() {
  if (!previewList) return;
  previewList.innerHTML = "";
  const imgSrc = uploadedImageBase64 || existingImage;
  if (!imgSrc) return;

  const div = document.createElement("div");
  div.style.position = "relative";
  div.style.display = "inline-block";
  div.innerHTML = `
    <img src="${imgSrc}" style="width:100px;height:100px;object-fit:cover;border-radius:5px;">
    <button type="button" class="remove-image" style="position:absolute;top:-5px;right:-5px;background:red;color:white;border:none;border-radius:50%;width:20px;height:20px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:0.75rem;">
      <i class="fa-solid fa-xmark"></i>
    </button>
  `;
  div.querySelector(".remove-image").addEventListener("click", () => {
    uploadedImageBase64 = "";
    existingImage = "";
    if (imageInput) imageInput.value = "";
    previewList.innerHTML = "";
  });
  previewList.appendChild(div);
}

function validateForm() {
  if (!productName.value.trim()) { alert("Vui lòng nhập tên!"); return false; }
  if (!categoryId.value) { alert("Vui lòng chọn danh mục!"); return false; }
  if (!price.value.trim()) { alert("Vui lòng nhập giá!"); return false; }
  if (!quantity.value.trim()) { alert("Vui lòng nhập số lượng!"); return false; }
  return true;
}

if (productForm) {
  productForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    if (!validateForm()) return;

    const parsedPrice = parseInt(price.value.replace(/\D/g, ""));
    const parsedStock = parseInt(quantity.value.replace(/\D/g, ""));
    const statusVal = document.querySelector("input[name='status']:checked")?.value || "selling";
    const finalImage = uploadedImageBase64 || existingImage || "../image/image 4.png";

    const payload = {
      name: productName.value.trim(),
      category_id: categoryId.value,
      price: parsedPrice,
      stock: parsedStock,
      status: parsedStock <= 0 ? "out-stock" : statusVal,
      image: finalImage,
      material: material.value.trim(),
      description: description.value.trim()
    };

    if (mode === "add") {
      payload.code = `SP${Math.floor(Math.random() * 10000).toString().padStart(4, "0")}`;
    }

    try {
      const url = mode === "add" ? `${API_URL}/products` : `${API_URL}/products/${editId}`;
      const method = mode === "add" ? "POST" : "PUT";
      
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(payload)
      });
      
      const result = await res.json();
      if (result.success) {
        alert(mode === "add" ? "Thêm sản phẩm thành công!" : "Cập nhật sản phẩm thành công!");
        window.location.href = "product-management.html";
      } else {
        alert("Lỗi: " + result.message);
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi kết nối máy chủ");
    }
  });
}

if (btnCancel) {
  btnCancel.addEventListener("click", (e) => {
    e.preventDefault();
    if (confirm("Hủy thay đổi?")) window.location.href = "product-management.html";
  });
}

if (btnDelete) {
  btnDelete.addEventListener("click", async () => {
    if (!confirm("Chắc chắn xóa?")) return;
    try {
      const res = await fetch(`${API_URL}/products/${editId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      const result = await res.json();
      if (result.success) {
        alert("Xóa thành công!");
        window.location.href = "product-management.html";
      } else {
        alert("Lỗi: " + result.message);
      }
    } catch (err) {
      console.error(err);
    }
  });
}
