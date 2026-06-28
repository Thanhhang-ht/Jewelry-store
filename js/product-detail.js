document.addEventListener("DOMContentLoaded", () => {
  // =========================
  // IMAGE GALLERY
  // =========================
  const thumbs = document.querySelectorAll(".thumb");
  const mainImg = document.getElementById("mainImg");

  thumbs.forEach((img) => {
    img.addEventListener("click", () => {
      mainImg.src = img.src;

      thumbs.forEach((i) => i.classList.remove("active"));
      img.classList.add("active");
    });
  });

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
      quantity++;
      updateQuantity();
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
  // FAVORITE BUTTON (MAIN PRODUCT)
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
  // ADD TO CART (READY FOR BACKEND)
  // =========================
  const addCartBtn = document.getElementById("addCartBtn");

  if (addCartBtn) {
    addCartBtn.addEventListener("click", () => {
      const product = {
        name: document.getElementById("title")?.innerText,
        price: document.getElementById("price")?.innerText,
        quantity: quantity,
      };

      console.log("ADD TO CART:", product);

      // 👉 Sau này thay bằng API POST /cart
      alert("Đã thêm vào giỏ hàng!");
    });
  }

  // =========================
  // BUY NOW
  // =========================
  const buyNowBtn = document.getElementById("buyNowBtn");

  if (buyNowBtn) {
    buyNowBtn.addEventListener("click", () => {
      window.location.href = `../html/checkout.html?qty=${quantity}`;
    });
  }

  // =========================
  // RELATED PRODUCTS - HEART
  // =========================
  document.querySelectorAll(".love").forEach((heart) => {
    heart.addEventListener("click", () => {
      heart.classList.toggle("fa-regular");
      heart.classList.toggle("fa-solid");

      heart.style.color = heart.classList.contains("fa-solid")
        ? "red"
        : "black";
    });
  });
});
