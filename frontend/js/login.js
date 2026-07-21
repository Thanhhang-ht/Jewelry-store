const API_URL = "/api";

// ============================
// TOGGLE PASSWORD VISIBILITY
// ============================
const togglePassword = document.getElementById("togglePassword");
const password = document.getElementById("password");

if (togglePassword && password) {
  togglePassword.addEventListener("click", () => {
    const isHidden = password.type === "password";
    password.type = isHidden ? "text" : "password";
    togglePassword.classList.toggle("fa-eye");
    togglePassword.classList.toggle("fa-eye-slash");
  });
}

// ============================
// LOGIN FUNCTION (API)
// ============================
async function login() {
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  const email = emailInput ? emailInput.value.trim() : "";
  const password = passwordInput ? passwordInput.value.trim() : "";

  if (!email || !password) {
    alert("Vui lòng nhập đầy đủ thông tin");
    return;
  }

  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });
    
    const data = await res.json();
    
    if (data.success) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      alert("Đăng nhập thành công!");
      
      // Chuyển hướng theo role
      if (data.user.role === "admin") {
        window.location.href = "dashboard.html";
      } else {
        window.location.href = "index.html";
      }
    } else {
      alert(data.message || "Đăng nhập thất bại");
    }
  } catch (err) {
    console.error(err);
    alert("Lỗi kết nối máy chủ");
  }
}

// ============================
// USER MENU DROPDOWN
// ============================
const userIcon = document.getElementById("userIcon");
const userMenu = document.getElementById("userMenu");

if (userIcon && userMenu) {
  userIcon.addEventListener("click", (e) => {
    e.stopPropagation();
    userMenu.style.display = userMenu.style.display === "flex" ? "none" : "flex";
  });

  document.addEventListener("click", (e) => {
    if (!userIcon.contains(e.target) && !userMenu.contains(e.target)) {
      userMenu.style.display = "none";
    }
  });
}

// ============================
// OAUTH MOCK
// ============================
const googleBtn = document.querySelector(".google");
const facebookBtn = document.querySelector(".facebook");

if (googleBtn) {
  googleBtn.addEventListener("click", () => {
    alert("Đăng nhập bằng Google (Chưa cấu hình API)");
  });
}

if (facebookBtn) {
  facebookBtn.addEventListener("click", () => {
    alert("Đăng nhập bằng Facebook (Chưa cấu hình API)");
  });
}

const forgotPassword = document.getElementById("forgotPassword");
if (forgotPassword) {
    forgotPassword.addEventListener("click", (e) => {
    e.preventDefault();
    const email = prompt("Nhập email để khôi phục mật khẩu:");
    if (!email) return;
    alert(`Đã ghi nhận yêu cầu khôi phục mật khẩu cho ${email}.`);
    });
}
