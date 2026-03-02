import { jest } from '@jest/globals';
import { sign, requireRole } from '../src/auth.js';


describe('Pruebas Unitarias - Seguridad y Roles (auth.js)', () => {
  
  //  TEST 1: Verificar que el JWT se firme correctamente
  test('Debería generar un token JWT válido (string de 3 partes)', () => {
    const payload = { id: 1, role: 'admin', house_id: 10 };
    const token = sign(payload);
    
    expect(typeof token).toBe('string');
    expect(token.split('.').length).toBe(3); // Todo JWT tiene formato: header.payload.signature
  });

  // TEST 2: Verificar que el middleware permita el paso a un Admin
  test('requireRole debería permitir el acceso (next) si el usuario es admin', () => {
    // Simulamos una petición donde el usuario SÍ es admin
    const req = { user: { role: 'admin' } };
    const res = {};
    const next = jest.fn(); // Función espía de Jest

    const middleware = requireRole('admin');
    middleware(req, res, next);

    expect(next).toHaveBeenCalled(); 
  });

  //  TEST 3: Verificar que el middleware bloquee a un usuario normal intentando ser Admin
  test('requireRole debería bloquear (403) si un "user" intenta acceder a ruta de "admin"', () => {
    // Simulamos una petición de un usuario normal
    const req = { user: { role: 'user' } };
    
    // Simulamos el objeto de respuesta de Express (res)
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    const middleware = requireRole('admin');
    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403); // Debe arrojar error 403 Prohibido
    expect(res.json).toHaveBeenCalled(); // Debe enviar un JSON con el mensaje de error
    expect(next).not.toHaveBeenCalled(); // NO debe dejarlo pasar
  });

});