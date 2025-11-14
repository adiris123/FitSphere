const express = require('express');
const paymentController = require('../controllers/paymentController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticate, authorizeAdmin, paymentController.listPayments);
router.post('/', authenticate, authorizeAdmin, paymentController.createPayment);
router.put('/:id', authenticate, authorizeAdmin, paymentController.updatePayment);
router.get('/member/:memberId', authenticate, authorizeAdmin, paymentController.listMemberPayments);

module.exports = router;
