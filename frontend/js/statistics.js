// ==========================================
// STATISTICS MANAGEMENT
// Jewelry Store Admin
// ==========================================

const API_URL = "/api";

let statisticsData = [];
let totalProducts = 0;
let totalCustomers = 0;

// ==========================================
// BIẾN TOÀN CỤC
// ==========================================

let chart = null;

let filteredData = [...statisticsData];

// ==========================================
// FORMAT TIỀN
// ==========================================

function formatMoney(number) {
  return number.toLocaleString("vi-VN") + "đ";
}

// ==========================================
// FORMAT NGÀY
// ==========================================

function formatDate(dateString) {
  const date = new Date(dateString);

  return date.toLocaleDateString("vi-VN");
}

// ==========================================
// TẠO LABEL CHO CHART
// ==========================================

function getChartLabels(data) {
  return data.map((item) => {
    const date = new Date(item.date);

    return date.getDate();
  });
}

// ==========================================
// TẠO DATA CHO CHART
// ==========================================

function getChartRevenue(data) {
  return data.map((item) => item.revenue);
}

// ==========================================
// KHỞI TẠO BIỂU ĐỒ
// ==========================================

function createChart() {
  const ctx = document.getElementById("revenueChart").getContext("2d");

  chart = new Chart(ctx, {
    type: "line",

    data: {
      labels: getChartLabels(filteredData),

      datasets: [
        {
          label: "Doanh thu",

          data: getChartRevenue(filteredData),

          borderColor: "#0b5ed7",

          backgroundColor: "rgba(11,94,215,.15)",

          fill: true,

          borderWidth: 3,

          tension: 0.35,

          pointRadius: 4,

          pointHoverRadius: 6,
        },
      ],
    },

    options: {
      responsive: true,

      maintainAspectRatio: false,

      plugins: {
        legend: {
          display: false,
        },
      },

      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}
// ==========================================
// CẬP NHẬT BIỂU ĐỒ
// ==========================================

function updateChart() {
  if (!chart) return;

  chart.data.labels = getChartLabels(filteredData);

  chart.data.datasets[0].data = getChartRevenue(filteredData);

  chart.update();
}

// ==========================================
// CẬP NHẬT 4 THẺ THỐNG KÊ
// ==========================================

function updateOverviewCards() {
  const totalRevenue = filteredData.reduce((sum, item) => {
    return sum + Number(item.revenue);
  }, 0);

  const totalOrders = filteredData.reduce((sum, item) => {
    return sum + Number(item.orders);
  }, 0);

  document.getElementById("totalProducts").textContent = totalProducts;

  document.getElementById("totalCustomers").textContent = totalCustomers;

  document.getElementById("totalOrders").textContent = totalOrders;

  document.getElementById("totalRevenue").textContent =
    formatMoney(totalRevenue);
}

// ==========================================
// DOANH THU CAO NHẤT
// ==========================================

function getHighestRevenue() {
  return filteredData.reduce((max, item) => {
    return Number(item.revenue) > Number(max.revenue) ? item : max;
  });
}

// ==========================================
// DOANH THU THẤP NHẤT
// ==========================================

function getLowestRevenue() {
  return filteredData.reduce((min, item) => {
    return Number(item.revenue) < Number(min.revenue) ? item : min;
  });
}

// ==========================================
// DOANH THU TRUNG BÌNH
// ==========================================

function getAverageRevenue() {
  if (filteredData.length === 0) return 0;

  const total = filteredData.reduce((sum, item) => {
    return sum + Number(item.revenue);
  }, 0);

  return Math.round(total / filteredData.length);
}

// ==========================================
// CẬP NHẬT 3 THẺ PHÍA DƯỚI
// ==========================================

function updateSummaryCards() {
  if (filteredData.length === 0) return;

  const highest = getHighestRevenue();

  const lowest = getLowestRevenue();

  const average = getAverageRevenue();

  document.getElementById("highestRevenue").textContent = formatMoney(
    Number(highest.revenue)
  );

  document.getElementById("highestDate").textContent =
    "Ngày " + formatDate(highest.date);

  document.getElementById("lowestRevenue").textContent = formatMoney(
    Number(lowest.revenue)
  );

  document.getElementById("lowestDate").textContent =
    "Ngày " + formatDate(lowest.date);

  document.getElementById("averageRevenue").textContent = formatMoney(average);
}

// ==========================================
// CẬP NHẬT THỜI GIAN
// ==========================================

function updateUpdateTime() {
  const now = new Date();

  const time =
    now.toLocaleDateString("vi-VN") + " " + now.toLocaleTimeString("vi-VN");

  document.getElementById("updateTime").textContent = time;
}

// ==========================================
// CẬP NHẬT TOÀN BỘ GIAO DIỆN
// ==========================================

function updateStatistics() {
  updateOverviewCards();

  updateSummaryCards();

  updateChart();

  updateUpdateTime();
}
// ==========================================
// LỌC DỮ LIỆU THEO NGÀY
// ==========================================

function filterByDate(fromDate, toDate) {
  filteredData = statisticsData.filter((item) => {
    const current = new Date(item.date);

    const from = new Date(fromDate);

    const to = new Date(toDate);

    return current >= from && current <= to;
  });
}

// ==========================================
// KIỂM TRA DỮ LIỆU
// ==========================================

function validateFilter(fromDate, toDate) {
  if (!fromDate || !toDate) {
    alert("Vui lòng chọn đầy đủ ngày bắt đầu và ngày kết thúc.");

    return false;
  }

  if (new Date(fromDate) > new Date(toDate)) {
    alert("Ngày bắt đầu phải nhỏ hơn hoặc bằng ngày kết thúc.");

    return false;
  }

  return true;
}

// ==========================================
// XỬ LÝ NÚT THỐNG KÊ
// ==========================================

function handleStatistics() {
  const fromDate = document.getElementById("fromDate").value;

  const toDate = document.getElementById("toDate").value;

  if (!validateFilter(fromDate, toDate)) {
    return;
  }

  filterByDate(fromDate, toDate);

  if (filteredData.length === 0) {
    alert("Không có dữ liệu trong khoảng thời gian này.");

    return;
  }

  updateStatistics();
}

// ==========================================
// SỰ KIỆN NÚT XEM THỐNG KÊ
// ==========================================

const btnStatistic = document.getElementById("btnStatistic");

if (btnStatistic) {
  btnStatistic.addEventListener("click", function () {
    handleStatistics();
  });
}

// ==========================================
// ENTER ĐỂ THỐNG KÊ
// ==========================================

document.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    handleStatistics();
  }
});

