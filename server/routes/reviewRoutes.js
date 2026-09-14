const express = require('express');
const { getReviewsForProperty, createReview, deleteReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/property/:propertyId', getReviewsForProperty);
router.post('/', protect, createReview);
router.delete('/:id', protect, deleteReview);

module.exports = router;
