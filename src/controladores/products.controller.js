import { ProductsRepository } from '../repositories/products.repository.js';
const repo = new ProductsRepository();

export async function getProducts(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const search = req.query.search || '';
    const houseId = req.user.house_id;

    const result = await repo.findAll(houseId, page, limit, search);
    
    res.json({
      ok: true,
      data: result.data,
      meta: result.meta
    });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
}
export async function getProductById(req, res) {
  try {
    const product = await repo.findById(req.params.id, req.user.house_id);
    if (!product) return res.status(404).json({ error: 'No encontrado' });
    res.json({ ok: true, data: product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function createProduct(req, res) {
  try {
    const product = await repo.create({ ...req.body, house_id: req.user.house_id });
    res.status(201).json({ ok: true, data: product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function updateProduct(req, res) {
  try {
    const updated = await repo.update(req.params.id, req.user.house_id, req.body);
    res.json({ ok: true, data: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function deleteProduct(req, res) {
  try {
    await repo.delete(req.params.id, req.user.house_id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}