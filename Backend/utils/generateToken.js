const crypto = require('crypto');
const pool = require('../config/pool');

function newToken(length = 16) {
    // 2 hex characters per byte, so we need length / 2 bytes
    return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
};

async function generateToken() {
    let token;
    let exists = true;

    while (exists) {
        token = newToken(16);
        const [rows] = await pool.query('SELECT TOKEN FROM tokens WHERE token = ?', [token]);
        exists = rows.length > 0;
    }

    return token;
}


module.exports = generateToken;