const pool = require('../config/db');

const execute = async (query, params = []) => {
  const [rows] = await pool.execute(query, params);
  return rows;
};

const executeWithMeta = async (query, params = []) => {
  const [rows, meta] = await pool.execute(query, params);
  return { rows, meta };
};

const getConnection = async () => pool.getConnection();

module.exports = {
  execute,
  executeWithMeta,
  getConnection,
};
