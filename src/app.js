import 'dotenv/config';
import express from 'express';
import cors from 'cors'; 
import { router as inventarioRutas } from './rutas/inventarioRutas.js';
import { router as usersRutas } from './rutas/users.routes.js';
import { router as tasksRutas } from './rutas/tasks.routes.js'; 
import { errorHandler } from './middlewares/error.middleware.js';


const app = express();
const PUERTO = process.env.PORT || 3000;

app.use(cors()); 
app.use(express.json());

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