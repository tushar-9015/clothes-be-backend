import express from 'express';
// import { protect } from '../middleware/authMiddleware.js';
import { productController } from '../controllers/productController.js';

const productRouter = express.Router();

// protect this route
// productRouter.get('/', protect, productController.getAllProducts);
// productRouter.get('/:id', protect, productController.getProductById);
// productRouter.post('/', protect, productController.createProduct);
// productRouter.put('/:id', protect, productController.updateProduct);
// productRouter.delete('/:id', protect, productController.deleteProduct);


productRouter.post('/productfilter', productController.getFilteredProducts); // Explicit filter route
productRouter.get('/', productController.getAllProducts);
productRouter.get('/:id', productController.getProductById); // Dynamic ID route
productRouter.post('/add', productController.createProduct);
productRouter.put('/:id', productController.updateProduct);
productRouter.delete('/:id', productController.deleteProduct);

export default productRouter;
