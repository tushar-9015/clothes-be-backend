import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { wishlistController } from '../controllers/wishlistController.js';

const wishlistRouter = express.Router();

// protect this route
wishlistRouter.get('/', protect, wishlistController.getWishlist);
wishlistRouter.post('/add', protect, wishlistController.addWishlistItem);
wishlistRouter.delete('/delete', protect, wishlistController.removeWishlistItem);
wishlistRouter.delete('/reset', protect, wishlistController.resetWishlist);


export default wishlistRouter;
