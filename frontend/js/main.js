const API_URL = "/api";

let products = [];
let allStoreProducts = []; // Lưu toàn bộ sản phẩm trong CSDL để AI tra cứu

async function loadLatestProducts() {
  try {
    const res = await fetch(`${API_URL}/products`);
    const result = await res.json();
    if (result.success) {
      allStoreProducts = result.data; // Lưu toàn bộ sản phẩm cho AI
      // Chỉ lấy 4 sản phẩm mới nhất để hiển thị ở danh sách trang chủ
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
  
  const product = allStoreProducts.find(p => p.id == productId) || products.find(p => p.id == productId);
  if (!product) return;
  
  const existingItem = cart.find(item => item.id == productId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
  alert(`🎉 Đã thêm "${product.name}" vào giỏ hàng!`);
}

function goToDetail(id) {
  window.location.href = `product-detail.html?id=${id}`;
}

// ===============================================
// AI CHATBOT TƯ VẤN THÔNG MINH (SMART AI ASSISTANT)
// ===============================================

// Hàm tạo HTML hiển thị danh sách sản phẩm mini ngay trong Bong bóng Chat AI
function renderChatProductCards(productList) {
  if (!productList || productList.length === 0) return "";
  
  const itemsHtml = productList.slice(0, 3).map(p => `
    <div class="chat-product-item">
      <img src="${p.image || '../image/image 24.png'}" alt="${p.name}">
      <div class="chat-product-info">
        <h5>${p.name}</h5>
        <p>${Number(p.price).toLocaleString('vi-VN')}đ</p>
      </div>
      <div class="chat-product-actions">
        <button class="view-btn" onclick="goToDetail(${p.id})">Xem</button>
        <button class="add-btn" onclick="addToCart(${p.id})">+ Giỏ</button>
      </div>
    </div>
  `).join("");

  return `<div class="chat-product-list">${itemsHtml}</div>`;
}

// Xử lý câu trả lời của AI dựa trên dữ liệu thực tế
function getBotReply(message) {
  const msg = message.toLowerCase().trim();
  
  // 1. Tra cứu Giá tiền (dưới X, trên X, khoảng X)
  if (msg.includes("dưới") || msg.includes("rẻ") || msg.includes("<") || msg.includes("thấp hơn")) {
    let maxPrice = 500000;
    if (msg.includes("600") || msg.includes("600k")) maxPrice = 600000;
    if (msg.includes("700") || msg.includes("700k")) maxPrice = 700000;
    if (msg.includes("800") || msg.includes("800k")) maxPrice = 800000;
    if (msg.includes("1 triệu") || msg.includes("1tr") || msg.includes("1000k")) maxPrice = 1000000;
    
    const matched = allStoreProducts.filter(p => Number(p.price) <= maxPrice);
    if (matched.length > 0) {
      return `💰 <strong>Các sản phẩm có giá dưới ${maxPrice.toLocaleString('vi-VN')}đ:</strong><br>
Đây là một số mẫu trang sức ngân sách tiết kiệm dành cho bạn:` + renderChatProductCards(matched);
    }
  }

  // 2. Tra cứu Nhẫn
  if (msg.includes("nhẫn") || msg.includes("ring")) {
    const matched = allStoreProducts.filter(p => p.name.toLowerCase().includes("nhẫn") || (p.category && p.category.name && p.category.name.toLowerCase().includes("nhẫn")));
    return `💍 <strong>Gợi ý các mẫu Nhẫn đẹp nhất:</strong><br>
• <b>Chất liệu:</b> Bạc 925 chuẩn cao cấp, đính đá CZ lấp lánh<br>
• <b>Size nhẫn:</b> Nữ thường từ size 5-7, Nam từ size 8-10` + renderChatProductCards(matched.length > 0 ? matched : allStoreProducts.slice(0, 2));
  }

  // 3. Tra cứu Dây chuyền
  if (msg.includes("dây chuyền") || msg.includes("vòng cổ") || msg.includes("dây")) {
    const matched = allStoreProducts.filter(p => p.name.toLowerCase().includes("dây chuyền") || (p.category && p.category.name && p.category.name.toLowerCase().includes("dây chuyền")));
    return `📿 <strong>Gợi ý Dây chuyền hot nhất:</strong><br>
• Design mảnh mai, thanh lịch phù hợp đeo hàng ngày và làm quà tặng` + renderChatProductCards(matched.length > 0 ? matched : allStoreProducts.slice(0, 2));
  }

  // 4. Tra cứu Vòng tay / Lắc tay
  if (msg.includes("vòng tay") || msg.includes("lắc tay") || msg.includes("vòng")) {
    const matched = allStoreProducts.filter(p => p.name.toLowerCase().includes("vòng") || (p.category && p.category.name && p.category.name.toLowerCase().includes("vòng")));
    return `💎 <strong>Gợi ý Vòng tay & Lắc tay:</strong><br>
• Tôn lên nét thon gọn và nữ tính cho cổ tay` + renderChatProductCards(matched.length > 0 ? matched : allStoreProducts.slice(0, 2));
  }

  // 5. Tra cứu Bông tai / Khuyên tai
  if (msg.includes("bông tai") || msg.includes("khuyên tai") || msg.includes("hoa tai")) {
    const matched = allStoreProducts.filter(p => p.name.toLowerCase().includes("bông tai") || (p.category && p.category.name && p.category.name.toLowerCase().includes("bông tai")));
    return `✨ <strong>Gợi ý Bông tai xinh xắn:</strong><br>
• Thiết kế nụ lấp lánh, nhẹ nhàng và quý phái` + renderChatProductCards(matched.length > 0 ? matched : allStoreProducts.slice(0, 2));
  }

  // 6. Sản phẩm bán chạy / Hot / Mới
  if (msg.includes("bán chạy") || msg.includes("hot") || msg.includes("nổi bật") || msg.includes("mới")) {
    return `🔥 <strong>Top các sản phẩm trang sức hot nhất hiện nay:</strong>` + renderChatProductCards(allStoreProducts.slice(0, 3));
  }

  // 7. Tư vấn Quà tặng
  if (msg.includes("quà") || msg.includes("tặng") || msg.includes("bạn gái") || msg.includes("sinh nhật") || msg.includes("valentine")) {
    return `🎁 <strong>Gợi ý quà tặng trang sức ý nghĩa:</strong><br>
• <b>Tặng bạn gái/vợ:</b> Dây chuyền tim, Nhẫn bạc đính đá, Bông tai<br>
• <b>Gói quà:</b> Shop hỗ trợ hộp quà miễn phí cho mọi đơn hàng!` + renderChatProductCards(allStoreProducts.slice(0, 3));
  }

  // 8. Chất liệu & Bảo quản
  if (msg.includes("chất liệu") || msg.includes("bạc") || msg.includes("bền") || msg.includes("gỉ") || msg.includes("phai")) {
    return `⚗️ <strong>Thông tin chất liệu & Bảo quản:</strong><br>
• <b>Chất liệu:</b> Bạc 925 (Sterling Silver) cao cấp sáng bóng, kháng khuẩn, không gỉ ✅<br>
• <b>Đá trang trí:</b> Đá Cubic Zirconia (CZ) tán sắc lấp lánh chuẩn kim cương<br>
💡 <b>Mẹo bảo quản:</b> Tránh dính nước hoa/hóa chất, lau khô bằng khăn mềm sau khi đeo.`;
  }

  // 9. Vận chuyển & Phí ship
  if (msg.includes("ship") || msg.includes("giao hàng") || msg.includes("vận chuyển") || msg.includes("bao lâu")) {
    return `🚚 <strong>Chính sách giao hàng:</strong><br>
• <b>Thời gian:</b> 1-2 ngày (Nội thành), 2-4 ngày (Tỉnh thành khác)<br>
• <b>Phí ship:</b> 30.000đ – <b>Miễn phí ship</b> cho đơn từ 500.000đ!`;
  }

  // 10. Bảo hành & Đổi trả
  if (msg.includes("bảo hành") || msg.includes("đổi trả") || msg.includes("lỗi")) {
    return `🔄 <strong>Chính sách Bảo hành & Đổi trả:</strong><br>
• <b>Bảo hành:</b> 6 tháng cho toàn bộ sản phẩm tại cửa hàng<br>
• <b>Đổi trả:</b> Miễn phí 1 đổi 1 trong 7 ngày nếu lỗi từ nhà sản xuất.`;
  }

  // 11. Xin chào / Cảm ơn / Liên hệ
  if (msg.includes("chào") || msg.includes("hi") || msg.includes("hello")) {
    return `👋 Xin chào! Mình là <strong>JewelBot</strong> – trợ lý tư vấn trang sức thông minh.<br>
Bạn đang tìm <b>Nhẫn, Dây chuyền, Vòng tay</b> hay cần chọn quà tặng? Cho mình biết nhu cầu nhé! 😊`;
  }

  if (msg.includes("cảm ơn") || msg.includes("thanks") || msg.includes("ok")) {
    return `😊 Rất vui được hỗ trợ bạn! Chúc bạn chọn được món trang sức ưng ý tại <strong>Jewelry Store</strong>. 💎✨`;
  }

  // 12. Tìm kiếm linh hoạt theo từ khóa trong toàn bộ tên sản phẩm
  const matchedKeywords = allStoreProducts.filter(p => 
    p.name.toLowerCase().includes(msg) || 
    (p.material && p.material.toLowerCase().includes(msg)) ||
    (p.description && p.description.toLowerCase().includes(msg))
  );

  if (matchedKeywords.length > 0) {
    return `🔍 <strong>Tìm thấy các sản phẩm phù hợp với "${message}":</strong>` + renderChatProductCards(matchedKeywords);
  }

  // Trả về mặc định linh hoạt kèm gợi ý sản phẩm
  return `🤔 Mình tìm thấy một số mẫu trang sức nổi bật nhất có thể bạn sẽ thích:` + renderChatProductCards(allStoreProducts.slice(0, 2));
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
  const typingBubble = appendBubble("⏳ JewelBot đang tìm kiếm...", "bot typing");
  
  // Giả lập delay 700ms cho chân thực
  await new Promise(resolve => setTimeout(resolve, 700));
  
  // Lấy câu trả lời
  const reply = getBotReply(msg);
  
  // Xóa bubble "đang nhập" và hiện câu trả lời thật
  typingBubble.remove();
  appendBubble(reply, "bot");
}

window.onload = () => {
  loadLatestProducts();
};
