const db = require('../config/db');
const pool = require('../config/pool');

const authenticateToken = async (req, res, next) => {
    // const authHeader = req.headers['authorization'];
    // const token = authHeader && authHeader.split(' ')[1];
    const token = req.cookies.token; // <-- 🔁 Changed from headers to cookies
    if (!token) {
        return res.status(401).json({ message: 'Token missing' });
    }
    console.log("Console from authMiddleware ", token)

    const query = 'SELECT USER_ID FROM tokens WHERE TOKEN = ?';

    try {
        const [result] = await pool.query(query, [token]);
        if (result.length === 0) return res.status(403).json({ message: 'Invalid token' });

        req.user = { id: result[0].USER_ID };
        console.log("Console from authMiddleware ", req.user);

        next();
    } catch (error) {
        console.error("DB error : ", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = authenticateToken;
