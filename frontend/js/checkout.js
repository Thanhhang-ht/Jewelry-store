// =========================================
// CHECKOUT - KẾT NỐI API THỰC TẾ
// Lấy giỏ hàng từ localStorage,
// mã giảm giá từ /api/coupons/active,
// đặt hàng qua POST /api/orders
// =========================================

const API_URL = "http://localhost:3000/api";

let subtotal = 0;
const shippingFee = 30000;
let checkoutItems = []; // Các sản phẩm được tích chọn từ giỏ hàng

function formatMoney(value) {
  return Number(value).toLocaleString("vi-VN") + "đ";
}

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function getSelectedCoupon() {
  return document.querySelector('input[name="coupon"]:checked');
}

// ============================
// KHỞI TẠO TRANG THANH TOÁN
// ============================
async function initCheckout() {
  const container = document.getElementById("checkoutProducts");
  if (!container) return;

  const cart = getCart();

  // Chỉ lấy những sản phẩm được tích chọn
  checkoutItems = cart.filter((item) => item.checked !== false);

  if (checkoutItems.length === 0) {
    alert("Bạn chưa chọn sản phẩm nào để thanh toán!");
    window.location.href = "cart.html";
    return;
  }

  // Tính tổng tiền & Render danh sách sản phẩm
  subtotal = 0;
  container.innerHTML = checkoutItems
    .map((item) => {
      const price = Number(item.price);
      subtotal += price * item.quantity;

      return `
      <div class="summary-product" data-id="${item.id}" style="display: flex; gap: 15px; margin-bottom: 15px; align-items: center;">
        <img src="${item.image || "../image/image 24.png"}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 5px;">
        <div style="flex-grow: 1;">
          <h3 style="font-size: 0.95rem; margin-bottom: 3px; color: #333;">${item.name}</h3>
          <p style="font-size: 0.85rem; color: #888;">${formatMoney(price)} / cái</p>
          <span style="font-size: 0.85rem; color: #666; font-weight: bold;">SL: ${item.quantity} → ${formatMoney(price * item.quantity)}</span>
        </div>
      </div>
    `;
    })
    .join("");

  document.getElementById("subtotal").innerText = formatMoney(subtotal);

  // Điền thông tin khách hàng nếu đã đăng nhập
  prefillUserInfo();

  // Load mã giảm giá từ API
  await loadCoupons();

  updateTotal();
}

// ============================
// ĐIỀN SẴN THÔNG TIN KHÁCH
// ============================
function prefillUserInfo() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  if (user.fullname) {
    const fullnameEl = document.getElementById("fullname");
    if (fullnameEl && !fullnameEl.value) fullnameEl.value = user.fullname;
  }
  if (user.phone) {
    const phoneEl = document.getElementById("phone");
    if (phoneEl && !phoneEl.value) phoneEl.value = user.phone;
  }
}

// ============================
// LOAD MÃ GIẢM GIÁ TỪ API
// ============================
async function loadCoupons() {
  const container = document.querySelector(".coupon-list");
  if (!container) return;

  try {
    const res = await fetch(`${API_URL}/coupons/active`);
    const result = await res.json();

    let html = "";
    if (result.success && result.data.length > 0) {
      html = result.data
        .map((c) => {
          const descText =
            c.discount_type === "percent"
              ? `Giảm ${c.discount_value}% đơn hàng`
              : `Giảm ${Number(c.discount_value).toLocaleString()}đ`;
          const minText = `Đơn tối thiểu ${Number(c.min_order_value || 0).toLocaleString()}đ`;
          const isDisabled = subtotal < Number(c.min_order_value);
          const disabledAttr = isDisabled ? "disabled" : "";
          const couponStyle = isDisabled
            ? "opacity: 0.5; cursor: not-allowed;"
            : "cursor: pointer;";
          const endDate = new Date(c.end_date).toLocaleDateString("vi-VN");

          return `
          <label class="coupon" style="${couponStyle}">
            <input type="radio" name="coupon" value="${c.code}"
              data-type="${c.discount_type}"
              data-value="${c.discount_value}"
              data-max="${c.max_discount_value || 0}"
              data-min="${c.min_order_value}"
              ${disabledAttr}>
            <h3>${c.code}</h3>
            <p>${descText}</p>
            <small>${minText}</small>
            <span>HSD: ${endDate}</span>
          </label>
        `;
        })
        .join("");
    }

    // Thêm lựa chọn "Không dùng mã"
    html += `
      <label class="coupon" style="cursor: pointer;">
        <input type="radio" name="coupon" value="NONE" data-type="none" data-value="0" data-max="0" data-min="0" checked>
        <h3>Không sử dụng mã</h3>
        <p>Không áp dụng giảm giá</p>
      </label>
    `;

    container.innerHTML = html;

    // Gắn sự kiện thay đổi mã giảm giá
    document.querySelectorAll('input[name="coupon"]').forEach((radio) => {
      radio.addEventListener("change", updateTotal);
    });
  } catch (err) {
    console.error("Lỗi tải mã giảm giá:", err);
    container.innerHTML = `
      <label class="coupon" style="cursor: pointer;">
        <input type="radio" name="coupon" value="NONE" data-type="none" data-value="0" data-max="0" data-min="0" checked>
        <h3>Không sử dụng mã</h3>
      </label>
    `;
  }
}

