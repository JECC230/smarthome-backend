export function validarTarea({ title, description, assigned_to }) {
  if (!title || typeof title !== 'string' || title.trim().length < 3) {
    return { ok: false, error: 'Título inválido (mínimo 3 caracteres)' };
  }

  if (!assigned_to || !Number.isInteger(Number(assigned_to))) {
    return { ok: false, error: 'Debes asignar la tarea a un miembro válido' };
  }

  return { 
    ok: true, 
    data: { 
      title: title.trim(), 
      description: description ? description.trim() : '',
      assigned_to: Number(assigned_to)
    } 
  };
}