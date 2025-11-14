const { execute, executeWithMeta } = require('./db');

const buildMembersQuery = ({ search, sportId, planId, paymentStatus }) => {
  let query = `
    SELECT 
      m.member_id,
      m.name,
      m.age,
      m.gender,
      m.phone,
      m.address,
      m.join_date,
      m.sport_id,
      m.plan_id,
      s.sport_name,
      mp.plan_name,
      mp.duration_months,
      mp.price,
      COALESCE(pay.status, 'Pending') AS latest_payment_status,
      pay.amount AS latest_payment_amount,
      pay.date AS latest_payment_date
    FROM members m
    LEFT JOIN sports s ON s.sport_id = m.sport_id
    LEFT JOIN membership_plans mp ON mp.plan_id = m.plan_id
    LEFT JOIN (
      SELECT p1.member_id, p1.status, p1.amount, p1.date
      FROM payments p1
      INNER JOIN (
        SELECT member_id, MAX(date) AS max_date, MAX(payment_id) AS max_payment_id
        FROM payments
        GROUP BY member_id
      ) latest ON latest.member_id = p1.member_id
        AND latest.max_payment_id = p1.payment_id
    ) pay ON pay.member_id = m.member_id
    WHERE 1 = 1
  `;

  const params = [];

  if (search) {
    query += ' AND (m.name LIKE ? OR m.phone LIKE ? OR m.address LIKE ?)';
    const like = `%${search}%`;
    params.push(like, like, like);
  }

  if (sportId) {
    query += ' AND m.sport_id = ?';
    params.push(sportId);
  }

  if (planId) {
    query += ' AND m.plan_id = ?';
    params.push(planId);
  }

  if (paymentStatus) {
    query += ' AND COALESCE(pay.status, \"Pending\") = ?';
    params.push(paymentStatus);
  }

  query += ' ORDER BY m.name';

  return { query, params };
};

const getMembers = async (filters = {}) => {
  const { query, params } = buildMembersQuery(filters);
  return execute(query, params);
};

const getMemberById = async (memberId) => {
  const query = `
    SELECT 
      m.member_id,
      m.name,
      m.age,
      m.gender,
      m.phone,
      m.address,
      m.join_date,
      s.sport_id,
      s.sport_name,
      mp.plan_id,
      mp.plan_name,
      mp.duration_months,
      mp.price
    FROM members m
    LEFT JOIN sports s ON s.sport_id = m.sport_id
    LEFT JOIN membership_plans mp ON mp.plan_id = m.plan_id
    WHERE m.member_id = ?
  `;
  const rows = await execute(query, [memberId]);
  return rows[0] || null;
};

const createMember = async ({
  name,
  age,
  gender,
  phone,
  address,
  sport_id,
  plan_id,
  join_date,
}) => {
  const query = `
    INSERT INTO members (name, age, gender, phone, address, sport_id, plan_id, join_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const { rows } = await executeWithMeta(query, [
    name,
    age,
    gender,
    phone,
    address,
    sport_id,
    plan_id,
    join_date,
  ]);

  return {
    member_id: rows.insertId,
    name,
    age,
    gender,
    phone,
    address,
    sport_id,
    plan_id,
    join_date,
  };
};

const updateMember = async (memberId, {
  name,
  age,
  gender,
  phone,
  address,
  sport_id,
  plan_id,
  join_date,
}) => {
  const query = `
    UPDATE members
    SET name = ?, age = ?, gender = ?, phone = ?, address = ?, sport_id = ?, plan_id = ?, join_date = ?
    WHERE member_id = ?
  `;

  const { rows } = await executeWithMeta(query, [
    name,
    age,
    gender,
    phone,
    address,
    sport_id,
    plan_id,
    join_date,
    memberId,
  ]);

  return rows.affectedRows > 0;
};

const deleteMember = async (memberId) => {
  const query = 'DELETE FROM members WHERE member_id = ?';
  const { rows } = await executeWithMeta(query, [memberId]);
  return rows.affectedRows > 0;
};

module.exports = {
  getMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember,
};
