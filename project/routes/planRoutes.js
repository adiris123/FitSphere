const express = require('express');
const planController = require('../controllers/planController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', planController.getPlans);
router.post('/', authenticate, authorizeAdmin, planController.createPlan);
router.put('/:id', authenticate, authorizeAdmin, planController.updatePlan);
router.delete('/:id', authenticate, authorizeAdmin, planController.deletePlan);

module.exports = router;
