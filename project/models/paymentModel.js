const { execute, executeWithMeta } = require('./db');

const getPayments = async () => {
  const query = `
    SELECT 
      p.payment_id,
      p.member_id,
      m.name AS member_name,
      p.amount,
      p.status,
      p.date
    FROM payments p
    LEFT JOIN members m ON m.member_id = p.member_id
    ORDER BY p.date DESC
  `;
  return execute(query);
};

const getPaymentById = async (paymentId) => {
  const query = 'SELECT payment_id, member_id, amount, status, date FROM payments WHERE payment_id = ?';
  const rows = await execute(query, [paymentId]);
  return rows[0] || null;
};

const getPaymentsByMember = async (memberId) => {
  const query = `
    SELECT payment_id, member_id, amount, status, date
    FROM payments
    WHERE member_id = ?
    ORDER BY date DESC
  `;
  return execute(query, [memberId]);
};

const createPayment = async ({ member_id, amount, status, date }) => {
  const query = 'INSERT INTO payments (member_id, amount, status, date) VALUES (?, ?, ?, ?)';
  const { rows } = await executeWithMeta(query, [member_id, amount, status, date]);
  return { payment_id: rows.insertId, member_id, amount, status, date };
};

const updatePayment = async (paymentId, { amount, status, date }) => {
  const query = 'UPDATE payments SET amount = ?, status = ?, date = ? WHERE payment_id = ?';
  const { rows } = await executeWithMeta(query, [amount, status, date, paymentId]);
  return rows.affectedRows > 0;
};

module.exports = {
  getPayments,
  getPaymentById,
  getPaymentsByMember,
  createPayment,
  updatePayment,
};
