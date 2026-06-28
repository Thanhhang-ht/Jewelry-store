document.addEventListener("DOMContentLoaded", () => {
  // =========================
  // URL PARSING
  // =========================
  const urlParams = new URLSearchParams(window.location.search);
  const productId = parseInt(urlParams.get("id")) || 1; // Mặc định là 1 nếu không truyền ID

  // Load product from LocalStorage DB
  const products = DB.getProducts();
  const product = products.find((p) => p.id === productId);

  if (!product) {
    alert("Không tìm thấy sản phẩm!");
    window.location.href = "products.html";
    return;
  }

  // =========================
  // RENDER PRODUCT DETAIL
  // =========================
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
  if (descEl) descEl.innerText = product.description || "";

  const mainImg = document.getElementById("mainImg");
  if (mainImg) mainImg.src = product.image;

  // Render thumbs gallery (ở đây ta giả lập dùng ảnh chính và các ảnh liên quan nếu có)
  const thumbsContainer = document.querySelector(".thumbs");
  if (thumbsContainer) {
    thumbsContainer.innerHTML = `
      <img src="${product.image}" class="thumb active">
      <img src="${product.image}" class="thumb">
      <img src="${product.image}" class="thumb">
    `;
    
    // Gán lại sự kiện click cho thumbs vừa tạo
    const thumbs = thumbsContainer.querySelectorAll(".thumb");
    thumbs.forEach((img) => {
      img.addEventListener("click", () => {
        if (mainImg) mainImg.src = img.src;
        thumbs.forEach((i) => i.classList.remove("active"));
        img.classList.add("active");
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
    plusBtn.addEventListener("click", () => {
      if (quantity < product.stock) {
        quantity++;
        updateQuantity();
      } else {
        alert("Số lượng đạt giới hạn tồn kho!");
      }
    });
  }

  if (minusBtn) {
    minusBtn.addEventListener("click", () => {
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
    favoriteBtn.addEventListener("click", () => {
      const icon = favoriteBtn.querySelector("i");
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
    addCartBtn.addEventListener("click", () => {
      addToCartAction();
      alert("Đã thêm sản phẩm vào giỏ hàng!");
    });
  }

  // =========================
  // BUY NOW
  // =========================
  const buyNowBtn = document.getElementById("buyNowBtn");
  if (buyNowBtn) {
    buyNowBtn.addEventListener("click", () => {
      addToCartAction(true); // Thêm và tích chọn mua ngay
      window.location.href = "../html/checkout.html";
    });
  }

  function addToCartAction(checkedOnly = false) {
    const cart = DB.getCart();
    const existingIndex = cart.findIndex((item) => item.productId === product.id);

    if (existingIndex !== -1) {
      cart[existingIndex].quantity += quantity;
      if (checkedOnly) cart[existingIndex].checked = true;
    } else {
      cart.push({
        productId: product.id,
        quantity: quantity,
        checked: true // Mặc định tích chọn mua khi thêm
      });
    }

    // Nếu buyNow, ta chỉ muốn thanh toán sản phẩm này? Hoặc tích chọn sản phẩm này
    if (checkedOnly) {
      // Bỏ chọn tất cả các sản phẩm khác để ưu tiên mua ngay sản phẩm này
      cart.forEach((item) => {
        if (item.productId !== product.id) {
          item.checked = false;
        }
      });
    }

    DB.saveCart(cart);
  }

  // =========================
  // RENDER RELATED PRODUCTS
  // =========================
  const relatedList = document.querySelector(".related .product-list");
  if (relatedList) {
    // Lọc sản phẩm cùng danh mục và bỏ sản phẩm hiện tại
    const relatedProducts = products
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 4);

    // Nếu không đủ sản phẩm cùng danh mục, lấy thêm sản phẩm khác
    if (relatedProducts.length < 4) {
      const extra = products.filter((p) => p.id !== product.id && !relatedProducts.includes(p));
      relatedProducts.push(...extra.slice(0, 4 - relatedProducts.length));
    }

    relatedList.innerHTML = relatedProducts
      .map(
        (p) => `
      <div class="card" data-id="${p.id}">
        <img src="${p.image}">
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
});
