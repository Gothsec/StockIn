import express from 'express';
const router = express.Router();
import { login } from '../controllers/loginController.js';
import { readProduct } from '../controllers/product/readProductsController.js';
import { addProduct } from '../controllers/product/addProductController.js';
import { updateProduct } from '../controllers/product/updateProductController.js';
import { readOrder } from '../controllers/order/readOrderController.js';
import { removeOrder } from '../controllers/order/removeOrderController.js';

router.post('/login', login);

// products
router.get('/read-product', readProduct)
router.post('/add-product', addProduct)
router.patch('/update-product/:id', updateProduct);

// orders
router.get('/read-order', readOrder)
router.patch('/delete-order/:id', removeOrder)

export default router;