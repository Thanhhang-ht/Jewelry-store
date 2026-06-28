// ==========================================
// STATISTICS MANAGEMENT
// Jewelry Store Admin
// ==========================================

// ==========================================
// DỮ LIỆU MẪU
// Sau này thay bằng API
// ==========================================

const statisticsData = [
  { date: "2026-06-01", revenue: 2500000, orders: 5 },

  { date: "2026-06-02", revenue: 1800000, orders: 4 },

  { date: "2026-06-03", revenue: 3200000, orders: 7 },

  { date: "2026-06-04", revenue: 4100000, orders: 9 },

  { date: "2026-06-05", revenue: 2800000, orders: 6 },

  { date: "2026-06-06", revenue: 5600000, orders: 12 },

  { date: "2026-06-07", revenue: 4300000, orders: 10 },

  { date: "2026-06-08", revenue: 2900000, orders: 6 },

  { date: "2026-06-09", revenue: 10200000, orders: 20 },

  { date: "2026-06-10", revenue: 3800000, orders: 8 },

  { date: "2026-06-11", revenue: 4100000, orders: 9 },

  { date: "2026-06-12", revenue: 3900000, orders: 8 },

  { date: "2026-06-13", revenue: 4700000, orders: 11 },

  { date: "2026-06-14", revenue: 5200000, orders: 12 },

  { date: "2026-06-15", revenue: 3100000, orders: 7 },

  { date: "2026-06-16", revenue: 4900000, orders: 10 },

  { date: "2026-06-17", revenue: 4200000, orders: 9 },

  { date: "2026-06-18", revenue: 3700000, orders: 8 },

  { date: "2026-06-19", revenue: 5100000, orders: 11 },

  { date: "2026-06-20", revenue: 4800000, orders: 10 },

  { date: "2026-06-21", revenue: 2600000, orders: 5 },

  { date: "2026-06-22", revenue: 3100000, orders: 6 },

  { date: "2026-06-23", revenue: 6200000, orders: 13 },

  { date: "2026-06-24", revenue: 5500000, orders: 12 },

  { date: "2026-06-25", revenue: 4600000, orders: 9 },

  { date: "2026-06-26", revenue: 5100000, orders: 11 },

  { date: "2026-06-27", revenue: 6800000, orders: 14 },

  { date: "2026-06-28", revenue: 7300000, orders: 15 },

  { date: "2026-06-29", revenue: 5900000, orders: 12 },

  { date: "2026-06-30", revenue: 6400000, orders: 13 },
];

// ==========================================
// THỐNG KÊ TĨNH
// Sau này lấy từ Backend
// ==========================================

const totalProducts = 120;

const totalCustomers = 60;

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
    return sum + item.revenue;
  }, 0);

  const totalOrders = filteredData.reduce((sum, item) => {
    return sum + item.orders;
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
    return item.revenue > max.revenue ? item : max;
  });
}

// ==========================================
// DOANH THU THẤP NHẤT
// ==========================================

function getLowestRevenue() {
  return filteredData.reduce((min, item) => {
    return item.revenue < min.revenue ? item : min;
  });
}

// ==========================================
// DOANH THU TRUNG BÌNH
// ==========================================

function getAverageRevenue() {
  if (filteredData.length === 0) return 0;

  const total = filteredData.reduce((sum, item) => {
    return sum + item.revenue;
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
    highest.revenue
  );

  document.getElementById("highestDate").textContent =
    "Ngày " + formatDate(highest.date);

  document.getElementById("lowestRevenue").textContent = formatMoney(
    lowest.revenue
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

document.addEventListener("DOMContentLoaded", function () {
  // Khởi tạo biểu đồ
  createChart();

  // Load dữ liệu mặc định
  loadDefaultData();
});

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

// ==========================================
// DEMO API (ĐỂ COMMENT)
// ==========================================

/*

Sau này chỉ cần thay statisticsData bằng API.

Ví dụ:

fetch("http://localhost:8080/api/statistics")
.then(res => res.json())
.then(data=>{

    statisticsData = data;

    filteredData = [...statisticsData];

    createChart();

    updateStatistics();

});

*/

// ==========================================
// DEBUG
// ==========================================

console.log("Statistics page loaded.");

console.log("Total records:", statisticsData.length);
