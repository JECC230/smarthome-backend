import { pool } from '../db.js';

export class TasksRepository {
  async findAll(houseId) {
    const result = await pool.query(
      `SELECT t.*, u.email as assigned_name 
       FROM tasks t 
       LEFT JOIN users u ON t.assigned_to = u.id 
       WHERE t.house_id = $1 
       ORDER BY t.created_at DESC`,
      [houseId]
    );
    return result.rows;
  }

  async findById(id, houseId) {
    const result = await pool.query(
      `SELECT t.*, u.email as assigned_name 
       FROM tasks t 
       LEFT JOIN users u ON t.assigned_to = u.id 
       WHERE t.id = $1 AND t.house_id = $2`,
      [id, houseId]
    );
    return result.rows[0];
  }

  async create({ title, description, creator_id, assigned_to, house_id }) {
    const result = await pool.query(
      'INSERT INTO tasks (title, description, creator_id, assigned_to, house_id, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, description, creator_id, assigned_to, house_id, 'por hacer']
    );
    return result.rows[0];
  }

  async update(id, houseId, fields) {
    const { title, description, assigned_to, status } = fields;
    const result = await pool.query(
      'UPDATE tasks SET title = $1, description = $2, assigned_to = $3, status = $4 WHERE id = $5 AND house_id = $6 RETURNING *',
      [title, description, assigned_to, status, id, houseId]
    );
    return result.rows[0];
  }

  async delete(id, houseId) {
    const result = await pool.query('DELETE FROM tasks WHERE id = $1 AND house_id = $2 RETURNING id', [id, houseId]);
    return result.rows[0];
  }
}