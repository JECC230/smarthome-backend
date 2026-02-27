import express from 'express';
import * as controller from '../controladores/tasks.controller.js';
import { authMiddleware } from '../auth.js';

export const router = express.Router();

router.use(authMiddleware);
router.get('/', controller.getTasks);
router.get('/:id', controller.getTaskById); 
router.post('/', controller.createTask);
router.put('/:id', controller.updateTask);
router.delete('/:id', controller.deleteTask);