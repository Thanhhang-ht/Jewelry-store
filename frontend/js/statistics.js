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

let storeTotalOrders = 0;
let storeTotalRevenue = 0;

function updateOverviewCards() {
  const sumRevenue = filteredData.reduce((sum, item) => sum + Number(item.revenue || 0), 0);
  const sumOrders = filteredData.reduce((sum, item) => sum + Number(item.orders || 0), 0);

  const displayOrders = sumOrders > 0 ? sumOrders : storeTotalOrders;
  const displayRevenue = sumRevenue > 0 ? sumRevenue : storeTotalRevenue;

  const totalProdEl = document.getElementById("totalProducts");
  const totalCustEl = document.getElementById("totalCustomers");
  const totalOrdEl = document.getElementById("totalOrders");
  const totalRevEl = document.getElementById("totalRevenue");

  if (totalProdEl) totalProdEl.textContent = totalProducts;
  if (totalCustEl) totalCustEl.textContent = totalCustomers;
  if (totalOrdEl) totalOrdEl.textContent = displayOrders;
  if (totalRevEl) totalRevEl.textContent = formatMoney(displayRevenue);
}

function getHighestRevenue() {
  if (filteredData.length === 0) return { revenue: 0, date: new Date() };
  return filteredData.reduce((max, item) => {
    return Number(item.revenue) > Number(max.revenue) ? item : max;
  }, filteredData[0]);
}

function getLowestRevenue() {
  if (filteredData.length === 0) return { revenue: 0, date: new Date() };
  return filteredData.reduce((min, item) => {
    return Number(item.revenue) < Number(min.revenue) ? item : min;
  }, filteredData[0]);
}

function getAverageRevenue() {
  if (filteredData.length === 0) return 0;
  const total = filteredData.reduce((sum, item) => sum + Number(item.revenue || 0), 0);
  return Math.round(total / filteredData.length);
}

function updateSummaryCards() {
  const highestEl = document.getElementById("highestRevenue");
  const highestDateEl = document.getElementById("highestDate");
  const lowestEl = document.getElementById("lowestRevenue");
  const lowestDateEl = document.getElementById("lowestDate");
  const averageEl = document.getElementById("averageRevenue");

  if (filteredData.length === 0) {
    if (highestEl) highestEl.textContent = "0đ";
    if (highestDateEl) highestDateEl.textContent = "Chưa có dữ liệu";
    if (lowestEl) lowestEl.textContent = "0đ";
    if (lowestDateEl) lowestDateEl.textContent = "Chưa có dữ liệu";
    if (averageEl) averageEl.textContent = "0đ";
    return;
  }

  const highest = getHighestRevenue();
  const lowest = getLowestRevenue();
  const average = getAverageRevenue();

  if (highestEl) highestEl.textContent = formatMoney(Number(highest.revenue || 0));
  if (highestDateEl) highestDateEl.textContent = "Ngày " + formatDate(highest.date);
  if (lowestEl) lowestEl.textContent = formatMoney(Number(lowest.revenue || 0));
  if (lowestDateEl) lowestDateEl.textContent = "Ngày " + formatDate(lowest.date);
  if (averageEl) averageEl.textContent = formatMoney(average);
}

function updateUpdateTime() {
  const now = new Date();
  const time = now.toLocaleDateString("vi-VN") + " " + now.toLocaleTimeString("vi-VN");
  const timeEl = document.getElementById("updateTime");
  if (timeEl) timeEl.textContent = time;
}

function updateStatistics() {
  updateOverviewCards();
  updateSummaryCards();
  updateChart();
  updateUpdateTime();
}

async function handleStatistics() {
  const fromDate = document.getElementById("fromDate")?.value;
  const toDate = document.getElementById("toDate")?.value;

  if (!validateFilter(fromDate, toDate)) return;

  await fetchDataFromAPI(fromDate, toDate);
  updateStatistics();
}

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

const btnStatistic = document.getElementById("btnStatistic");
if (btnStatistic) {
  btnStatistic.addEventListener("click", function () {
    handleStatistics();
  });
}

function initDefaultDates() {
  const fromInput = document.getElementById("fromDate");
  const toInput = document.getElementById("toDate");

  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);

  const formatDateVal = (d) => d.toISOString().split("T")[0];

  if (fromInput && !fromInput.value) fromInput.value = formatDateVal(thirtyDaysAgo);
  if (toInput && !toInput.value) toInput.value = formatDateVal(today);
}

document.addEventListener("DOMContentLoaded", async function () {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "login.html";
    return;
  }
  
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const adminName = document.getElementById("adminName");
  if (adminName && user.fullname) adminName.textContent = user.fullname;

  initDefaultDates();

  const fromDate = document.getElementById("fromDate")?.value;
  const toDate = document.getElementById("toDate")?.value;

  await fetchDataFromAPI(fromDate, toDate);
  createChart();
  updateStatistics();
});

async function fetchDataFromAPI(startDate = "", endDate = "") {
  try {
    const headers = { "Authorization": `Bearer ${localStorage.getItem("token")}` };
    
    const statRes = await fetch(`${API_URL}/dashboard/statistics`, { headers });
    const statResult = await statRes.json();
    if (statResult.success) {
      totalProducts = statResult.data.totalProducts || 0;
      totalCustomers = statResult.data.totalCustomers || 0;
      storeTotalOrders = statResult.data.totalOrders || 0;
      storeTotalRevenue = statResult.data.totalRevenue || 0;
    }

    let revUrl = `${API_URL}/dashboard/revenue`;
    if (startDate && endDate) {
      revUrl += `?startDate=${startDate}&endDate=${endDate}`;
    }

    const revRes = await fetch(revUrl, { headers });
    const revResult = await revRes.json();
    if (revResult.success) {
      statisticsData = revResult.data || [];
      filteredData = [...statisticsData];
    }
  } catch (err) {
    console.error("Lỗi khi tải dữ liệu thống kê:", err);
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
