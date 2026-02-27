// Lógica de validación para los productos del SmartHome Se eliminó la validación de precio por requerimiento del proyecto.
 
export function validarProducto(data) {
    const { nombre, stock, stock_minimo } = data;

    // 1. Validación del nombre: Obligatorio, texto y que no esté vacío
    if (!nombre || typeof nombre !== 'string' || nombre.trim().length < 2) {
        return { 
            ok: false, 
            error: 'El nombre del producto es obligatorio y debe tener al menos 2 caracteres' 
        };
    }

    // 2. Validación de Stock: Debe ser un número y no puede ser negativo
    const s = Number(stock);
    if (stock !== undefined && (!Number.isInteger(s) || s < 0)) {
        return { 
            ok: false, 
            error: 'El stock debe ser un número entero mayor o igual a cero' 
        };
    }

    // 3. Validación de Stock Mínimo
    const sm = Number(stock_minimo);
    if (stock_minimo !== undefined && (!Number.isInteger(sm) || sm < 0)) {
        return { 
            ok: false, 
            error: 'El stock mínimo debe ser un número entero mayor o igual a cero' 
        };
    }

    // Si todo está bien, devolvemos los datos limpios para la DB
    return { 
        ok: true, 
        data: { 
            ...data,
            nombre: nombre.trim()
        } 
    };
}