const db = require('../config/db');
const pool = require('../config/pool');

const authenticateToken = async (req, res, next) => {
    // const authHeader = req.headers['authorization'];
    // const token = authHeader && authHeader.split(' ')[1];
    const token = req.cookies.token; // <-- 🔁 Changed from headers to cookies

    if (!token) {
        return res.status(401).json({ message: 'Token missing' });
    }

    const query = 'SELECT user_id FROM tokens WHERE token = ?';

    try {
        const [result] = await pool.query(query, [token]);
        if (result.length === 0) return res.status(403).json({ message: 'Invalid token' });

        req.user = { id: result[0].user_id };
        next();
    } catch (error) {
        console.error("DB error : ", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = authenticateToken;
