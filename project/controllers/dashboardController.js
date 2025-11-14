const dashboardModel = require('../models/dashboardModel');

const getOverview = async (req, res) => {
  try {
    const stats = await dashboardModel.getDashboardStats();
    return res.json(stats);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to load dashboard stats', error: error.message });
  }
};

const getCharts = async (req, res) => {
  try {
    const [membersBySport, revenueByMonth, paymentStatus] = await Promise.all([
      dashboardModel.getMembersBySport(),
      dashboardModel.getRevenueByMonth(6),
      dashboardModel.getPaymentStatusCounts(),
    ]);

    return res.json({ membersBySport, revenueByMonth, paymentStatus });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to load chart data', error: error.message });
  }
};

module.exports = {
  getOverview,
  getCharts,
};
