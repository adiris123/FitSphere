const { execute, executeWithMeta } = require('./db');

const getSports = async () => {
  const query = 'SELECT sport_id, sport_name, description FROM sports ORDER BY sport_name';
  return execute(query);
};

const getSportById = async (sportId) => {
  const query = 'SELECT sport_id, sport_name, description FROM sports WHERE sport_id = ?';
  const rows = await execute(query, [sportId]);
  return rows[0] || null;
};

const createSport = async ({ sport_name, description }) => {
  const query = 'INSERT INTO sports (sport_name, description) VALUES (?, ?)';
  const { rows } = await executeWithMeta(query, [sport_name, description]);
  return { sport_id: rows.insertId, sport_name, description };
};

const updateSport = async (sportId, { sport_name, description }) => {
  const query = 'UPDATE sports SET sport_name = ?, description = ? WHERE sport_id = ?';
  const { rows } = await executeWithMeta(query, [sport_name, description, sportId]);
  return rows.affectedRows > 0;
};

const deleteSport = async (sportId) => {
  const query = 'DELETE FROM sports WHERE sport_id = ?';
  const { rows } = await executeWithMeta(query, [sportId]);
  return rows.affectedRows > 0;
};

const getMostPopularSport = async () => {
  const query = `
    SELECT s.sport_id, s.sport_name, COUNT(m.member_id) AS member_count
    FROM sports s
    LEFT JOIN members m ON m.sport_id = s.sport_id
    GROUP BY s.sport_id, s.sport_name
    ORDER BY member_count DESC
    LIMIT 1
  `;
  const rows = await execute(query);
  return rows[0] || null;
};

module.exports = {
  getSports,
  getSportById,
  createSport,
  updateSport,
  deleteSport,
  getMostPopularSport,
};
