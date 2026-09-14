const Favorite = require('../models/Favorite');

// @desc Get logged-in user's favorites - protected
// @route GET /api/favorites
const getFavorites = async (req, res, next) => {
  try {
    const favorites = await Favorite.find({ user: req.user._id }).populate('property');
    res.json(favorites);
  } catch (err) {
    next(err);
  }
};

// @desc Add a property to favorites - protected
// @route POST /api/favorites
const addFavorite = async (req, res, next) => {
  try {
    const { propertyId } = req.body;
    const existing = await Favorite.findOne({ user: req.user._id, property: propertyId });
    if (existing) return res.status(400).json({ message: 'Already in favorites' });

    const favorite = await Favorite.create({ user: req.user._id, property: propertyId });
    res.status(201).json(favorite);
  } catch (err) {
    next(err);
  }
};

// @desc Remove a favorite - protected
// @route DELETE /api/favorites/:id
const removeFavorite = async (req, res, next) => {
  try {
    const favorite = await Favorite.findById(req.params.id);
    if (!favorite) return res.status(404).json({ message: 'Favorite not found' });
    if (favorite.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await favorite.deleteOne();
    res.json({ message: 'Removed from favorites' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getFavorites, addFavorite, removeFavorite };
