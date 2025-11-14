const { execute, executeWithMeta } = require('./db');

const createUser = async ({ name, email, password, role = 'user' }) => {
  const query = `
    INSERT INTO users (name, email, password, role)
    VALUES (?, ?, ?, ?)
  `;
  const { rows } = await executeWithMeta(query, [name, email, password, role]);
  return { user_id: rows.insertId, name, email, role };
};

const findByEmail = async (email) => {
  const query = 'SELECT * FROM users WHERE email = ? LIMIT 1';
  const rows = await execute(query, [email]);
  return rows[0] || null;
};

const findById = async (userId) => {
  const query = 'SELECT user_id, name, email, role FROM users WHERE user_id = ?';
  const rows = await execute(query, [userId]);
  return rows[0] || null;
};

module.exports = {
  createUser,
  findByEmail,
  findById,
};
