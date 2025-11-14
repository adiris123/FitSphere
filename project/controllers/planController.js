const planModel = require('../models/planModel');

const getPlans = async (req, res) => {
  try {
    const plans = await planModel.getPlans();
    return res.json(plans);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch plans', error: error.message });
  }
};

const createPlan = async (req, res) => {
  try {
    const { plan_name, duration_months, price } = req.body;

    if (!plan_name || !duration_months || !price) {
      return res.status(400).json({ message: 'Plan name, duration, and price are required' });
    }

    const plan = await planModel.createPlan({ plan_name, duration_months, price });
    return res.status(201).json(plan);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create plan', error: error.message });
  }
};

const updatePlan = async (req, res) => {
  try {
    const planId = req.params.id;
    const { plan_name, duration_months, price } = req.body;

    const updated = await planModel.updatePlan(planId, { plan_name, duration_months, price });
    if (!updated) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    const plan = await planModel.getPlanById(planId);
    return res.json(plan);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update plan', error: error.message });
  }
};

const deletePlan = async (req, res) => {
  try {
    const planId = req.params.id;
    const deleted = await planModel.deletePlan(planId);
    if (!deleted) {
      return res.status(404).json({ message: 'Plan not found' });
    }
    return res.json({ message: 'Plan deleted' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete plan', error: error.message });
  }
};

module.exports = {
  getPlans,
  createPlan,
  updatePlan,
  deletePlan,
};
