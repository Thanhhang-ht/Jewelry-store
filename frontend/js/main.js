const API_URL = "http://localhost:3000/api";

let products = [];

async function loadLatestProducts() {
  try {
    const res = await fetch(`${API_URL}/products`);
    const result = await res.json();
    if (result.success) {
      // Chỉ lấy 4 sản phẩm mới nhất để hiển thị ở trang chủ
      products = result.data.slice(0, 4);
      renderProducts(products);
    }
  } catch (err) {
    console.error("Không thể tải sản phẩm:", err);
  }
}

function renderProducts(list) {
  const container = document.getElementById("productList");
  if (!container) return;

  container.innerHTML = list
    .map(
      (p) => `
    <div class="pro-item" data-id="${p.id}">

      <div class="pro-img">
        <img src="${p.image || '../image/image 24.png'}" alt="${p.name}">
        <i class="fa-regular fa-heart love"></i>
      </div>

      <div class="pro-info">
        <h4>${p.name}</h4>
        <p>${Number(p.price).toLocaleString('vi-VN')}đ</p>
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

function addToCart(productId) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  const product = products.find(p => p.id == productId);
  if (!product) return;
  
  const existingItem = cart.find(item => item.id == productId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
  alert(`Đã thêm "${product.name}" vào giỏ hàng!`);
}

function goToDetail(id) {
  window.location.href = `product-detail.html?id=${id}`;
}

// ======================
// AI CHATBOT - RULE BASED
// ======================

// Cơ sở kiến thức của AI tư vấn trang sức
const chatKnowledge = [
  {
    keywords: ["nhẫn", "mua nhẫn", "tư vấn nhẫn", "nhẫn cưới", "nhẫn đôi", "nhẫn nữ"],
    reply: `💍 <strong>Tư vấn chọn nhẫn:</strong><br>
• <b>Nhẫn đôi/cưới:</b> Nên chọn bạc 925 hoặc bạch kim, đơn giản nhưng tinh tế<br>
• <b>Nhẫn thời trang:</b> Có thể chọn đính đá CZ, thiết kế phong phú<br>
• <b>Size nhẫn:</b> Nữ thường size 5-7, Nam size 8-10<br>
• Giá nhẫn tại shop từ <b>460.000đ – 800.000đ</b><br>
👉 <a href="products.html" style="color:#0c4fb5">Xem tất cả nhẫn tại đây</a>`
  },
  {
    keywords: ["dây chuyền", "vòng cổ", "mua dây chuyền", "tư vấn dây chuyền", "chuỗi"],
    reply: `📿 <strong>Tư vấn chọn dây chuyền:</strong><br>
• <b>Cho mặt dài:</b> Dây chuyền ngắn 40-45cm tạo điểm nhấn<br>
• <b>Cho mặt tròn:</b> Dây chuyền dài 50-60cm giúp kéo dài cổ<br>
• <b>Chất liệu:</b> Bạc 925 bền, không gỉ, phù hợp mặc hàng ngày<br>
• Giá từ <b>495.000đ – 900.000đ</b><br>
👉 <a href="products.html" style="color:#0c4fb5">Khám phá dây chuyền</a>`
  },
  {
    keywords: ["vòng tay", "mua vòng", "tư vấn vòng tay", "lắc tay"],
    reply: `💎 <strong>Tư vấn chọn vòng tay:</strong><br>
• <b>Vòng trơn:</b> Thanh lịch, phù hợp công sở<br>
• <b>Vòng charm:</b> Cá tính, phù hợp dạo phố<br>
• <b>Vòng đôi:</b> Ý nghĩa cho cặp đôi<br>
• Size vòng tay nữ chuẩn: <b>16-17cm</b><br>
• Giá từ <b>510.000đ – 870.000đ</b><br>
👉 <a href="products.html" style="color:#0c4fb5">Xem vòng tay</a>`
  },
  {
    keywords: ["bông tai", "khuyên tai", "hoa tai", "tư vấn bông tai"],
    reply: `✨ <strong>Tư vấn chọn bông tai:</strong><br>
• <b>Mặt tròn:</b> Chọn bông tai dài để thon hơn<br>
• <b>Mặt dài:</b> Bông tai tròn hoặc nút cân đối khuôn mặt<br>
• <b>Dịp đặc biệt:</b> Bông đính đá CZ lấp lánh<br>
• <b>Hàng ngày:</b> Bông nút nhỏ, thanh lịch<br>
• Giá từ <b>430.000đ – 750.000đ</b><br>
👉 <a href="products.html" style="color:#0c4fb5">Xem bông tai</a>`
  },
  {
    keywords: ["bán chạy", "sản phẩm hot", "phổ biến", "nhiều người mua", "bán nhiều nhất", "hot nhất"],
    reply: `🔥 <strong>Sản phẩm bán chạy nhất tại Jewelry Store:</strong><br>
1. 💍 Nhẫn bạc đính đá CZ – bán chạy #1<br>
2. 📿 Dây chuyền bạc nữ – ưa chuộng nhất<br>
3. 💎 Vòng tay bạc đôi – quà tặng số 1<br>
4. ✨ Bông tai ngôi sao – trending hiện tại<br>
👉 <a href="products.html" style="color:#0c4fb5">Xem toàn bộ sản phẩm</a>`
  },
  {
    keywords: ["giá", "bao nhiêu tiền", "giá cả", "chi phí", "mắc không", "rẻ không", "giá tiền"],
    reply: `💰 <strong>Bảng giá tham khảo tại Jewelry Store:</strong><br>
• <b>Nhẫn:</b> 460.000đ – 800.000đ<br>
• <b>Dây chuyền:</b> 495.000đ – 900.000đ<br>
• <b>Vòng tay:</b> 510.000đ – 870.000đ<br>
• <b>Bông tai:</b> 430.000đ – 750.000đ<br>
🎁 Miễn phí vận chuyển cho đơn từ <b>500.000đ</b>`
  },
  {
    keywords: ["chất liệu", "bạc", "bạc 925", "vàng", "platin", "bạch kim", "chất lượng", "bền không"],
    reply: `⚗️ <strong>Thông tin chất liệu trang sức:</strong><br>
• <b>Bạc 925 (Sterling Silver):</b> Bền, sáng bóng, ít gây dị ứng ✅<br>
• <b>Bạc mạ vàng:</b> Sang trọng, giá hợp lý<br>
• <b>Đá CZ (Cubic Zirconia):</b> Lấp lánh như kim cương thật<br>
💡 <b>Mẹo bảo quản:</b> Tránh tiếp xúc nước hoa, mồ hôi; lau khô sau khi đeo`
  },
  {
    keywords: ["quà tặng", "tặng bạn gái", "tặng bạn trai", "tặng vợ", "quà sinh nhật", "quà valentine", "gift", "tặng"],
    reply: `🎁 <strong>Gợi ý quà tặng trang sức:</strong><br>
• <b>Tặng bạn gái/vợ:</b> Dây chuyền tim, nhẫn đính đá, bông tai<br>
• <b>Tặng cặp đôi:</b> Nhẫn đôi, vòng tay đôi charm<br>
• <b>Ngân sách 500k:</b> Nhẫn bạc hoặc bông tai cao cấp<br>
• <b>Ngân sách 1tr+:</b> Set dây chuyền + bông tai đồng bộ<br>
📦 Shop có <b>gói quà miễn phí</b> cho mọi đơn hàng!`
  },
  {
    keywords: ["vận chuyển", "giao hàng", "ship", "bao lâu", "nhận hàng khi nào"],
    reply: `🚚 <strong>Chính sách vận chuyển:</strong><br>
• <b>Nội thành:</b> 1-2 ngày làm việc<br>
• <b>Tỉnh thành khác:</b> 2-4 ngày làm việc<br>
• <b>Phí ship:</b> 30.000đ – Miễn phí cho đơn từ <b>500.000đ</b><br>
• Có thể theo dõi đơn hàng sau khi đặt`
  },
  {
    keywords: ["đổi trả", "bảo hành", "hoàn tiền", "đổi hàng", "lỗi sản phẩm"],
    reply: `🔄 <strong>Chính sách đổi trả & bảo hành:</strong><br>
• <b>Đổi trả miễn phí</b> trong 7 ngày nếu sản phẩm lỗi từ nhà sản xuất<br>
• <b>Bảo hành:</b> 6 tháng cho các sản phẩm tại shop<br>
• <b>Điều kiện:</b> Sản phẩm còn nguyên vẹn, chưa qua chỉnh sửa<br>
📞 Liên hệ hotline để được hỗ trợ nhanh nhất`
  },
  {
    keywords: ["liên hệ", "hotline", "điện thoại", "email", "địa chỉ", "cửa hàng", "ở đâu"],
    reply: `📞 <strong>Thông tin liên hệ Jewelry Store:</strong><br>
• <b>Hotline:</b> 0123 456 789<br>
• <b>Email:</b> support@jewelrystore.vn<br>
• <b>Giờ làm việc:</b> 8:00 – 21:00 (Thứ 2 – Chủ nhật)<br>
• <b>Địa chỉ:</b> 123 Đường Trang Sức, TP.HCM`
  },
  {
    keywords: ["xin chào", "hello", "hi", "chào", "hey", "alo"],
    reply: `👋 Xin chào! Mình là <strong>JewelBot</strong> – trợ lý tư vấn trang sức của Jewelry Store.<br>
Mình có thể tư vấn về: <b>Nhẫn, Dây chuyền, Vòng tay, Bông tai</b>, giá cả, chất liệu, quà tặng...<br>
Bạn cần tư vấn gì hôm nay? 😊`
  },
  {
    keywords: ["cảm ơn", "thanks", "thank you", "cảm ơn bạn", "ok rồi"],
    reply: `😊 Cảm ơn bạn đã tin tưởng <strong>Jewelry Store</strong>!<br>
Chúc bạn tìm được món trang sức ưng ý. 💍✨<br>
Nếu cần tư vấn thêm, mình luôn sẵn sàng!`
  }
];

// Hàm tìm câu trả lời phù hợp
function getBotReply(message) {
  const msg = message.toLowerCase().trim();
  
  for (const item of chatKnowledge) {
    if (item.keywords.some(kw => msg.includes(kw))) {
      return item.reply;
    }
  }
  
  // Trả lời mặc định nếu không nhận ra
  return `🤔 Mình chưa hiểu câu hỏi của bạn. Bạn có thể thử hỏi về:<br>
• <b>Nhẫn, Dây chuyền, Vòng tay, Bông tai</b><br>
• <b>Giá cả, Chất liệu, Bảo hành</b><br>
• <b>Quà tặng, Vận chuyển, Liên hệ</b>`;
}

// Thêm tin nhắn vào cửa sổ chat
function appendBubble(text, role) {
  const chatWindow = document.getElementById("chatWindow");
  if (!chatWindow) return;
  
  const bubble = document.createElement("div");
  bubble.className = `chat-bubble ${role}`;
  bubble.innerHTML = `<span>${text}</span>`;
  chatWindow.appendChild(bubble);
  chatWindow.scrollTop = chatWindow.scrollHeight;
  return bubble;
}

// Gửi tin nhắn nhanh từ nút gợi ý
window.sendQuick = function(text) {
  document.getElementById("msg").value = text;
  chatAI();
};

// Hàm gửi chat chính
async function chatAI() {
  const input = document.getElementById("msg");
  if (!input) return;
  
  const msg = input.value.trim();
  if (!msg) {
    input.focus();
    return;
  }
  
  // Ẩn nút gợi ý sau lần chat đầu tiên
  const quickBtns = document.getElementById("quickBtns");
  if (quickBtns) quickBtns.style.display = "none";
  
  // Hiển thị tin nhắn người dùng
  appendBubble(msg, "user");
  input.value = "";
  input.focus();
  
  // Hiệu ứng "đang nhập..."
  const typingBubble = appendBubble("⏳ Đang xử lý...", "bot typing");
  
  // Giả lập delay 800ms cho chân thực
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Lấy câu trả lời
  const reply = getBotReply(msg);
  
  // Xóa bubble "đang nhập" và hiện câu trả lời thật
  typingBubble.remove();
  appendBubble(reply, "bot");
}


window.onload = () => {
  loadLatestProducts();
};
