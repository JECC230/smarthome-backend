import bcrypt from 'bcryptjs';
import { sign } from '../auth.js';
import { UsersRepository } from '../repositories/users.repository.js';

const repo = new UsersRepository();

export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;
    const user = await repo.findByEmail(email);
    if (!user) return res.status(401).json({ error: 'Credenciales incorrectas' });

    const isPasswordOk = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordOk) return res.status(401).json({ error: 'Credenciales incorrectas' });

    const token = sign({ id: user.id, email: user.email, role: user.role, house_id: user.house_id });
    return res.json({ token, user: { email: user.email, role: user.role, house_id: user.house_id } });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export async function getHouseUsers(req, res) {
  try {
    const { house_id } = req.user;
    const users = await repo.findByHouseId(house_id);
    res.json({ ok: true, data: users });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
}

export async function create(req, res) {
  try {

    const { email, password, role } = req.body; 
    
    //  1. Extraemos el house_id directamente del token del Admin (req.user)
    const { house_id } = req.user; 

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    
    //  2. Inyectamos el house_id seguro en la base de datos
    const newUser = await repo.create({ email, passwordHash, role: role || 'user', house_id });
    return res.status(201).json({ ok: true, user: newUser });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export async function registerAdmin(req, res) {
  try {
    const { email, password } = req.body;

    // 1. Calculamos el siguiente ID de casa disponible automáticamente
    const maxId = await repo.getMaxHouseId();
    const nextHouseId = maxId + 1;

    // 2. Encriptamos contraseña
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    
    // 3. Creamos el admin con su nuevo ID de casa único
    const newUser = await repo.create({ 
      email, 
      passwordHash, 
      role: 'admin', 
      house_id: nextHouseId 
    });

    console.log(` Nueva casa fundada con ID: ${nextHouseId}`);
    res.status(201).json({ ok: true, data: newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}