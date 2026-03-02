import { pool } from '../db.js';

export class ProductsRepository {
  async findAll(houseId, page = 1, limit = 12, search = '') {
    const offset = (page - 1) * limit;
    const searchParam = `%${search}%`;

    // Consulta para obtener los productos con filtro de búsqueda global
    const productsQuery = `
      SELECT * FROM productos 
      WHERE house_id = $1 
      AND (nombre ILIKE $4 OR marca ILIKE $4 OR categoria ILIKE $4)
      ORDER BY created_at DESC 
      LIMIT $2 OFFSET $3
    `;
    const productsResult = await pool.query(productsQuery, [houseId, limit, offset, searchParam]);

    // Consulta para contar el total de coincidencias (para la paginación correcta)
    const countQuery = `
      SELECT COUNT(*) FROM productos 
      WHERE house_id = $1 
      AND (nombre ILIKE $2 OR marca ILIKE $2 OR categoria ILIKE $2)
    `;
    const countResult = await pool.query(countQuery, [houseId, searchParam]);
    const totalItems = parseInt(countResult.rows[0].count);

    return {
      data: productsResult.rows,
      meta: {
        totalItems,
        totalPaginas: Math.ceil(totalItems / limit),
        paginaActual: Number(page)
      }
    };
  }

  async findById(id, houseId) {
    const result = await pool.query(
      'SELECT * FROM productos WHERE id = $1 AND house_id = $2',
      [id, houseId]
    );
    return result.rows[0];
  }

  //  Busca coincidencias exactas ignorando mayúsculas/minúsculas
  async findByNombre(nombre, houseId) {
    const result = await pool.query(
      'SELECT * FROM productos WHERE LOWER(nombre) = LOWER($1) AND house_id = $2 LIMIT 1',
      [nombre, houseId]
    );
    return result.rows[0];
  }

  async create({ nombre, categoria, marca, descripcion, stock, stock_minimo, house_id }) {
    const query = `
      INSERT INTO productos (nombre, categoria, marca, descripcion, stock, stock_minimo, house_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const result = await pool.query(query, [nombre, categoria, marca, descripcion, stock, stock_minimo, house_id]);
    return result.rows[0];
  }

  async update(id, houseId, fields) {
    const { stock } = fields;
    const result = await pool.query(
      'UPDATE productos SET stock = $1 WHERE id = $2 AND house_id = $3 RETURNING *',
      [stock, id, houseId]
    );
    return result.rows[0];
  }

  async delete(id, houseId) {
    await pool.query('DELETE FROM productos WHERE id = $1 AND house_id = $2', [id, houseId]);
  }
}