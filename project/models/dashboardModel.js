const { execute } = require('./db');

const getDashboardStats = async () => {
  const [members, sports, revenue, pending, popular] = await Promise.all([
    execute('SELECT COUNT(*) AS total_members FROM members'),
    execute('SELECT COUNT(*) AS total_sports FROM sports'),
    execute("SELECT IFNULL(SUM(amount), 0) AS total_revenue FROM payments WHERE status = 'Paid'"),
    execute("SELECT COUNT(*) AS pending_payments FROM payments WHERE status = 'Pending'"),
    execute(`
      SELECT s.sport_name, COUNT(m.member_id) AS member_count
      FROM sports s
      LEFT JOIN members m ON m.sport_id = s.sport_id
      GROUP BY s.sport_id, s.sport_name
      ORDER BY member_count DESC
      LIMIT 1
    `),
  ]);

  return {
    totalMembers: members[0]?.total_members || 0,
    totalSports: sports[0]?.total_sports || 0,
    totalRevenue: Number(revenue[0]?.total_revenue || 0),
    pendingPayments: pending[0]?.pending_payments || 0,
    mostPopularSport: popular[0]?.sport_name || null,
    mostPopularSportMembers: popular[0]?.member_count || 0,
  };
};

const getMembersBySport = async () =>
  execute(`
    SELECT s.sport_name, COUNT(m.member_id) AS total
    FROM sports s
    LEFT JOIN members m ON m.sport_id = s.sport_id
    GROUP BY s.sport_name
    ORDER BY total DESC
  `);

const getRevenueByMonth = async (months = 6) =>
  execute(
    `
      SELECT DATE_FORMAT(date, '%Y-%m') AS month, SUM(amount) AS total
      FROM payments
      WHERE status = 'Paid' AND date >= DATE_SUB(CURDATE(), INTERVAL ? MONTH)
      GROUP BY DATE_FORMAT(date, '%Y-%m')
      ORDER BY month ASC
    `,
    [months]
  );

const getPaymentStatusCounts = async () =>
  execute(
    `
      SELECT status, COUNT(*) AS total
      FROM payments
      GROUP BY status
    `
  );

module.exports = {
  getDashboardStats,
  getMembersBySport,
  getRevenueByMonth,
  getPaymentStatusCounts,
};
