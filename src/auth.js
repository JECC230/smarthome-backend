import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'llave_fort_knox_2026_secreta';

export function sign(payload) {
    return jwt.sign(payload, SECRET, { expiresIn: '2h' });
}

export function authMiddleware(req, res, next) {
    const header = req.headers.authorization;

    if (!header) {
        return res.status(401).json({ error: 'No autorizado: Falta Authorization Header' });
    }

    const [type, token] = header.split(' ');

    if (type !== 'Bearer' || !token) {
        return res.status(401).json({ error: 'Formato de token inválido. Usa Bearer' });
    }

    try {
        const decoded = jwt.verify(token, SECRET);
        req.user = decoded; 
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido o expirado' });
    }
}

export function requireRole(...roles) {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ error: `Prohibido: Se requiere rol ${roles.join(' o ')}` });
        }
        next();
    };
}