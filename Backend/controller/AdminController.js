require('dotenv').config();
const pool = require('../config/db');


// Admin panel
exports.checkAdmin = async (req, res) => {
    try {
        const userId = req.user.id;
        const [result] = await pool.query('SELECT ISADMIN FROM users WHERE ID = ?', [userId]);
        const isAdmin = result.length && result[0].ISADMIN === 1;
        if (isAdmin) {
            return res.json({ isAdmin: true });
        } else {
            return res.status(403).json({ isAdmin: false, message: 'Not an admin' });
        }
    } catch (error) {
        console.error("Error while Check Admin", error);
        res.status(500).json({ message: 'Cannot check Admin' });
    }
};

exports.totalUsers = async (req, res) => {
    try {
        const [response] = await pool.query("SELECT COUNT(*) AS TOTALUSERS FROM users");
        res.json(response);
    } catch (error) {
        console.error("Error While count Total users");
        res.status(500).json({ message: 'Cannot Count users' });
    }
}

exports.totalStocks = async (req, res) => {
    try {
        const [response] = await pool.query("SELECT COUNT(*) AS TOTALSTOCK FROM diamond_stock");
        res.json(response);
    } catch (error) {
        console.error("Error While count Total users");
        res.status(500).json({ message: 'Cannot Count users' });
    }
}

exports.AllUsers = async (req, res) => {
    try {
        // const [response] = await pool.query("SELECT * FROM users WHERE ISAPPROVED = 0 ORDER BY ID DESC");
        const [response] = await pool.query("SELECT * FROM users ORDER BY LAST_LOGIN");
        res.json(response);
    } catch (error) {
        console.error("Error While count Total users", error);
        res.status(500).json({ message: 'Cannot Count users' });
    }
}

exports.ApproveUsers = async (req, res) => {
    const { id } = req.body;
    try {
        const [response] = await pool.query("UPDATE users SET ISAPPROVED = TRUE WHERE ID = ?", id);
        res.json(response);
    } catch (error) {
        console.error("Error While Approve users", error);
        res.status(500).json({ message: 'Cannot Approve users' });
    }
}

exports.DeactivateUsers = async (req, res) => {
    const { id } = req.body;
    try {
        const [response] = await pool.query("UPDATE users SET ISAPPROVED = FALSE WHERE ID = ?", id);
        res.json(response);
    } catch (error) {
        console.error("Error While Approve users", error);
        res.status(500).json({ message: 'Cannot Approve users' });
    }
}

exports.getStockByUser = async (req, res) => {
    try {
        const [result] = await pool.query(`
      SELECT 
          u.ID AS user_id,
          u.USERNAME,
          COUNT(s.ID) AS stock_count
      FROM users u
      LEFT JOIN diamond_stock s ON u.ID = s.USER_ID
      GROUP BY u.ID, u.USERNAME
    `);

        res.json(result);
    } catch (error) {
        console.error("Error fetching stock by user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};