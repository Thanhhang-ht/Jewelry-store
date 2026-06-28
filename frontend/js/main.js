const API_URL = "http://localhost:5000/api";

// ======================
// MOCK DATA (HIỂN THỊ NGAY)
// Sau này thay bằng fetch API
// ======================
let products = [
  {
    id: 1,
    name: "Nhẫn bạc đính đá CZ",
    price: 610000,
    image: "../image/image 4.png",
  },
  {
    id: 2,
    name: "Dây chuyền bạc 102",
    price: 495000,
    image: "../image/image 2.png",
  },
  {
    id: 3,
    name: "Vòng tay bạc PT",
    price: 510000,
    image: "../image/image_3.png",
  },
  {
    id: 4,
    name: "Bông tai bạc ngôi sao",
    price: 480000,
    image: "../image/image 5.png",
  },
];

// ======================
// RENDER PRODUCTS
// ======================
function renderProducts(list = products) {
  const container = document.getElementById("productList");

  if (!container) return;

  container.innerHTML = list
    .map(
      (p) => `
    <div class="pro-item" data-id="${p.id}">

      <div class="pro-img">
        <img src="${p.image}" alt="${p.name}">
        <i class="fa-regular fa-heart love"></i>
      </div>

      <div class="pro-info">
        <h4>${p.name}</h4>
        <p>${Number(p.price).toLocaleString()}đ</p>
      </div>

      <div class="pro-btn">
        <button class="detail-btn" data-id="${p.id}">
          Xem chi tiết
        </button>

        <button class="cart-btn" data-id="${p.id}">
          <i class="fa-solid fa-cart-plus"></i>
        </button>
      </div>

    </div>
  `
    )
    .join("");

  bindEvents();
}

// ======================
// EVENT BINDING (IMPORTANT)
// ======================
function bindEvents() {
  // ADD TO CART
  document.querySelectorAll(".cart-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = e.currentTarget.dataset.id;
      addToCart(id);
    });
  });

  // LOVE / FAVORITE
  document.querySelectorAll(".love").forEach((icon) => {
    icon.addEventListener("click", () => {
      icon.classList.toggle("fa-regular");
      icon.classList.toggle("fa-solid");

      icon.style.color = icon.classList.contains("fa-solid") ? "red" : "black";
    });
  });

  // DETAIL BUTTON
  document.querySelectorAll(".detail-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = e.currentTarget.dataset.id;
      goToDetail(id);
    });
  });
}

// ======================
// CART FUNCTION
// ======================
function addToCart(productId) {
  console.log("Add to cart:", productId);

  // sau này backend:
  /*
  fetch(`${API_URL}/cart`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ productId })
  });
  */

  alert("Đã thêm vào giỏ hàng");
}

// ======================
// PRODUCT DETAIL
// ======================
function goToDetail(id) {
  window.location.href = `product-detail.html?id=${id}`;
}

// ======================
// AI CHAT
// ======================
async function chatAI() {
  const msg = document.getElementById("msg").value;

  if (!msg.trim()) {
    alert("Vui lòng nhập nội dung");
    return;
  }

  // tạm thời
  alert("AI đang tư vấn:\n\n" + msg);

  // backend sau này:
  /*
  const res = await fetch(`${API_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ message: msg })
  });

  const data = await res.json();
  alert(data.reply);
  */
}

// ======================
// INIT PAGE
// ======================
window.onload = () => {
  renderProducts();
};
