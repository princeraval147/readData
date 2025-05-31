const db = require('../config/db'); // or wherever your DB connection is

function authenticateToken(req, res, next) {
    // const authHeader = req.headers['authorization'];
    // const token = authHeader && authHeader.split(' ')[1];
    const token = req.cookies.token; // <-- 🔁 Changed from headers to cookies
    console.log("TOken = ", token);

    if (!token) {
        return res.status(401).json({ message: 'Token missing' });
    }

    const query = 'SELECT user_id FROM tokens WHERE token = ?';
    db.query(query, [token], (err, result) => {
        if (err) {
            console.error('DB error:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        if (result.length === 0) {
            return res.status(403).json({ message: 'Invalid token' });
        }

        req.user = { id: result[0].user_id };
        next();
    });
}

module.exports = authenticateToken;
