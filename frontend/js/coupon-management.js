const API_BASE = "/api";

let allCouponsList = [];

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

    // Xử lý tìm kiếm
    const searchInput = document.getElementById("searchCoupon");
    if (searchInput) {
        searchInput.addEventListener("input", filterAndRenderCoupons);
    }

    const searchBtn = document.getElementById("searchBtn");
    if (searchBtn) {
        searchBtn.addEventListener("click", filterAndRenderCoupons);
    }

    // Xử lý lọc theo trạng thái
    const statusFilter = document.getElementById("statusFilter");
    if (statusFilter) {
        statusFilter.addEventListener("change", filterAndRenderCoupons);
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

async function loadCoupons() {
    try {
        const res = await fetch(`${API_BASE}/coupons`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        });
        const result = await res.json();
        
        if (result.success) {
            allCouponsList = result.data || [];
            updateStatsSummary(allCouponsList);
            filterAndRenderCoupons();
        } else {
            console.error("Lỗi:", result.message);
        }
    } catch (err) {
        console.error("Lỗi kết nối:", err);
    }
}

function updateStatsSummary(coupons) {
    const totalEl = document.getElementById("statTotal");
    const activeEl = document.getElementById("statActive");
    const percentEl = document.getElementById("statPercent");
    const fixedEl = document.getElementById("statFixed");

    if (totalEl) totalEl.textContent = coupons.length;
    if (activeEl) activeEl.textContent = coupons.filter(c => c.status === 'active').length;
    if (percentEl) percentEl.textContent = coupons.filter(c => c.discount_type === 'percent').length;
    if (fixedEl) fixedEl.textContent = coupons.filter(c => c.discount_type === 'fixed').length;
}

function filterAndRenderCoupons() {
    const searchQuery = (document.getElementById("searchCoupon")?.value || "").toLowerCase().trim();
    const statusVal = document.getElementById("statusFilter")?.value || "all";

    let filtered = allCouponsList.filter(c => {
        const matchSearch = c.code.toLowerCase().includes(searchQuery);
        const matchStatus = statusVal === "all" || c.status === statusVal;
        return matchSearch && matchStatus;
    });

    renderCoupons(filtered);
}

function formatDate(dateStr) {
    if (!dateStr) return "Không thời hạn";
    try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        return d.toLocaleDateString("vi-VN", { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch (e) {
        return dateStr;
    }
}

function renderCoupons(coupons) {
    const tbody = document.getElementById("couponTableBody");
    if (!tbody) return;
    tbody.innerHTML = "";

    if (coupons.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 40px 20px; color: #64748b;">
                    <i class="fa-solid fa-ticket" style="font-size: 32px; color: #cbd5e1; margin-bottom: 10px; display: block;"></i>
                    Không tìm thấy mã giảm giá nào.
                </td>
            </tr>`;
        return;
    }

    coupons.forEach(coupon => {
        const isPercent = coupon.discount_type === "percent";
        const valText = isPercent ? `${coupon.discount_value}%` : `${Number(coupon.discount_value).toLocaleString('vi-VN')}đ`;
        const minOrderText = Number(coupon.min_order_value) > 0 
            ? `Đơn từ ${Number(coupon.min_order_value).toLocaleString('vi-VN')}đ` 
            : "Mọi đơn hàng";

        const startDateFormatted = formatDate(coupon.start_date);
        const endDateFormatted = formatDate(coupon.end_date);
        const dateRangeText = `${startDateFormatted} - ${endDateFormatted}`;

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><input type="checkbox" class="coupon-checkbox" value="${coupon.id}"></td>
            <td>
                <div class="coupon-ticket-badge">
                    <i class="fa-solid fa-ticket"></i>
                    <span>${coupon.code}</span>
                </div>
            </td>
            <td>
                <span class="discount-value-badge ${isPercent ? 'percent' : 'fixed'}">
                    ${isPercent ? '🔥 Giảm ' : '💰 Giảm '}${valText}
                </span>
            </td>
            <td><strong>${minOrderText}</strong></td>
            <td style="font-size: 13px; color: #64748b;"><i class="fa-regular fa-calendar-days"></i> ${dateRangeText}</td>
            <td>
                <span class="status-pill ${coupon.status === 'active' ? 'active' : 'inactive'}">
                    ${coupon.status === 'active' ? '● Hoạt động' : '○ Đã khóa'}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <a href="coupon-form.html?mode=edit&id=${coupon.id}" class="action-btn btn-edit" title="Chỉnh sửa">
                        <i class="fa-regular fa-pen-to-square"></i> Sửa
                    </a>
                    <button class="action-btn btn-delete" title="Xóa" onclick="deleteCoupon(${coupon.id})">
                        <i class="fa-regular fa-trash-can"></i> Xóa
                    </button>
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

