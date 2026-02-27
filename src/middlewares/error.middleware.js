// Manejador centralizado de errores (Punto de la rúbrica)

export function errorHandler(err, req, res, next) {
  console.error('❌ Error detectado:', err.stack);

  // Si el error tiene un status específico, lo usamos, si no, mandamos 500
  const status = err.status || 500;
  const message = err.message || 'Error Interno del Servidor';

  res.status(status).json({
    ok: false,
    error: message
  });
}