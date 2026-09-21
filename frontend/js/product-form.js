const API_URL = "/api";
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

let productImagesList = []; // Mảng chứa tối đa 3 ảnh (Ảnh 0 làm Avatar)

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

    // Parse mảng ảnh cũ nếu có
    if (p.image) {
      if (p.image.startsWith("[")) {
        try {
          productImagesList = JSON.parse(p.image);
        } catch (e) {
          productImagesList = [p.image];
        }
      } else if (p.image.includes("|||")) {
        productImagesList = p.image.split("|||");
      } else {
        productImagesList = [p.image];
      }
    }

    const statusRadio = document.querySelector(`input[name="status"][value="${p.status}"]`);
    if (statusRadio) statusRadio.checked = true;

    renderPreview();
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
  imageInput.addEventListener("change", async function () {
    const files = [...this.files];
    if (files.length === 0) return;

    if (productImagesList.length + files.length > 3) {
      alert("⚠️ Bạn chỉ được chọn tối đa 3 ảnh cho mỗi sản phẩm!");
    }

    const remainingSlots = 3 - productImagesList.length;
    const filesToRead = files.slice(0, remainingSlots);

    for (const file of filesToRead) {
      const base64 = await readFileAsBase64(file);
      productImagesList.push(base64);
    }

    imageInput.value = ""; // Reset input
    renderPreview();
  });
}

function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        const maxDim = 1000;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.82);
        resolve(compressedBase64);
      };
      img.onerror = () => resolve(e.target.result);
      img.src = e.target.result;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

function renderPreview() {
  if (!previewList) return;
  previewList.innerHTML = "";

  const uploadBtnLabel = document.querySelector(".upload-item");
  if (uploadBtnLabel) {
    if (productImagesList.length >= 3) {
      uploadBtnLabel.style.display = "none";
    } else {
      uploadBtnLabel.style.display = "flex";
    }
  }

  productImagesList.forEach((imgSrc, index) => {
    const div = document.createElement("div");
    div.style.position = "relative";
    div.style.display = "inline-block";
    div.style.marginRight = "10px";
    div.style.marginBottom = "10px";

    const isAvatar = index === 0;
    const badgeText = isAvatar ? "★ Avatar" : `Ảnh ${index + 1}`;
    const badgeBg = isAvatar ? "#0d4dbb" : "rgba(0,0,0,0.6)";

    div.innerHTML = `
      <img src="${imgSrc}" style="width:100px;height:100px;object-fit:cover;border-radius:6px;border: ${isAvatar ? '2px solid #0d4dbb' : '1px solid #ccc'};">
      <span style="position:absolute;bottom:5px;left:5px;background:${badgeBg};color:white;font-size:0.65rem;padding:2px 6px;border-radius:4px;font-weight:bold;">${badgeText}</span>
      <button type="button" class="remove-image" data-index="${index}" style="position:absolute;top:-6px;right:-6px;background:#d93025;color:white;border:none;border-radius:50%;width:22px;height:22px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:0.75rem;box-shadow:0 2px 5px rgba(0,0,0,0.2);">
        <i class="fa-solid fa-xmark"></i>
      </button>
    `;

    div.querySelector(".remove-image").addEventListener("click", (e) => {
      e.stopPropagation();
      productImagesList.splice(index, 1);
      renderPreview();
    });

    previewList.appendChild(div);
  });
}

function validateForm() {
  if (!productName.value.trim()) { alert("Vui lòng nhập tên sản phẩm!"); return false; }
  if (!categoryId.value) { alert("Vui lòng chọn danh mục!"); return false; }
  if (!price.value.trim()) { alert("Vui lòng nhập giá bán!"); return false; }
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
    
    let finalImage = "../image/image 4.png";
    if (productImagesList.length === 1) {
      finalImage = productImagesList[0];
    } else if (productImagesList.length > 1) {
      finalImage = JSON.stringify(productImagesList);
    }

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
        alert("Lỗi: " + (result.message || "Không thể lưu sản phẩm. Vui lòng kiểm tra quyền đăng nhập"));
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi khi lưu sản phẩm: " + (err.message || "Vui lòng kiểm tra lại kết nối server"));
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
    if (!confirm("Chắc chắn xóa sản phẩm này?")) return;
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
