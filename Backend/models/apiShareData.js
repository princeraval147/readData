const db = require('../config/db'); // Your MySQL pool/connection

const createShare = (data) => {
    const query = `
        INSERT INTO api_shares (USER_ID, RECIPIENT_EMAIL, NAME)
        VALUES (?, ?, ?)
    `;
    return db.promise().execute(query, [data.userId, data.recipientEmail, data.Name]);
};

const getSharedAPI = (userId) => {
    const query = `
        SELECT * FROM api_shares
        WHERE USER_ID = ?
        ORDER BY SENT_AT DESC
    `;
    return db.promise().execute(query, [userId]);
};

module.exports = {
    createShare,
    getSharedAPI
};
