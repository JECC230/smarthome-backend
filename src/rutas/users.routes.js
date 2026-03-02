import express from 'express';
import * as controller from '../controladores/users.controller.js';
import { authMiddleware, requireRole } from '../auth.js'; 

export const router = express.Router();

// RUTA PÚBLICA: Para crear nuevos administradores de casas nuevas
router.post('/register-admin', controller.registerAdmin);

// RUTA PÚBLICA: Para iniciar sesión
router.post('/login', controller.loginUser);

// RUTAS PROTEGIDAS: Requieren Token
// : Primero verifica que haya login, luego verifica que sea admin
router.post('/create', authMiddleware, requireRole('admin'), controller.create); 
router.get('/house', authMiddleware, controller.getHouseUsers);