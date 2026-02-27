import express from 'express';
import * as controller from '../controladores/users.controller.js';
import { authMiddleware } from '../auth.js';

export const router = express.Router();

// RUTA PÚBLICA: Para crear nuevos administradores de casas nuevas
router.post('/register-admin', controller.registerAdmin);

// RUTA PÚBLICA: Para iniciar sesión
router.post('/login', controller.loginUser);

// RUTAS PROTEGIDAS: Requieren Token
router.post('/create', authMiddleware, controller.create);
router.get('/house', authMiddleware, controller.getHouseUsers);