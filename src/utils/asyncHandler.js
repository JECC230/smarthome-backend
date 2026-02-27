// Envoltura para manejar errores asíncronos automáticamente
export function asyncHandler(fn) {
    return function (req, res, next) {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}