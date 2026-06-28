const API_URL = "http://localhost:5000/api/products";

// ==============================
// RENDER PRODUCTS
// ==============================
function renderProducts(list) {
  const container = document.getElementById("productList");
  if (!container) return;

  container.innerHTML = list
    .map(
      (p) => `
    <div class="card" data-id="${p.id}">

      <img src="${p.image}" alt="${p.name}">

      <div class="content">
        <h3>${p.name}</h3>
        <p class="price">${Number(p.price).toLocaleString()}đ</p>

        <div class="action">
          <a href="product-detail.html?id=${p.id}" class="detail-btn">
            Xem chi tiết
          </a>

          <i class="fa-regular fa-heart love"></i>
        </div>
      </div>

    </div>
  `
    )
    .join("");

  bindEvents();
}

// ==============================
// MOCK DATA (HIỂN THỊ NGAY)
// Sau này thay bằng API
// ==============================
let products = [
  {
    id: 1,
    name: "Nhẫn bạc đính đá",
    price: 460000,
    image: "../image/image 6.png",
  },
  {
    id: 2,
    name: "Nhẫn bạc cao cấp",
    price: 540000,
    image: "../image/image_7.png",
  },
  {
    id: 3,
    name: "Dây chuyền bạc nữ",
    price: 670000,
    image: "../image/image 9.png",
  },
  {
    id: 4,
    name: "Dây chuyền cao cấp",
    price: 730000,
    image: "../image/image 14.png",
  },
  {
    id: 5,
    name: "Vòng tay kim cương",
    price: 870000,
    image: "../image/image 10.png",
  },
  {
    id: 6,
    name: "Vòng tay bạc",
    price: 570000,
    image: "../image/image 11.png",
  },
  {
    id: 7,
    name: "Bông tai bạc",
    price: 430000,
    image: "../image/image_12.png",
  },
  {
    id: 8,
    name: "Bông tai cao cấp",
    price: 750000,
    image: "../image/image 13.png",
  },
];

// ==============================
// EVENTS (SAU KHI RENDER)
// ==============================
function bindEvents() {
  // LOVE
  document.querySelectorAll(".love").forEach((icon) => {
    icon.onclick = () => {
      icon.classList.toggle("fa-regular");
      icon.classList.toggle("fa-solid");
      icon.style.color = icon.classList.contains("fa-solid") ? "red" : "#000";
    };
  });

  // CART
  document.querySelectorAll(".cart-btn").forEach((btn) => {
    btn.onclick = () => {
      alert("Đã thêm vào giỏ hàng!");
    };
  });
}

// ==============================
// CATEGORY ACTIVE (UI ONLY)
// ==============================
document.querySelectorAll(".category-list button").forEach((btn) => {
  btn.onclick = () => {
    document
      .querySelectorAll(".category-list button")
      .forEach((b) => b.classList.remove("active"));

    btn.classList.add("active");
  };
});

// ==============================
// SEARCH FILTER
// ==============================
const searchInput = document.getElementById("searchInput");

if (searchInput) {
  searchInput.addEventListener("input", () => {
    const keyword = searchInput.value.toLowerCase();

    const filtered = products.filter((p) =>
      p.name.toLowerCase().includes(keyword)
    );

    renderProducts(filtered);
  });
}

// ==============================
// INIT PAGE
// ==============================
document.addEventListener("DOMContentLoaded", () => {
  renderProducts(products);
});
