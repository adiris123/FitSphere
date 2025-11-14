let revenueChart;
let statusChart;
let membersChart;

const renderOverview = (stats) => {
  document.getElementById('totalMembers').textContent = stats.totalMembers;
  document.getElementById('totalSports').textContent = stats.totalSports;
  document.getElementById('totalRevenue').textContent = FitSphereAPI.formatCurrency(stats.totalRevenue);
  document.getElementById('pendingPayments').textContent = stats.pendingPayments;
  document.getElementById('popularSport').textContent = stats.mostPopularSport || 'No data';
  document.getElementById('popularCount').textContent = `${stats.mostPopularSportMembers || 0} members`;
};

const createChart = (ctx, config) => new Chart(ctx, config);

const renderCharts = ({ revenueByMonth, paymentStatus, membersBySport }) => {
  const revenueCtx = document.getElementById('revenueChart');
  const statusCtx = document.getElementById('statusChart');
  const membersCtx = document.getElementById('membersChart');

  if (revenueChart) revenueChart.destroy();
  if (statusChart) statusChart.destroy();
  if (membersChart) membersChart.destroy();

  revenueChart = createChart(revenueCtx, {
    type: 'line',
    data: {
      labels: revenueByMonth.map((item) => item.month),
      datasets: [
        {
          label: 'Revenue',
          data: revenueByMonth.map((item) => item.total),
          borderColor: '#f97316',
          backgroundColor: 'rgba(249, 115, 22, 0.25)',
          tension: 0.4,
          fill: true,
        },
      ],
    },
    options: {
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true } },
    },
  });

  statusChart = createChart(statusCtx, {
    type: 'doughnut',
    data: {
      labels: paymentStatus.map((item) => item.status),
      datasets: [
        {
          data: paymentStatus.map((item) => item.total),
          backgroundColor: ['#16a34a', '#f59e0b'],
        },
      ],
    },
    options: { plugins: { legend: { position: 'bottom' } } },
  });

  membersChart = createChart(membersCtx, {
    type: 'bar',
    data: {
      labels: membersBySport.map((item) => item.sport_name),
      datasets: [
        {
          label: 'Members',
          data: membersBySport.map((item) => item.total),
          backgroundColor: 'rgba(10, 31, 68, 0.7)',
        },
      ],
    },
    options: {
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true } },
    },
  });
};

const loadDashboard = async () => {
  try {
    const user = await FitSphereAPI.ensureAdmin();
    document.getElementById('adminName').textContent = user.name || user.email;

    const stats = await FitSphereAPI.authRequest('/dashboard/overview');
    renderOverview(stats);

    const charts = await FitSphereAPI.authRequest('/dashboard/charts');
    renderCharts(charts);
  } catch (error) {
    console.error('Failed to load dashboard', error);
  }
};

document.addEventListener('DOMContentLoaded', loadDashboard);
