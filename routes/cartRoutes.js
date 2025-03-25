import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { cartController } from '../controllers/cartController.js';

const cartRouter = express.Router();

// protect this route
cartRouter.get('/', protect, cartController.getCart);
cartRouter.post('/upsert', protect, cartController.upsertCartItem);
cartRouter.delete('/delete', protect, cartController.removeCartItem);
cartRouter.delete('/reset', protect, cartController.resetCart);


export default cartRouter;
