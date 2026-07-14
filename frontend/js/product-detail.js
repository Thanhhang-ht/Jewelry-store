const API_URL = "http://localhost:3000/api/products";

let currentProduct = null;
let allProducts = [];

document.addEventListener("DOMContentLoaded", async () => {
  // =========================
  // URL PARSING
  // =========================
  const urlParams = new URLSearchParams(window.location.search);
  const productId = parseInt(urlParams.get("id")) || 1;

  await loadProductDetail(productId);
  await loadRelatedProducts(productId);
});

async function loadProductDetail(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`);
    const result = await res.json();

    if (result.success && result.data) {
      currentProduct = result.data;
      renderProductDetail(currentProduct);
    } else {
      alert("Không tìm thấy sản phẩm!");
      window.location.href = "products.html";
    }
  } catch (err) {
    console.error("Lỗi khi tải chi tiết sản phẩm:", err);
    alert("Có lỗi xảy ra khi tải dữ liệu.");
  }
}

function renderProductDetail(product) {
  document.title = product.name + " | Jewelry Store";
  
  const breadcrumbName = document.getElementById("productName");
  if (breadcrumbName) breadcrumbName.innerText = product.name;

  const titleEl = document.getElementById("title");
  if (titleEl) titleEl.innerText = product.name;

  const priceEl = document.getElementById("price");
  if (priceEl) priceEl.innerText = Number(product.price).toLocaleString("vi-VN") + "đ";

  const materialEl = document.getElementById("productMaterial");
  if (materialEl) materialEl.innerText = product.material || "Bạc 925";

  const descEl = document.getElementById("productDescription");
  if (descEl) descEl.innerText = product.description || "Chưa có mô tả.";

  const img = product.image || '../image/image 24.png';
  const mainImg = document.getElementById("mainImg");
  if (mainImg) mainImg.src = img;

  // Render thumbs gallery (Fake gallery with the same image)
  const thumbsContainer = document.querySelector(".thumbs");
  if (thumbsContainer) {
    thumbsContainer.innerHTML = `
      <img src="${img}" class="thumb active">
      <img src="${img}" class="thumb">
      <img src="${img}" class="thumb">
    `;
    
    const thumbs = thumbsContainer.querySelectorAll(".thumb");
    thumbs.forEach((thumbImg) => {
      thumbImg.addEventListener("click", () => {
        if (mainImg) mainImg.src = thumbImg.src;
        thumbs.forEach((i) => i.classList.remove("active"));
        thumbImg.classList.add("active");
      });
    });
  }

  // =========================
  // QUANTITY CONTROL
  // =========================
  let quantity = 1;
  const quantityInput = document.getElementById("quantity");

  const updateQuantity = () => {
    if (quantityInput) {
      quantityInput.value = quantity;
    }
  };

  const plusBtn = document.getElementById("plus");
  const minusBtn = document.getElementById("minus");

  if (plusBtn) {
    // Xóa event listener cũ để tránh bind nhiều lần
    const newPlusBtn = plusBtn.cloneNode(true);
    plusBtn.parentNode.replaceChild(newPlusBtn, plusBtn);
    newPlusBtn.addEventListener("click", () => {
      if (quantity < product.stock) {
        quantity++;
        updateQuantity();
      } else {
        alert("Số lượng đạt giới hạn tồn kho!");
      }
    });
  }

  if (minusBtn) {
    const newMinusBtn = minusBtn.cloneNode(true);
    minusBtn.parentNode.replaceChild(newMinusBtn, minusBtn);
    newMinusBtn.addEventListener("click", () => {
      if (quantity > 1) {
        quantity--;
        updateQuantity();
      }
    });
  }

  // =========================
  // FAVORITE BUTTON
  // =========================
  const favoriteBtn = document.getElementById("favoriteBtn");
  if (favoriteBtn) {
    const newFavBtn = favoriteBtn.cloneNode(true);
    favoriteBtn.parentNode.replaceChild(newFavBtn, favoriteBtn);
    newFavBtn.addEventListener("click", () => {
      const icon = newFavBtn.querySelector("i");
      icon.classList.toggle("fa-regular");
      icon.classList.toggle("fa-solid");
      icon.style.color = icon.classList.contains("fa-solid") ? "red" : "#000";
    });
  }

  // =========================
  // ADD TO CART
  // =========================
  const addCartBtn = document.getElementById("addCartBtn");
  if (addCartBtn) {
    const newAddCartBtn = addCartBtn.cloneNode(true);
    addCartBtn.parentNode.replaceChild(newAddCartBtn, addCartBtn);
    newAddCartBtn.addEventListener("click", () => {
      addToCartAction(quantity, false);
      alert("Đã thêm sản phẩm vào giỏ hàng!");
    });
  }

  // =========================
  // BUY NOW
  // =========================
  const buyNowBtn = document.getElementById("buyNowBtn");
  if (buyNowBtn) {
    const newBuyNowBtn = buyNowBtn.cloneNode(true);
    buyNowBtn.parentNode.replaceChild(newBuyNowBtn, buyNowBtn);
    newBuyNowBtn.addEventListener("click", () => {
      addToCartAction(quantity, true);
      window.location.href = "../html/checkout.html";
    });
  }
}

function addToCartAction(quantity, isBuyNow) {
  if (!currentProduct) return;

  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const existingIndex = cart.findIndex((item) => item.id == currentProduct.id);

  if (existingIndex !== -1) {
    cart[existingIndex].quantity += quantity;
    if (isBuyNow) cart[existingIndex].checked = true;
  } else {
    cart.push({
      ...currentProduct,
      quantity: quantity,
      checked: true
    });
  }

  if (isBuyNow) {
    cart.forEach((item) => {
      if (item.id != currentProduct.id) {
        item.checked = false;
      }
    });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
}

async function loadRelatedProducts(currentId) {
  try {
    const res = await fetch(API_URL);
    const result = await res.json();
    
    if (result.success) {
      const products = result.data.filter(p => p.status !== 'hidden');
      
      // Lọc các sản phẩm khác ID hiện tại
      let relatedProducts = products.filter(p => p.id !== currentId);
      
      // Ưu tiên cùng danh mục nếu currentProduct đã tải (tuy nhiên logic này load bất đồng bộ)
      if (currentProduct) {
        const sameCategory = relatedProducts.filter(p => p.category_id === currentProduct.category_id);
        if (sameCategory.length >= 4) {
          relatedProducts = sameCategory.slice(0, 4);
        } else {
          // Lấy thêm sản phẩm bất kỳ cho đủ 4
          relatedProducts = [...sameCategory, ...relatedProducts.filter(p => p.category_id !== currentProduct.category_id)].slice(0, 4);
        }
      } else {
        relatedProducts = relatedProducts.slice(0, 4);
      }

      renderRelatedProducts(relatedProducts);
    }
  } catch (err) {
    console.error("Lỗi tải sản phẩm liên quan:", err);
  }
}

function renderRelatedProducts(products) {
  const relatedList = document.querySelector(".related .product-list");
  if (!relatedList) return;

  relatedList.innerHTML = products
    .map(
      (p) => `
    <div class="card" data-id="${p.id}">
      <img src="${p.image || '../image/image 24.png'}">
      <div class="content">
        <h3>${p.name}</h3>
        <p class="price-card">${Number(p.price).toLocaleString("vi-VN")}đ</p>
        <div class="action">
          <a href="product-detail.html?id=${p.id}" class="detail-btn">Xem chi tiết</a>
          <i class="fa-regular fa-heart love" data-id="${p.id}"></i>
        </div>
      </div>
    </div>
  `
    )
    .join("");

  // Bind love icons for related products
  relatedList.querySelectorAll(".love").forEach((heart) => {
    heart.addEventListener("click", () => {
      heart.classList.toggle("fa-regular");
      heart.classList.toggle("fa-solid");
      heart.style.color = heart.classList.contains("fa-solid") ? "red" : "black";
    });
  });
}