// ============================
// TÍNH TOÁN LẠI TỔNG TIỀN
// ============================
function updateTotal() {
  const coupon = getSelectedCoupon();
  if (!coupon) return;

  let discount = 0;
  let shipping = subtotal >= 500000 ? 0 : shippingFee;

  const type = coupon.dataset.type;
  const value = Number(coupon.dataset.value);
  const maxDiscount = Number(coupon.dataset.max);

  if (type === "percent") {
    discount = (subtotal * value) / 100;
    if (maxDiscount > 0 && discount > maxDiscount) {
      discount = maxDiscount;
    }
  } else if (type === "fixed") {
    discount = value;
  }

  if (discount > subtotal) discount = subtotal;

  const total = subtotal - discount + shipping;

  const discountNameEl = document.getElementById("discountName");
  const discountValueEl = document.getElementById("discountValue");
  const shippingEl = document.getElementById("shipping");
  const grandTotalEl = document.getElementById("grandTotal");

  if (discountNameEl)
    discountNameEl.innerText =
      coupon.value === "NONE" ? "Giảm giá" : `Giảm giá (${coupon.value})`;
  if (discountValueEl) discountValueEl.innerText = "-" + formatMoney(discount);
  if (shippingEl)
    shippingEl.innerText = shipping === 0 ? "Miễn phí" : formatMoney(shipping);
  if (grandTotalEl) grandTotalEl.innerText = formatMoney(total);
}

// ============================
// ĐẶT HÀNG → GỬI LÊN BACKEND
// ============================
window.placeOrder = async function () {
  const name = document.getElementById("fullname")?.value.trim();
  const phone = document.getElementById("phone")?.value.trim();
  const address = document.getElementById("address")?.value.trim();
  const note = document.getElementById("note")?.value.trim() || "";

  if (!name || !phone || !address) {
    alert("Vui lòng nhập đầy đủ thông tin nhận hàng!");
    return;
  }

  // Lấy phương thức thanh toán
  const paymentInputs = document.querySelectorAll('input[name="payment"]');
  let payment = "cod";
  paymentInputs.forEach((input) => {
    if (input.checked) payment = input.value;
  });

  // Lấy mã giảm giá đang chọn
  const coupon = getSelectedCoupon();
  const coupon_code = coupon && coupon.value !== "NONE" ? coupon.value : "NONE";

  // Chuẩn bị danh sách sản phẩm đặt hàng
  const items = checkoutItems.map((item) => ({
    productId: item.id,
    quantity: item.quantity,
  }));

  // Tổng tiền thực tế (parse từ giao diện)
  const grandTotalText = document.getElementById("grandTotal")?.innerText || "0";
  const grandTotal = parseInt(
    grandTotalText.replace(/\./g, "").replace("đ", "").trim()
  );

  // Gửi request đặt hàng lên Backend
  try {
    const orderBtn = document.getElementById("orderBtn");
    if (orderBtn) {
      orderBtn.disabled = true;
      orderBtn.innerText = "Đang xử lý...";
    }

    const token = localStorage.getItem("token");
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        customer_name: name,
        phone,
        shipping_address: address,
        payment_method: payment,
        note,
        coupon_code,
        items,
      }),
    });

    const result = await res.json();

    if (result.success) {
      // Xóa các sản phẩm đã thanh toán khỏi giỏ hàng
      let cart = getCart();
      const checkedIds = checkoutItems.map((item) => item.id);
      cart = cart.filter((item) => !checkedIds.includes(item.id));
      saveCart(cart);

      alert(
        `🎉 Đặt hàng thành công!\nMã đơn hàng của bạn: ${result.data.orderCode}\nTổng thanh toán: ${Number(result.data.totalPrice).toLocaleString("vi-VN")}đ`
      );
      window.location.href = "index.html";
    } else {
      alert("Lỗi đặt hàng: " + result.message);
      if (orderBtn) {
        orderBtn.disabled = false;
        orderBtn.innerText = "Đặt hàng";
      }
    }
  } catch (err) {
    console.error(err);
    alert("Có lỗi xảy ra khi kết nối máy chủ. Vui lòng thử lại!");
    const orderBtn = document.getElementById("orderBtn");
    if (orderBtn) {
      orderBtn.disabled = false;
      orderBtn.innerText = "Đặt hàng";
    }
  }
};

// Khởi chạy khi tải trang
document.addEventListener("DOMContentLoaded", () => {
  initCheckout();
});
