const API_URL = "http://localhost:3000/api";

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
const registerForm = document.getElementById("registerForm");
if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const payload = {
          fullname: document.getElementById("fullName").value.trim(),
          email: document.getElementById("email").value.trim(),
          phone: document.getElementById("phone").value.trim(),
          password: document.getElementById("password").value,
          confirmPassword: document.getElementById("confirmPassword").value,
        };

        if (!payload.fullname || !payload.email || !payload.phone || !payload.password || !payload.confirmPassword) {
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
          const res = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });

          const data = await res.json();

          if (!data.success) {
            throw new Error(data.message || "Đăng ký thất bại");
          }

          alert("Đăng ký thành công! Vui lòng đăng nhập.");
          window.location.href = "login.html";
        } catch (error) {
          alert(error.message);
        }
    });
}

// ==========================
// OAUTH
// ==========================
const googleRegister = document.getElementById("googleRegister");
if (googleRegister) {
    googleRegister.addEventListener("click", () => {
    alert("Đăng ký bằng Google (Chưa cấu hình API)");
    });
}

const facebookRegister = document.getElementById("facebookRegister");
if (facebookRegister) {
    facebookRegister.addEventListener("click", () => {
    alert("Đăng ký bằng Facebook (Chưa cấu hình API)");
    });
}
