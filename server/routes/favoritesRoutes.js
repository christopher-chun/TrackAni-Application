import express from 'express';
import requireAuth from '../middleware/auth.js';
import {
    getFavorites,
    addFavorite,
    removeFavorite,
    checkFavorite,
} from '../controllers/favoritesController.js'

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

// GET /api/favorites - Get user's favorite items
router.get('/', getFavorites);
// POST /api/favorites - Add a new favorite item
router.post('/', addFavorite);
// DELETE /api/favorites/:itemId/:itemType - Remove a favorite item
router.delete('/:itemId/:itemType', removeFavorite);
// GET /api/favorites/check/:itemId/:itemType - Check if an item is in favorites
router.get('/check/:itemId/:itemType', checkFavorite);

export default router;