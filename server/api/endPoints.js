import express from 'express';
const router = express.Router();
import { login } from '../controllers/loginController.js';
import { readProduct } from '../controllers/product/readProductsController.js';
import { addProduct } from '../controllers/product/addProductController.js';
import { removeProduct } from '../controllers/product/removeProductController.js';
import { updateProduct } from '../controllers/product/updateProductController.js';
import { readOrder } from '../controllers/order/readOrderController.js';
import { createOrder } from '../controllers/order/addOrderController.js';
import { requestPasswordReset, resetPassword } from '../controllers/passwordrecovery/authController.js';

router.post('/login', login);

// products
router.get('/read-product', readProduct);
router.post('/add-product', addProduct);
router.delete('/remove-product/:id', removeProduct);
router.patch('/update-product/:id', updateProduct);

// orders
router.get('/read-order', readOrder);
router.post("/create-order", createOrder);

// password recovery
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);

export default router;