const express = require('express');
const sportController = require('../controllers/sportController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', sportController.getSports);
router.post('/', authenticate, authorizeAdmin, sportController.createSport);
router.put('/:id', authenticate, authorizeAdmin, sportController.updateSport);
router.delete('/:id', authenticate, authorizeAdmin, sportController.deleteSport);

module.exports = router;
