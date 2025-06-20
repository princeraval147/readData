const pool = require('../config/pool');
const generateToken = require('../utils/generateToken');

const createShare = async (data) => {
    const token = await generateToken();
    const query = `
        INSERT INTO api_shares (USER_ID, RECIPIENT_EMAIL, NAME, DIFFERENCE, TOKEN)
        VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await pool.query(query, [
        data.userId,
        data.recipientEmail,
        data.Name,
        data.difference || 0,
        token
    ]);
    return { ...result, token }; // this will include insertId
};


const getSharedAPI = (userId) => {
    const query = `
        SELECT * FROM api_shares
        WHERE USER_ID = ?
        ORDER BY SENT_AT DESC
    `;
    return pool.query(query, [userId]);
};

module.exports = {
    createShare,
    getSharedAPI
};
