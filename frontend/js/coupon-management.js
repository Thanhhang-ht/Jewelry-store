const API_BASE = "/api";

document.addEventListener("DOMContentLoaded", () => {
    // Kiểm tra quyền Admin
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (!token || user?.role !== "admin") {
        alert("Bạn không có quyền truy cập trang này!");
        window.location.href = "login.html";
        return;
    }

    // Hiển thị tên Admin
    const adminName = document.getElementById("adminName");
    if (adminName && user) {
        adminName.textContent = user.name || "Admin";
    }

    loadCoupons();

    // Xử lý nút tìm kiếm
    const searchBtn = document.getElementById("searchBtn");
    if (searchBtn) {
        searchBtn.addEventListener("click", () => {
            const query = document.getElementById("searchCoupon").value.toLowerCase();
            loadCoupons(query);
        });
    }

    // Xử lý đăng xuất
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "login.html";
        });
    }
});

async function loadCoupons(searchQuery = "") {
    try {
        const res = await fetch(`${API_BASE}/coupons`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        });
        const result = await res.json();
        
        if (result.success) {
            let coupons = result.data;
            if (searchQuery) {
                coupons = coupons.filter(c => c.code.toLowerCase().includes(searchQuery));
            }
            renderCoupons(coupons);
        } else {
            console.error("Lỗi:", result.message);
        }
    } catch (err) {
        console.error("Lỗi kết nối:", err);
    }
}

function renderCoupons(coupons) {
    const tbody = document.getElementById("couponTableBody");
    tbody.innerHTML = "";

    if (coupons.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center;">Không có mã giảm giá nào.</td></tr>`;
        return;
    }

    coupons.forEach(coupon => {
        const typeLabel = coupon.discount_type === "percent" ? "%" : "VNĐ";
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><input type="checkbox" class="coupon-checkbox" value="${coupon.id}"></td>
            <td><strong>${coupon.code}</strong></td>
            <td>${coupon.discount_type === 'fixed' ? Number(coupon.discount_value).toLocaleString() : coupon.discount_value}${typeLabel}</td>
            <td>Đơn từ ${Number(coupon.min_order_value).toLocaleString()}đ</td>
            <td>
                <span class="status-badge ${coupon.status === 'active' ? 'active' : 'inactive'}">
                    ${coupon.status === 'active' ? 'Hoạt động' : 'Đã khóa'}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <a href="coupon-form.html?mode=edit&id=${coupon.id}" class="btn-edit" title="Sửa"><i class="fa-regular fa-pen-to-square"></i></a>
                    <button class="btn-delete" title="Xóa" onclick="deleteCoupon(${coupon.id})"><i class="fa-regular fa-trash-can"></i></button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

async function deleteCoupon(id) {
    if (!confirm("Bạn có chắc chắn muốn xóa mã giảm giá này không?")) return;

    try {
        const res = await fetch(`${API_BASE}/coupons/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        });
        const result = await res.json();
        if (result.success) {
            alert("Xóa thành công!");
            loadCoupons(); // Tải lại danh sách
        } else {
            alert("Lỗi: " + result.message);
        }
    } catch (err) {
        console.error("Lỗi:", err);
        alert("Lỗi kết nối mạng!");
    }
}
