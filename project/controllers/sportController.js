const sportModel = require('../models/sportModel');

const getSports = async (req, res) => {
  try {
    const sports = await sportModel.getSports();
    return res.json(sports);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch sports', error: error.message });
  }
};

const createSport = async (req, res) => {
  try {
    const { sport_name, description } = req.body;

    if (!sport_name) {
      return res.status(400).json({ message: 'Sport name is required' });
    }

    const sport = await sportModel.createSport({ sport_name, description });
    return res.status(201).json(sport);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create sport', error: error.message });
  }
};

const updateSport = async (req, res) => {
  try {
    const sportId = req.params.id;
    const { sport_name, description } = req.body;

    const updated = await sportModel.updateSport(sportId, { sport_name, description });
    if (!updated) {
      return res.status(404).json({ message: 'Sport not found' });
    }

    const sport = await sportModel.getSportById(sportId);
    return res.json(sport);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update sport', error: error.message });
  }
};

const deleteSport = async (req, res) => {
  try {
    const sportId = req.params.id;
    const deleted = await sportModel.deleteSport(sportId);
    if (!deleted) {
      return res.status(404).json({ message: 'Sport not found' });
    }
    return res.json({ message: 'Sport deleted' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete sport', error: error.message });
  }
};

module.exports = {
  getSports,
  createSport,
  updateSport,
  deleteSport,
};
