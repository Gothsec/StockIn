import express from 'express';
const router = express.Router();
import { login } from '../controllers/loginController.js';
import { readProduct } from '../controllers/readProductsController.js';
import { addProduct } from '../controllers/addProductController.js';
import { removeProduct } from '../controllers/removeProductController.js';

router.post('/login', login);
router.get('/read-product', readProduct)
router.post('/add-product', addProduct)
router.delete('/remove-product/:id', removeProduct)

export default router;