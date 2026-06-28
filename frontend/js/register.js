const API_URL = "http://localhost:3000/api"; // đổi sang backend thật sau

// ==========================
// TOGGLE PASSWORD
// ==========================
const toggles = document.querySelectorAll(".toggle");

toggles.forEach((toggle) => {
  toggle.addEventListener("click", () => {
    const input = toggle.previousElementSibling;

    if (!input) return;

    const isHidden = input.type === "password";
    input.type = isHidden ? "text" : "password";

    toggle.classList.toggle("fa-eye");
    toggle.classList.toggle("fa-eye-slash");
  });
});

// ==========================
// REGISTER FORM
// ==========================
document
  .getElementById("registerForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
      fullName: document.getElementById("fullName").value.trim(),
      email: document.getElementById("email").value.trim(),
      phone: document.getElementById("phone").value.trim(),
      password: document.getElementById("password").value,
      confirmPassword: document.getElementById("confirmPassword").value,
    };

    // ==========================
    // VALIDATION FRONTEND
    // ==========================
    if (Object.values(payload).some((v) => !v)) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if (payload.password.length < 6) {
      alert("Mật khẩu phải từ 6 ký tự");
      return;
    }

    if (payload.password !== payload.confirmPassword) {
      alert("Mật khẩu không khớp");
      return;
    }

    try {
      // ==========================
      // CALL BACKEND
      // ==========================
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Đăng ký thất bại");
      }

      alert("Đăng ký thành công");

      // redirect login
      window.location.href = "login.html";
    } catch (error) {
      alert(error.message);
    }
  });

// ==========================
// GOOGLE REGISTER (OAUTH)
// ==========================
document.getElementById("googleRegister").addEventListener("click", () => {
  window.location.href = `${API_URL}/auth/google`;
});

// ==========================
// FACEBOOK REGISTER (OAUTH)
// ==========================
document.getElementById("facebookRegister").addEventListener("click", () => {
  window.location.href = `${API_URL}/auth/facebook`;
});

// ==========================
// USER MENU (HEADER)
// ==========================
const userIcon = document.getElementById("userIcon");
const userMenu = document.getElementById("userMenu");

if (userIcon && userMenu) {
  userIcon.addEventListener("click", () => {
    userMenu.style.display =
      userMenu.style.display === "flex" ? "none" : "flex";
  });

  document.addEventListener("click", (e) => {
    if (!userIcon.contains(e.target) && !userMenu.contains(e.target)) {
      userMenu.style.display = "none";
    }
  });
}
