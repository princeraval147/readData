const pool = require('../config/pool');
const jwt = require('jsonwebtoken');

const authenticateHeader = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];

    if (!token || token.length !== 16) {
        return res.status(401).json({ message: 'Unauthorized: Invalid or missing token' });
    }

    try {
        const [result] = await pool.query('SELECT USER_ID FROM tokens WHERE TOKEN = ?', [token]);

        if (result.length === 0) {
            return res.status(403).json({ message: 'Invalid token' });
        }

        req.user = { id: result[0].USER_ID }; // attach user_id to request
        next();
    } catch (err) {
        console.error('Token lookup error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = authenticateHeader;
