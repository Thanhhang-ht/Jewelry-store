// ==========================================
// CHANGE PASSWORD - Jewelry Store
// ==========================================
const API_URL = "http://localhost:3000/api";

// ---------- Hiện / Ẩn mật khẩu ----------
document.querySelectorAll(".toggle-password").forEach((icon) => {
  icon.addEventListener("click", () => {
    const input = icon.previousElementSibling;
    if (input.type === "password") {
      input.type = "text";
      icon.classList.replace("fa-eye", "fa-eye-slash");
    } else {
      input.type = "password";
      icon.classList.replace("fa-eye-slash", "fa-eye");
    }
  });
});

// ---------- Đăng xuất ----------
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (!confirm("Bạn có chắc muốn đăng xuất?")) return;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "login.html";
  });
}

// ---------- Form ----------
const form = document.getElementById("passwordForm");
const oldPassword = document.getElementById("oldPassword");
const newPassword = document.getElementById("newPassword");
const confirmPassword = document.getElementById("confirmPassword");
const oldError = document.getElementById("oldError");
const newError = document.getElementById("newError");
const confirmError = document.getElementById("confirmError");

// ---------- Xóa lỗi ----------
function clearError() {
  oldError.textContent = "";
  newError.textContent = "";
  confirmError.textContent = "";
}

// ---------- Validate ----------
function validate() {
  clearError();
  let valid = true;

  if (oldPassword.value.trim() === "") {
    oldError.textContent = "Vui lòng nhập mật khẩu hiện tại.";
    valid = false;
  }

  if (newPassword.value.trim() === "") {
    newError.textContent = "Vui lòng nhập mật khẩu mới.";
    valid = false;
  } else if (newPassword.value.length < 6) {
    newError.textContent = "Mật khẩu phải có ít nhất 6 ký tự.";
    valid = false;
  }

  if (confirmPassword.value.trim() === "") {
    confirmError.textContent = "Vui lòng xác nhận mật khẩu.";
    valid = false;
  }

  if (confirmPassword.value && newPassword.value !== confirmPassword.value) {
    confirmError.textContent = "Mật khẩu xác nhận không khớp.";
    valid = false;
  }

  if (oldPassword.value && newPassword.value && oldPassword.value === newPassword.value) {
    newError.textContent = "Mật khẩu mới phải khác mật khẩu hiện tại.";
    valid = false;
  }

  return valid;
}

// ---------- Submit ----------
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!validate()) return;

  const data = {
    oldPassword: oldPassword.value.trim(),
    newPassword: newPassword.value.trim()
  };

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Bạn chưa đăng nhập!");
      window.location.href = "login.html";
      return;
    }

    const response = await fetch(`${API_URL}/auth/change-password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!result.success) {
      alert(result.message);
      return;
    }

    alert(result.message);
    form.reset();

  } catch (error) {
    console.error("Lỗi:", error);
    alert("Không thể kết nối máy chủ.");
  }
});
