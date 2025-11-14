const { execute, executeWithMeta } = require('./db');

const getPlans = async () => {
  const query = 'SELECT plan_id, plan_name, duration_months, price FROM membership_plans ORDER BY price DESC';
  return execute(query);
};

const getPlanById = async (planId) => {
  const query = 'SELECT plan_id, plan_name, duration_months, price FROM membership_plans WHERE plan_id = ?';
  const rows = await execute(query, [planId]);
  return rows[0] || null;
};

const createPlan = async ({ plan_name, duration_months, price }) => {
  const query = 'INSERT INTO membership_plans (plan_name, duration_months, price) VALUES (?, ?, ?)';
  const { rows } = await executeWithMeta(query, [plan_name, duration_months, price]);
  return { plan_id: rows.insertId, plan_name, duration_months, price };
};

const updatePlan = async (planId, { plan_name, duration_months, price }) => {
  const query = 'UPDATE membership_plans SET plan_name = ?, duration_months = ?, price = ? WHERE plan_id = ?';
  const { rows } = await executeWithMeta(query, [plan_name, duration_months, price, planId]);
  return rows.affectedRows > 0;
};

const deletePlan = async (planId) => {
  const query = 'DELETE FROM membership_plans WHERE plan_id = ?';
  const { rows } = await executeWithMeta(query, [planId]);
  return rows.affectedRows > 0;
};

module.exports = {
  getPlans,
  getPlanById,
  createPlan,
  updatePlan,
  deletePlan,
};
