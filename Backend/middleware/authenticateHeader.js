const pool = require('../config/pool');
const jwt = require('jsonwebtoken');

const authenticateHeader = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];
    console.log("API request TOKEN = ", token);
    if (!token || token.length !== 16) {
        return res.status(401).json({ message: 'Unauthorized: Invalid or missing token' });
    }

    try {
        // 1. Check `tokens` table
        const [userTokenResult] = await pool.query('SELECT USER_ID FROM tokens WHERE TOKEN = ?', [token]);
        // if (userTokenResult.length === 0) {
        //     return res.status(403).json({ message: 'Invalid token' });
        // }
        // req.user = { id: userTokenResult[0].USER_ID }; // attach user_id to request
        // next();
        if (userTokenResult.length > 0) {
            req.user = { id: userTokenResult[0].USER_ID };
            return next();
        }

        // 2. Check `api_shares` table
        const [shareTokenResult] = await pool.query(`
            SELECT ID AS shareId, USER_ID, isActive FROM api_shares WHERE TOKEN = ?
            `, [token]);

        if (shareTokenResult.length > 0) {
            const shared = shareTokenResult[0];
            if (!shared.isActive) {
                return res.status(403).json({ message: 'Access denied: API share is inactive' });
            }

            req.user = {
                id: shareTokenResult[0].USER_ID,
                shareId: shareTokenResult[0].shareId,
                isSharedAccess: true
            };
            return next();
        }
        // No match in either table
        return res.status(403).json({ message: 'Invalid token' });
    } catch (err) {
        console.error('Token lookup error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = authenticateHeader;