// ==========================================
// RESET DỮ LIỆU
// ==========================================

function resetStatistics() {
  filteredData = [...statisticsData];

  updateStatistics();
}

// ==========================================
// LOAD MẶC ĐỊNH THEO THÁNG HIỆN TẠI
// ==========================================

function loadDefaultData() {
  const fromInput = document.getElementById("fromDate");

  const toInput = document.getElementById("toDate");

  if (fromInput && toInput) {
    filterByDate(fromInput.value, toInput.value);
  }

  updateStatistics();
}
// ==========================================
// DOM READY
// ==========================================

document.addEventListener("DOMContentLoaded", async function () {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "login.html";
    return;
  }
  
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const adminName = document.getElementById("adminName");
  if (adminName && user.fullname) adminName.textContent = user.fullname;

  await fetchDataFromAPI();

  // Khởi tạo biểu đồ
  createChart();

  // Load dữ liệu mặc định
  loadDefaultData();
});

async function fetchDataFromAPI() {
  try {
    const headers = { "Authorization": `Bearer ${localStorage.getItem("token")}` };
    
    const statRes = await fetch(`${API_URL}/dashboard/statistics`, { headers });
    const statResult = await statRes.json();
    if (statResult.success) {
      totalProducts = statResult.data.totalProducts;
      totalCustomers = statResult.data.totalCustomers;
    }

    const revRes = await fetch(`${API_URL}/dashboard/revenue`, { headers });
    const revResult = await revRes.json();
    if (revResult.success) {
      statisticsData = revResult.data;
      filteredData = [...statisticsData];
    }
  } catch (err) {
    console.error(err);
  }
}

// ==========================================
// ĐĂNG XUẤT
// ==========================================

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", function (event) {
    event.preventDefault();

    const confirmLogout = confirm("Bạn có chắc muốn đăng xuất không?");

    if (!confirmLogout) return;

    // Sau này Backend sẽ xử lý Session/JWT
    localStorage.removeItem("user");

    window.location.href = "login.html";
  });
}

// ==========================================
// HÀM REFRESH
// Sau này Backend gọi lại sau khi lấy dữ liệu
// ==========================================

function refreshStatistics(data) {
  filteredData = [...data];

  updateStatistics();
}

// Removed API demo comment

// ==========================================
// DEBUG
// ==========================================

console.log("Statistics page loaded.");

console.log("Total records:", statisticsData.length);
