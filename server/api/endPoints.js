import express from 'express';
const router = express.Router();
import { login } from '../controllers/loginController.js';
import { readProduct } from '../controllers/product/readProductsController.js';
import { addProduct } from '../controllers/product/addProductController.js';
import { getProductById } from '../controllers/product/getProductController.js'
import { eliminationProduct } from '../controllers/product/eliminationProductController.js';
import { createOrder } from '../controllers/order/addOrderController.js';
import { requestPasswordReset, resetPassword } from '../controllers/passwordrecovery/authController.js';
import { removeOrder } from '../controllers/order/removeOrderController.js';
import { readOrder } from '../controllers/order/readOrderController.js'
import { getOrderById } from '../controllers/order/getOrderByIdController.js'
import { updateOrder } from '../controllers/order/updateOrderController.js'

router.post('/login', login);

// products
router.get('/read-product', readProduct)
router.post('/add-product', addProduct)
router.patch('/elimination-product/:id', eliminationProduct)
router.get('/get-product/:id', getProductById)

// orders
router.get('/read-order', readOrder);
router.get('/get-order/:id', getOrderById)
router.post("/create-order", createOrder);
router.patch('/delete-order/:id', removeOrder)
router.put('/update-order/:id', updateOrder)

// password recovery
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);

export default router;