const crypto = require('crypto');

module.exports = function generateToken(length = 12) {
    return crypto.randomBytes(length)
        .toString('base64')
        .replace(/[^a-zA-Z0-9]/g, '')
        .slice(0, length);
}

