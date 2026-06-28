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
// LOGIN FUNCTION (FRONTEND MOCK + BACKEND READY)
// ============================

function login() {
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  const email = emailInput ? emailInput.value.trim() : "";
  const password = passwordInput ? passwordInput.value.trim() : "";

  // validate basic
  if (!email || !password) {
    alert("Vui lòng nhập đầy đủ thông tin");
    return;
  }

  // ============================
  // BACKEND READY (API LOGIN)
  // ============================
  /*
  fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: email,
      password: password
    })
  })
  .then(res => res.json())
  .then(data => {
    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      window.location.href = "/index.html";
    } else {
      alert("Đăng nhập thất bại");
    }
  })
  .catch(err => {
    console.error(err);
    alert("Lỗi hệ thống");
  });
  */

  // mock login (FE only)
  alert("Đăng nhập thành công!");
  window.location.href = "index.html";
}

// ============================
// USER MENU DROPDOWN (SHOPEE STYLE)
// ============================

const userIcon = document.getElementById("userIcon");
const userMenu = document.getElementById("userMenu");

if (userIcon && userMenu) {
  userIcon.addEventListener("click", (e) => {
    e.stopPropagation();

    userMenu.style.display =
      userMenu.style.display === "flex" ? "none" : "flex";
  });

  document.addEventListener("click", (e) => {
    if (!userIcon.contains(e.target) && !userMenu.contains(e.target)) {
      userMenu.style.display = "none";
    }
  });
}

// ============================
// AUTO CHECK LOGIN STATE (FOR FUTURE BACKEND)
// ============================

function checkLoginState() {
  const token = localStorage.getItem("token");

  // sau này backend sẽ dùng JWT
  if (token) {
    console.log("User already logged in");
  }
}

checkLoginState();
// ============================
// SOCIAL LOGIN (GOOGLE / FACEBOOK)
// ============================

const googleBtn = document.querySelector(".google");
const facebookBtn = document.querySelector(".facebook");

if (googleBtn) {
  googleBtn.addEventListener("click", () => {
    // Sau này thay bằng OAuth Google
    alert("Đăng nhập bằng Google (demo FE)");

    // backend sau này:
    // window.location.href = "/api/auth/google";
  });
}

if (facebookBtn) {
  facebookBtn.addEventListener("click", () => {
    // Sau này thay bằng OAuth Facebook
    alert("Đăng nhập bằng Facebook (demo FE)");

    // backend sau này:
    // window.location.href = "/api/auth/facebook";
  });
}
const forgotPassword = document.getElementById("forgotPassword");

forgotPassword.addEventListener("click", (e) => {
  e.preventDefault();

  const email = prompt("Nhập email để khôi phục mật khẩu:");

  if (!email) return;

  alert(
    `Đã ghi nhận yêu cầu khôi phục mật khẩu cho ${email}.\nChức năng sẽ hoạt động khi tích hợp Backend.`
  );
});
