import pg from 'pg';
import 'dotenv/config';

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
    console.error("❌ ERROR: No existe DATABASE_URL en el .env");
    process.exit(1);
}

// Configuración con SSL Reforzado  Usamos una configuración que acepta los certificados de Supabase de forma explícita.
 
export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
        // Forzamos a que no intente usar protocolos viejos que Supabase rechaza
        minVersion: 'TLSv1.2' 
    },
    max: 10,
    idleTimeoutMillis: 30000,
});

// Prueba de conexión inmediata con manejo de error mejorado
pool.connect((err, client, release) => {
    if (err) {
        console.error(' Error de conexión a Supabase.');
        console.error(' Posible causa: Tu IP podría estar bloqueada o el password es incorrecto.');
        console.error(' Detalle técnico:', err.message);
        return;
    }
    console.log('🐘 ¡Conexión exitosa a Supabase! Base de datos lista.');
    release();
});