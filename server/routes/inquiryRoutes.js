const express = require('express');
const { createInquiry, getMyInquiries, deleteInquiry } = require('../controllers/inquiryController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getMyInquiries);
router.post('/', protect, createInquiry);
router.delete('/:id', protect, deleteInquiry);

module.exports = router;
