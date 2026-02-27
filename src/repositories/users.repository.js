import { pool } from '../db.js';

export class UsersRepository {
  async findByEmail(email) {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  }

  async findByHouseId(houseId) {
    const result = await pool.query(
      'SELECT id, email, role FROM users WHERE house_id = $1', 
      [houseId]
    );
    return result.rows;
  }

  //  Obtiene el ID de casa más alto
  async getMaxHouseId() {
    const result = await pool.query('SELECT MAX(CAST(house_id AS INTEGER)) as max FROM users');
    return result.rows[0].max || 0;
  }

  async create({ email, passwordHash, role, house_id }) {
    const query = `
      INSERT INTO users (email, password_hash, role, house_id)
      VALUES ($1, $2, $3, $4)
      RETURNING id, email, role, house_id;
    `;
    const result = await pool.query(query, [email, passwordHash, role, house_id]);
    return result.rows[0];
  }
}