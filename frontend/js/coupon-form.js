const API_BASE = "/api";

document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get("mode");
    const id = urlParams.get("id");

    const form = document.getElementById("couponForm");
    const pageTitle = document.getElementById("pageTitle");

    // Thêm các trường vào form HTML
    setupFormFields();

    if (mode === "edit" && id) {
        pageTitle.textContent = "Sửa mã giảm giá";
        loadCouponData(id);
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const couponData = {
            code: document.getElementById("couponCode").value,
            discount_type: document.getElementById("discountType").value,
            discount_value: document.getElementById("discountValue").value,
            min_order_value: document.getElementById("minOrderValue").value,
            start_date: document.getElementById("startDate").value,
            end_date: document.getElementById("endDate").value,
            status: document.getElementById("status").value
        };

        try {
            const url = mode === "edit" ? `${API_BASE}/coupons/${id}` : `${API_BASE}/coupons`;
            const method = mode === "edit" ? "PUT" : "POST";

            const res = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(couponData)
            });

            const result = await res.json();
            if (result.success) {
                alert(mode === "edit" ? "Cập nhật thành công!" : "Thêm mới thành công!");
                window.location.href = "coupon-management.html";
            } else {
                alert("Lỗi: " + result.message);
            }
        } catch (err) {
            console.error("Lỗi:", err);
            alert("Đã xảy ra lỗi, vui lòng thử lại!");
        }
    });
});

function setupFormFields() {
    const formGroupContainer = document.querySelector(".form-left");
    formGroupContainer.innerHTML = `
        <div class="form-group">
            <label for="couponCode">Mã giảm giá (Code) <span class="required">*</span></label>
            <input type="text" id="couponCode" required placeholder="Ví dụ: SUMMER50, WELCOME20">
        </div>
        <div class="form-group">
            <label for="discountType">Loại giảm giá</label>
            <select id="discountType">
                <option value="fixed">Cố định (VNĐ)</option>
                <option value="percent">Phần trăm (%)</option>
            </select>
        </div>
        <div class="form-group">
            <label for="discountValue">Giá trị giảm <span class="required">*</span></label>
            <input type="number" id="discountValue" required placeholder="Ví dụ: 50000 hoặc 10">
        </div>
        <div class="form-group">
            <label for="minOrderValue">Giá trị đơn hàng tối thiểu</label>
            <input type="number" id="minOrderValue" value="0" required>
        </div>
    `;

    const formRightContainer = document.querySelector(".form-right");
    formRightContainer.innerHTML = `
        <div class="form-section">
            <h3>Thời gian áp dụng</h3>
            <div class="form-group">
                <label for="startDate">Ngày bắt đầu</label>
                <input type="date" id="startDate" required>
            </div>
            <div class="form-group">
                <label for="endDate">Ngày kết thúc</label>
                <input type="date" id="endDate" required>
            </div>
        </div>
        <div class="form-section">
            <h3>Trạng thái</h3>
            <div class="form-group">
                <label for="status">Hiển thị</label>
                <select id="status">
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Khóa</option>
                </select>
            </div>
        </div>
    `;
}

async function loadCouponData(id) {
    try {
        const res = await fetch(`${API_BASE}/coupons`, {
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        });
        const result = await res.json();
        if (result.success) {
            const coupon = result.data.find(c => c.id == id);
            if (coupon) {
                document.getElementById("couponCode").value = coupon.code;
                document.getElementById("discountType").value = coupon.discount_type;
                document.getElementById("discountValue").value = coupon.discount_value;
                document.getElementById("minOrderValue").value = coupon.min_order_value;
                document.getElementById("startDate").value = coupon.start_date.split('T')[0];
                document.getElementById("endDate").value = coupon.end_date.split('T')[0];
                document.getElementById("status").value = coupon.status;
            }
        }
    } catch (err) {
        console.error("Lỗi:", err);
    }
}
