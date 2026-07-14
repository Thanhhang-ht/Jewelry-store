// =========================================
// DYNAMIC CHECKOUT PROCESSING
// =========================================

let subtotal = 0;
const shippingFee = 30000;
let checkoutItems = [];

function formatMoney(value) {
  return value.toLocaleString("vi-VN") + "đ";
}

function getSelectedCoupon() {
  return document.querySelector('input[name="coupon"]:checked');
}

function initCheckout() {
  const container = document.getElementById("checkoutProducts");
  if (!container) return;

  const cart = DB.getCart();
  const products = DB.getProducts();

  // Chỉ lấy những sản phẩm được chọn thanh toán
  checkoutItems = cart.filter((item) => item.checked !== false);

  if (checkoutItems.length === 0) {
    alert("Giỏ hàng thanh toán đang trống!");
    window.location.href = "cart.html";
    return;
  }

  subtotal = 0;
  container.innerHTML = checkoutItems
    .map((item) => {
      const p = products.find((prod) => prod.id === item.productId);
      if (!p) return "";

      const price = p.price;
      subtotal += price * item.quantity;

      return `
      <div class="summary-product" data-id="${p.id}" style="display: flex; gap: 15px; margin-bottom: 15px; align-items: center;">
        <img src="${p.image}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 5px;">
        <div style="flex-grow: 1;">
          <h3 style="font-size: 0.95rem; margin-bottom: 3px; color: #333;">${p.name}</h3>
          <p style="font-size: 0.85rem; color: #888;">${formatMoney(price)}</p>
          <span style="font-size: 0.85rem; color: #666;">SL: ${item.quantity}</span>
        </div>
      </div>
    `;
    })
    .join("");

  document.getElementById("subtotal").innerText = formatMoney(subtotal);
  renderCheckoutCoupons();
  updateTotal();
}

function renderCheckoutCoupons() {
  const container = document.querySelector(".coupon-list");
  if (!container) return;

  const coupons = DB.getCoupons();
  const activeCoupons = coupons.filter(c => c.status === "active");

  let html = activeCoupons.map(c => {
    const descText = c.discount_type === "percent" ? `Giảm ${c.discount_value}% đơn hàng` : `Giảm ${Number(c.discount_value).toLocaleString()}đ`;
    const minText = `Đơn tối thiểu ${Number(c.min_order_value || 0).toLocaleString()}đ`;
    
    // Check if order subtotal meets min_order_value
    const isDisabled = subtotal < c.min_order_value;
    const disabledAttr = isDisabled ? "disabled" : "";
    const couponStyle = isDisabled ? "opacity: 0.5; cursor: not-allowed;" : "cursor: pointer;";

    return `
      <label class="coupon" style="${couponStyle}">
        <input type="radio" name="coupon" value="${c.code}" data-type="${c.discount_type}" data-value="${c.discount_value}" data-min="${c.min_order_value}" ${disabledAttr}>
        <h3>${c.code}</h3>
        <p>${descText}</p>
        <small>${minText}</small>
        <span>HSD: ${c.end_date}</span>
      </label>
    `;
  }).join("");

  // Default option
  html += `
    <label class="coupon" style="cursor: pointer;">
        <input type="radio" name="coupon" value="NONE" data-type="none" data-value="0" checked>
        <h3>Không sử dụng</h3>
    </label>
  `;

  container.innerHTML = html;

  // Re-bind change event to dynamic coupons
  document.querySelectorAll('input[name="coupon"]').forEach((radio) => {
    radio.addEventListener("change", updateTotal);
  });
}

function updateTotal() {
  const coupon = getSelectedCoupon();
  if (!coupon) return;

  let discount = 0;
  let shipping = subtotal >= 500000 ? 0 : shippingFee;

  const type = coupon.dataset.type;
  const value = Number(coupon.dataset.value);

  if (type === "percent") {
    discount = (subtotal * value) / 100;
  } else if (type === "fixed") {
    discount = value;
  } else if (type === "ship") {
    shipping = 0;
  }

  if (discount > subtotal) discount = subtotal;

  const total = subtotal - discount + shipping;

  document.getElementById("discountName").innerText =
    coupon.value === "NONE" ? "Giảm giá" : `Giảm giá (${coupon.value})`;

  document.getElementById("discountValue").innerText =
    "-" + formatMoney(discount);

  document.getElementById("shipping").innerText =
    shipping === 0 ? "Miễn phí" : formatMoney(shipping);

  document.getElementById("grandTotal").innerText = formatMoney(total);
}

// Tiến hành đặt hàng
window.placeOrder = function () {
  const name = document.getElementById("fullname").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const address = document.getElementById("address").value.trim();
  const note = document.getElementById("note").value.trim();

  if (!name || !phone || !address) {
    alert("Vui lòng nhập đầy đủ thông tin nhận hàng!");
    return;
  }

  // Lấy phương thức thanh toán
  const paymentMethods = document.querySelectorAll('input[name="payment"]');
  let payment = "cod";
  if (paymentMethods[1] && paymentMethods[1].checked) {
    payment = "bank";
  }

  const coupon = getSelectedCoupon();

  // Đọc danh sách đơn hàng để tạo mã ID mới
  const orders = DB.getOrders();
  let maxId = 20; // Default base
  orders.forEach((o) => {
    const num = parseInt(o.id.replace("DH", ""));
    if (!isNaN(num) && num > maxId) maxId = num;
  });
  const newOrderId = `DH${String(maxId + 1).padStart(3, "0")}`;

  // Lấy danh sách sản phẩm đặt hàng để lưu chi tiết đơn hàng
  const products = DB.getProducts();
  const orderItems = checkoutItems.map((item) => {
    const p = products.find((prod) => prod.id === item.productId);
    return {
      productId: item.productId,
      quantity: item.quantity,
      price: p ? p.price : 0
    };
  });

  // Tạo đối tượng đơn hàng mới
  const now = new Date();
  const dateString = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  const grandTotalText = document.getElementById("grandTotal").innerText;
  const grandTotal = parseInt(grandTotalText.replace(/\./g, "").replace("đ", "").trim());

  const newOrder = {
    id: newOrderId,
    customerName: name,
    phone: phone,
    date: dateString,
    total: grandTotal,
    status: "processing",
    payment: payment,
    items: orderItems
  };

  // 1. Lưu đơn hàng mới vào CSDL
  orders.unshift(newOrder); // Đưa lên đầu danh sách
  DB.saveOrders(orders);

  // 2. Trừ tồn kho sản phẩm trong CSDL
  const updatedProducts = products.map((p) => {
    const orderedItem = orderItems.find((item) => item.productId === p.id);
    if (orderedItem) {
      const remainingStock = p.stock - orderedItem.quantity;
      return {
        ...p,
        stock: remainingStock < 0 ? 0 : remainingStock,
        status: remainingStock <= 0 ? "out-stock" : p.status
      };
    }
    return p;
  });
  DB.saveProducts(updatedProducts);

  // 3. Xóa các sản phẩm đã thanh toán khỏi giỏ hàng
  let cart = DB.getCart();
  cart = cart.filter((item) => item.checked === false); // giữ lại các sản phẩm không mua
  DB.saveCart(cart);

  alert(`Đặt hàng thành công!\nMã đơn hàng của bạn là: ${newOrderId}`);
  window.location.href = "index.html";
};

// Khởi chạy khi tải trang
document.addEventListener("DOMContentLoaded", () => {
  initCheckout();
});
