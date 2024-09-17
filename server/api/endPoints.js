import express from 'express';
const router = express.Router();
import { login } from '../controllers/loginController.js';
import { readProduct } from '../controllers/product/readProductsController.js';
import { addProduct } from '../controllers/product/addProductController.js';
import { removeProduct } from '../controllers/product/removeProductController.js';
import { updateProduct } from '../controllers/product/updateProductController.js';

router.post('/login', login);
router.get('/read-product', readProduct)
router.post('/add-product', addProduct)
router.delete('/remove-product/:id', removeProduct)
router.patch('/update-product/:id', updateProduct);

export default router;