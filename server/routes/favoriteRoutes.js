const express = require('express');
const { getFavorites, addFavorite, removeFavorite } = require('../controllers/favoriteController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getFavorites);
router.post('/', protect, addFavorite);
router.delete('/:id', protect, removeFavorite);

module.exports = router;
