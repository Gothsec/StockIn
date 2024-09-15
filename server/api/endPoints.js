import express from 'express';
const router = express.Router();
import { login } from '../controllers/loginController.js';
import { readProduct } from '../controllers/product/readProductsController.js';
import { addProduct } from '../controllers/product/addProductController.js';
import { removeProduct } from '../controllers/product/removeProductController.js';
import { readOrder } from '../controllers/order/readOrderController.js';

router.post('/login', login);

// products
router.get('/read-product', readProduct)
router.post('/add-product', addProduct)
router.delete('/remove-product/:id', removeProduct)

// orders
router.get('/read-order', readOrder)

export default router;