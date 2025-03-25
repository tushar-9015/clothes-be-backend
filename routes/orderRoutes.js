import express from 'express';
import { 
  getOrders, 
  getOrderById, 
  getCartOrder, 
  addToCart, 
  removeFromCart, 
  checkoutOrder 
} from '../controllers/orderController.js';

const router = express.Router();

// Get all orders (status = ordered) for a user
router.get('/orders/:userId', getOrders);

// Get a specific order by product ID
router.get('/orders/:userId/:productId', getOrderById);

// Get all items in the cart (status = in-cart)
router.get('/cart/:userId', getCartOrder);

// Add a product to the cart
router.post('/cart/:userId', addToCart);

// Remove a product from the cart
router.delete('/cart/:userId/:productId', removeFromCart);

// Checkout all items in the cart and mark them as ordered
router.post('/checkout/:userId', checkoutOrder);

export default router;
