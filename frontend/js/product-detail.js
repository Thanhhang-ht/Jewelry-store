const API_URL = "/api/products";

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
      if (result.data.status === 'inactive' || result.data.status === 'hidden' || result.data.status === 'stop') {
        alert("Sản phẩm này hiện đang ngừng kinh doanh hoặc bị ẩn!");
        window.location.href = "products.html";
        return;
      }
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

function parseProductImages(imageField) {
  if (!imageField) return ['../image/image 24.png'];
  if (Array.isArray(imageField)) return imageField.length > 0 ? imageField : ['../image/image 24.png'];
  if (typeof imageField === 'string' && imageField.trim().startsWith('[')) {
    try {
      const arr = JSON.parse(imageField);
      if (Array.isArray(arr) && arr.length > 0) return arr;
    } catch(e) {}
  }
  return [imageField];
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

  const imagesList = parseProductImages(product.image);
  const mainImg = document.getElementById("mainImg");
  if (mainImg) mainImg.src = imagesList[0];

  // Render thumbs gallery (Dynamically from uploaded images)
  const thumbsContainer = document.querySelector(".thumbs");
  if (thumbsContainer) {
    thumbsContainer.innerHTML = imagesList.map((imgSrc, idx) => `
      <img src="${imgSrc}" class="thumb ${idx === 0 ? 'active' : ''}">
    `).join("");
    
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
    const icon = newFavBtn.querySelector("i");
    
    // Check initial wishlist status
    const inWishlist = window.isProductInWishlist ? window.isProductInWishlist(product.id) : false;
    if (icon) {
      icon.classList.toggle("fa-regular", !inWishlist);
      icon.classList.toggle("fa-solid", inWishlist);
      icon.style.color = inWishlist ? "red" : "#000";
    }

    newFavBtn.addEventListener("click", () => {
      if (window.toggleWishlist) {
        const isAdded = window.toggleWishlist(product);
        if (icon) {
          icon.classList.toggle("fa-regular", !isAdded);
          icon.classList.toggle("fa-solid", isAdded);
          icon.style.color = isAdded ? "red" : "#000";
        }
      }
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
      const products = result.data.filter(p => p.status !== 'inactive' && p.status !== 'hidden' && p.status !== 'stop');
      
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
      (p) => {
        const avatar = parseProductImages(p.image)[0];
        const inWishlist = window.isProductInWishlist ? window.isProductInWishlist(p.id) : false;
        const heartClass = inWishlist ? "fa-solid fa-heart love" : "fa-regular fa-heart love";
        const heartColor = inWishlist ? "color: red;" : "color: black;";
        return `
    <div class="card" data-id="${p.id}">
      <img src="${avatar}">
      <div class="content">
        <h3>${p.name}</h3>
        <p class="price-card">${Number(p.price).toLocaleString("vi-VN")}đ</p>
        <div class="action">
          <a href="product-detail.html?id=${p.id}" class="detail-btn">Xem chi tiết</a>
          <i class="${heartClass}" style="${heartColor}" data-id="${p.id}"></i>
        </div>
      </div>
    </div>
  `;
      }
    )
    .join("");

  // Bind love icons for related products
  relatedList.querySelectorAll(".love").forEach((heart) => {
    heart.addEventListener("click", () => {
      const id = heart.dataset.id;
      const product = products.find(p => p.id == id);
      if (!product) return;
      if (window.toggleWishlist) {
        const isAdded = window.toggleWishlist(product);
        heart.classList.toggle("fa-regular", !isAdded);
        heart.classList.toggle("fa-solid", isAdded);
        heart.style.color = isAdded ? "red" : "black";
      }
    });
  });
}
