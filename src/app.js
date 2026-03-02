import 'dotenv/config';
import express from 'express';
import cors from 'cors'; 
import rateLimit from 'express-rate-limit'; 

import { router as inventarioRutas } from './rutas/inventarioRutas.js';
import { router as usersRutas } from './rutas/users.routes.js';
import { router as tasksRutas } from './rutas/tasks.routes.js'; 
import { errorHandler } from './middlewares/error.middleware.js';

const app = express();
const PUERTO = process.env.PORT || 3000;

//  2. Configuramos las reglas del Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // Memoria de 15 minutos
    max: 100, // Límite de  peticiones por cada IP en esa ventana de tiempo
    message: { error: 'Demasiadas peticiones desde esta IP. Por favor, intenta de nuevo en 15 minutos.' },
    standardHeaders: true, // Envía la info del límite en los headers estándar (RateLimit-*)
    legacyHeaders: false, // Deshabilita los headers antiguos (X-RateLimit-*)
});

app.use(cors()); 
app.use(express.json());

//  3. Activamos el escudo para TODA la aplicación
app.use(limiter);

// Registro de rutas
app.use('/api/productos', inventarioRutas);
app.use('/api/users', usersRutas);
app.use('/api/tasks', tasksRutas); 

app.get('/', (req, res) => {
    res.send('🚀 API SmartHome v2.0 Online');
});

app.use(errorHandler);

app.listen(PUERTO, () => {
    console.log(`🚀 Backend corriendo en http://localhost:${PUERTO}`);
});