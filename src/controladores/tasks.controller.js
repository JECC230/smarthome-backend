import { TasksRepository } from '../repositories/tasks.repository.js';
const repo = new TasksRepository();

export async function getTasks(req, res) {
  try {
    const tasks = await repo.findAll(req.user.house_id);
    res.json({ ok: true, data: tasks });
  } catch (error) { res.status(500).json({ error: error.message }); }
}

export async function getTaskById(req, res) {
  try {
    const task = await repo.findById(req.params.id, req.user.house_id);
    if (!task) return res.status(404).json({ error: 'Tarea no encontrada' });
    res.json({ ok: true, data: task });
  } catch (error) { res.status(500).json({ error: error.message }); }
}

export async function createTask(req, res) {
  try {
    const { title, description, assigned_to } = req.body;
    const newTask = await repo.create({
      title, description, 
      creator_id: req.user.id, 
      assigned_to, 
      house_id: req.user.house_id 
    });
    res.status(201).json({ ok: true, data: newTask });
  } catch (error) { res.status(500).json({ error: error.message }); }
}

export async function updateTask(req, res) {
  try {
    const updated = await repo.update(req.params.id, req.user.house_id, req.body);
    res.json({ ok: true, data: updated });
  } catch (error) { res.status(500).json({ error: error.message }); }
}

export async function deleteTask(req, res) {
  try {
    await repo.delete(req.params.id, req.user.house_id);
    res.status(204).send();
  } catch (error) { res.status(500).json({ error: error.message }); }
}