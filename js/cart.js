// =========================
// CART.JS (FIX + CLEAN VERSION)
// =========================

// CHUYỂN TRANG THANH TOÁN
function goToCheckout() {
  window.location.href = "../html/checkout.html";
}

// =========================
// FORMAT TIỀN
// =========================
function parseMoney(text) {
  return parseInt(text.replace(/\./g, "").replace("đ", "").trim());
}

function formatMoney(value) {
  return value.toLocaleString("vi-VN") + "đ";
}

// =========================
// CẬP NHẬT TỔNG ĐƠN HÀNG
// =========================
function updateOrderInfo() {
  let total = 0;

  document.querySelectorAll(".cart-item").forEach((item) => {
    const check = item.querySelector(".check i");

    if (check.classList.contains("fa-circle-check")) {
      const itemTotal = parseMoney(item.querySelector(".total").innerText);
      total += itemTotal;
    }
  });

  const subtotalEl = document.querySelector(".order-box .row span:last-child");
  const totalEl = document.querySelector(".total-order span:last-child");

  if (subtotalEl) subtotalEl.innerText = formatMoney(total);
  if (totalEl) totalEl.innerText = formatMoney(total);
}

// =========================
// TĂNG GIẢM SỐ LƯỢNG
// =========================
document.querySelectorAll(".cart-item").forEach((item) => {
  const minusBtn = item.querySelector(".quantity button:first-child");
  const plusBtn = item.querySelector(".quantity button:last-child");
  const qtySpan = item.querySelector(".quantity span");

  const priceText = item.querySelector(".price").innerText;
  const price = parseMoney(priceText);

  let quantity = parseInt(qtySpan.innerText);

  function render() {
    qtySpan.innerText = quantity;

    const total = price * quantity;
    item.querySelector(".total").innerText = formatMoney(total);

    updateOrderInfo();
  }

  plusBtn.addEventListener("click", () => {
    quantity++;
    render();
  });

  minusBtn.addEventListener("click", () => {
    if (quantity > 1) {
      quantity--;
      render();
    }
  });
});

// =========================
// XÓA SẢN PHẨM
// =========================
document.querySelectorAll(".delete i").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (confirm("Bạn có muốn xóa sản phẩm này?")) {
      btn.closest(".cart-item").remove();
      updateOrderInfo();
    }
  });
});

// =========================
// CHỌN / BỎ CHỌN SẢN PHẨM
// =========================
document.querySelectorAll(".check i").forEach((icon) => {
  icon.addEventListener("click", () => {
    icon.classList.toggle("fa-circle");
    icon.classList.toggle("fa-circle-check");

    updateOrderInfo();
  });
});

// =========================
// CHỌN TẤT CẢ
// =========================
const selectAll = document.querySelector(".select-all i");

if (selectAll) {
  selectAll.addEventListener("click", () => {
    const isChecked = selectAll.classList.contains("fa-circle-check");

    document.querySelectorAll(".check i").forEach((icon) => {
      icon.classList.toggle("fa-circle-check", !isChecked);
      icon.classList.toggle("fa-circle", isChecked);
    });

    selectAll.classList.toggle("fa-circle-check", !isChecked);
    selectAll.classList.toggle("fa-circle", isChecked);

    updateOrderInfo();
  });
}

// =========================
// TÌM KIẾM SẢN PHẨM TRONG GIỎ
// =========================
const searchInput = document.getElementById("searchInput");

if (searchInput) {
  searchInput.addEventListener("input", () => {
    const keyword = searchInput.value.toLowerCase();

    document.querySelectorAll(".cart-item").forEach((item) => {
      const name = item.querySelector("h3").innerText.toLowerCase();

      item.style.display = name.includes(keyword) ? "grid" : "none";
    });
  });
}

// =========================
// TIẾP TỤC MUA SẮM
// =========================
document.querySelector(".continue-btn")?.addEventListener("click", () => {
  window.location.href = "../html/products.html";
});

// =========================
// CẬP NHẬT GIỎ HÀNG
// =========================
document.querySelector(".update-btn")?.addEventListener("click", () => {
  alert("Giỏ hàng đã được cập nhật!");
});

// =========================
// YÊU THÍCH (HEART)
// =========================
document.querySelectorAll(".love").forEach((heart) => {
  heart.addEventListener("click", () => {
    heart.classList.toggle("active");

    if (heart.classList.contains("active")) {
      heart.classList.remove("fa-regular");
      heart.classList.add("fa-solid");
    } else {
      heart.classList.remove("fa-solid");
      heart.classList.add("fa-regular");
    }
  });
});

// INIT
updateOrderInfo();
