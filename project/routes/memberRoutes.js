const express = require('express');
const memberController = require('../controllers/memberController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticate, authorizeAdmin, memberController.listMembers);
router.get('/references', authenticate, authorizeAdmin, memberController.getPlansAndSports);
router.post('/', authenticate, authorizeAdmin, memberController.createMember);
router.get('/:id', authenticate, authorizeAdmin, memberController.getMember);
router.put('/:id', authenticate, authorizeAdmin, memberController.updateMember);
router.delete('/:id', authenticate, authorizeAdmin, memberController.deleteMember);

module.exports = router;
