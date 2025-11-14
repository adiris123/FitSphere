const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/overview', authenticate, authorizeAdmin, dashboardController.getOverview);
router.get('/charts', authenticate, authorizeAdmin, dashboardController.getCharts);

module.exports = router;
