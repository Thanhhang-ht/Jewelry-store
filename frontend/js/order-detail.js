// ==========================
// ĐĂNG XUẤT
// ==========================

document.getElementById("logoutBtn").addEventListener("click", (e) => {
  e.preventDefault();

  const confirmLogout = confirm("Bạn có muốn đăng xuất không?");

  if (confirmLogout) {
    localStorage.removeItem("user");
    window.location.href = "login.html";
  }
});

// ==========================
// LẤY MÃ ĐƠN HÀNG TỪ URL
// ==========================

const params = new URLSearchParams(window.location.search);

const orderId = params.get("id");

if (orderId) {
  document.getElementById("orderId").innerText = "#" + orderId;
}
