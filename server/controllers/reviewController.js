const Review = require('../models/Review');

// @desc Get reviews for a property - public
// @route GET /api/reviews/property/:propertyId
const getReviewsForProperty = async (req, res, next) => {
  try {
    const reviews = await Review.find({ property: req.params.propertyId }).populate('user', 'name');
    res.json(reviews);
  } catch (err) {
    next(err);
  }
};

// @desc Create a review - protected
// @route POST /api/reviews
const createReview = async (req, res, next) => {
  try {
    const { propertyId, rating, comment } = req.body;
    const review = await Review.create({ property: propertyId, user: req.user._id, rating, comment });
    res.status(201).json(review);
  } catch (err) {
    next(err);
  }
};

// @desc Delete a review - protected, owner only
// @route DELETE /api/reviews/:id
const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await review.deleteOne();
    res.json({ message: 'Review removed' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getReviewsForProperty, createReview, deleteReview };
