import express from 'express';
import * as controller from '../controladores/products.controller.js';
import { authMiddleware } from '../auth.js';

export const router = express.Router();

//  Todas las rutas de inventario requieren Token
router.use(authMiddleware);

router.get('/', controller.getProducts);
router.post('/', controller.createProduct);
router.put('/:id', controller.updateProduct);
router.delete('/:id', controller.deleteProduct);
router.get('/:id', controller.getProductById);