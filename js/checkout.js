const subtotal = 670000;
const shippingFee = 30000;

function formatMoney(value) {
  return value.toLocaleString("vi-VN") + "đ";
}

function getSelectedCoupon() {
  return document.querySelector('input[name="coupon"]:checked');
}

function updateTotal() {
  const coupon = getSelectedCoupon();

  let discount = 0;
  let shipping = shippingFee;

  const type = coupon.dataset.type;
  const value = Number(coupon.dataset.value);

  if (type === "percent") {
    discount = (subtotal * value) / 100;
  } else if (type === "fixed") {
    discount = value;
  } else if (type === "ship") {
    shipping = 0;
  }

  const total = subtotal - discount + shipping;

  document.getElementById("discountName").innerText =
    coupon.value === "NONE" ? "Giảm giá" : `Giảm giá (${coupon.value})`;

  document.getElementById("discountValue").innerText =
    "-" + formatMoney(discount);

  document.getElementById("shipping").innerText =
    shipping === 0 ? "Miễn phí" : formatMoney(shipping);

  document.getElementById("grandTotal").innerText = formatMoney(total);
}

// update khi đổi coupon
document.querySelectorAll('input[name="coupon"]').forEach((radio) => {
  radio.addEventListener("change", updateTotal);
});

// init
updateTotal();

// ==============================
// PLACE ORDER (chuẩn backend-ready)
// ==============================
function placeOrder() {
  const name = document.getElementById("fullname").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const address = document.getElementById("address").value.trim();
  const note = document.getElementById("note").value.trim();

  if (!name || !phone || !address) {
    alert("Vui lòng nhập đầy đủ thông tin nhận hàng!");
    return;
  }

  const coupon = getSelectedCoupon();

  const orderData = {
    customer: {
      name,
      phone,
      address,
      note,
    },
    product: {
      id: document.querySelector(".summary-product")?.dataset.id || null,
      name: document.querySelector(".summary-product h3")?.innerText || "",
      price: subtotal,
    },
    coupon: coupon.value,
    pricing: {
      subtotal,
      shipping: document.getElementById("shipping").innerText,
      total: document.getElementById("grandTotal").innerText,
    },
  };

  console.log("ORDER DATA:", orderData);

  // giả lập backend response
  alert("Đặt hàng thành công!");

  // redirect
  window.location.href = "../html/index.html";
}
