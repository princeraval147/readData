const pool = require('../config/pool');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const transporter = require('../config/mailer');
const generateToken = require('../utils/generateToken');
const token = generateToken(16);

// user
exports.register = async (req, res) => {
    const { username, email, password } = req.body;

    // Step 1: Check if email already exists
    try {
        const checkQuery = 'SELECT * FROM users WHERE EMAIL = ?';
        const [existingUsers] = await pool.query(checkQuery, [email]);
        if (existingUsers.length > 0) {
            return res.status(409).json({ message: 'Email already exists' });
        }

        // Step 2: Insert user if email not found
        const insertQuery = 'INSERT INTO users (USERNAME, EMAIL, PASSWORD) VALUES (?, ?, ?)';
        const [insertResult] = await pool.query(insertQuery, [username, email, password]);
        const userId = insertResult.insertId;

        // Step 3: Store token for new user
        const insertTokenQuery = 'INSERT INTO tokens (USER_ID, TOKEN) VALUES (?, ?)';
        await pool.query(insertTokenQuery, [userId, token]);

        // Step 4: Send approval mail
        const mailOptions = {
            from: process.env.MAIL_USER,
            to: 'mahesh.lex@gmail.com',
            subject: 'New User Registration - Approval Needed',
            html: `
                    <p><strong>New user registered on the platform.</strong></p>
                    <ul>
                        <li><strong>Username:</strong> ${username}</li>
                        <li><strong>Email:</strong> ${email}</li>
                    </ul>
                    <p>Please approve this user from Database.</p>
                `

        };
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error('Error sending email:', err);
                // Optional: You can delete user + token here if you want a clean rollback
            } else {
                console.log('Approval email sent:', info.response);
            }
        });

        // Step 5: Send response
        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: userId,
                email,
                username
            }
        });

    } catch (error) {
        console.error("Registration Error : ", error);
        res.status(500).json({ message: 'Server error during registration' });
    }
}


exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // 1. Find user
        const [users] = await pool.query('SELECT * FROM users WHERE EMAIL = ? AND PASSWORD = ?', [email, password]);

        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const user = users[0];

        if (!user.ISAPPROVED) {
            return res.status(403).json({ message: 'You are not approved by admin yet' });
        }

        // 2. Get token
        const [tokenResult] = await pool.query('SELECT TOKEN FROM tokens WHERE USER_ID = ? LIMIT 1', [user.ID]);

        if (tokenResult.length === 0) {
            return res.status(500).json({ message: 'Token not found' });
        }

        const token = tokenResult[0].TOKEN;

        // 3. Set cookie
        // res.cookie('token', token, {
        //     httpOnly: true,
        //     sameSite: 'Lax',
        //     secure: false, // set to true if using HTTPS
        //     maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
        // });
        // Production
        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'None',
            secure: true,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
        });
        // 4. Send response
        res.json({
            message: 'Login successful',
            user: {
                id: user.ID,
                email: user.EMAIL,
                username: user.USERNAME,
            },
        });

    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Login failed' });
    }
}


// exports.login = (req, res) => {
//     const { email, password } = req.body;
//     const query = 'SELECT * FROM USERS WHERE EMAIL = ? AND PASSWORD = ?';

//     db.query(query, [email, password], (err, result) => {
//         if (err) {
//             console.error('Login error:', err);
//             return res.status(500).json({ message: 'Login failed' });
//         }

//         // console.log('Login result:', result);
//         // Compare password (assume plain text for now — use bcrypt in real app)
//         // if (user.password !== password) {
//         //     return res.status(401).json({ message: 'Invalid email or password' });
//         // }
//         if (result.length === 0) {
//             return res.status(401).json({ message: 'Invalid email or password' });
//         }
//         const user = result[0];

//         if (!user.ISAPPROVED) {
//             return res.status(403).json({ message: 'You are not approved by admin yet' });
//         }

//         if (user.PASSWORD !== password) {
//             return res.status(401).json({ message: 'Invalid email or password' });
//         }

//         // IF approve, Fetch existing token
//         const tokenQuery = 'SELECT TOKEN FROM tokens WHERE USER_ID = ? LIMIT 1';
//         db.query(tokenQuery, [user.ID], (err, tokenResult) => {
//             if (err || tokenResult.length === 0) {
//                 return res.status(500).json({ message: 'Token not found' });
//             }
//             const token = tokenResult[0].TOKEN;
//             // console.log('Token fetched from DB:', token);
//             // ✅ Set HTTP-only cookie
//             res.cookie('token', token, {
//                 httpOnly: true,
//                 sameSite: 'Lax', // or 'Strict' or 'None' depending on use case
//                 secure: false, // Set to true if using HTTPS
//                 // secure: process.env.NODE_ENV === 'production', // use HTTPS in production
//                 maxAge: 7 * 24 * 60 * 60 * 1000 // 1 week
//             });

//             res.json({
//                 message: 'Login successful',
//                 user: {
//                     id: user.ID,
//                     email: user.EMAIL,
//                     username: user.USERNAME,
//                 }
//             });

//             // res.json({
//             //     message: 'Login successful',
//             //     token,
//             //     user: {
//             //         id: user.ID,
//             //         email: user.EMAIL,
//             //         username: user.USERNAME,
//             // }
//             // });
//         });

//     });
// }

// GLobarl
exports.getShape = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM shape ORDER BY SID");
        res.status(200).json(rows);
    } catch (error) {
        console.error("DB error : ", error);
        res.status(500).json({ error: "Faild to fetch Shape" });
    }
}

exports.getCut = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM cut ORDER BY CID");
        res.status(200).json(rows);
    } catch (error) {
        console.error("DB error : ", error);
        res.status(500).json({ error: "Faild to fetch Cut " });
    }
}

exports.getColor = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM color ORDER BY CID");
        res.status(200).json(rows);
    } catch (error) {
        console.error("DB error : ", error);
        res.status(500).json({ error: "Failed to fetch color" });
    }
}

exports.getClarity = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM clarity ORDER BY CID");
        res.status(200).json(rows);
    } catch (error) {
        console.error("DB error : ", error);
        res.status(500).json({ error: "Failed to fetch clarity" });
    }
}

exports.getFL = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM fl ORDER BY FID");
        res.status(200).json(rows);
    } catch (error) {
        console.error("DB error : ", error);
        res.status(500).json({ error: "Failed to fetch FL" });
    }
}


// Diamond Stock Routes
exports.addDiamondStock = async (req, res) => {
    const userId = req.user.id;
    const {
        barcode, kapan, lot, tag, certificate, weight,
        shape, color, clarity, cut, pol, sym, length,
        width, price, drate, amountRs, finalprice, due
    } = req.body;
    const query = `INSERT INTO diamond_stock 
        (USER_ID, BARCODE, KAPAN, PACKET, TAG, CERTIFICATE_NUMBER, WEIGHT, SHAPE, COLOR, CLARITY, CUT, POLISH, SYMMETRY, LENGTH, WIDTH, PRICE_PER_CARAT, DOLLAR_RATE, RS_AMOUNT, FINAL_PRICE STATUS)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
    try {
        const [rows] = await pool.query(query, [
            userId, barcode, kapan, lot, tag, certificate, weight,
            shape, color, clarity, cut, pol, sym, length, width, price,
            drate, amountRs, finalprice, 'AVAILABLE'
        ]);
        res.status(201).json(rows);
    } catch (error) {
        console.error("Server Error : ", error);
        res.status(500).json({ error: "Failed to add diamond stock" });
    }
}

exports.updateStock = async (req, res) => {
    const { id } = req.params;
    const { status, party } = req.body;
    const query = "UPDATE diamond_stock SET STATUS = ? WHERE ID = ?";

    try {
        const [result] = await pool.query(query, [status, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Diamond stock not found" });
        }
        res.status(200).json({ message: "Diamond stock updated successfully" });
    } catch (err) {
        console.error("Update error:", err);
        res.status(500).json({ error: "Failed to update diamond stock" });
    }

}

exports.deleteSell = async (req, res) => {
    const { id } = req.params;

    const query = `DELETE FROM diamond_stock WHERE ID = ?`;

    try {
        await pool.query(query, [id]);
        res.status(200).json({ success: true, message: "Diamond stock deleted successfully" });
    } catch (err) {
        console.error("Delete error:", err);
        return res.status(500).json({ error: "Failed to delete diamond stock" });
    }
};

exports.addSell = async (req, res) => {
    const { id, stoneid, weight, price, finalprice, drate, amountRs, status, party, due } = req.body;
    const query = `
        INSERT INTO sell_data (
            ID, STONE_ID, WEIGHT, PRICE_PER_CARAT, FINAL_PRICE, 
            DOLLAR_RATE, RS_AMOUNT, STATUS
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    try {
        const [result] = await pool.query(query, [
            id, stoneid, weight, price, finalprice,
            drate, amountRs, status
        ]);

        res.status(201).json({ message: "Sell record added successfully", id: result.insertId });
    } catch (err) {
        console.error("Add sell error:", err);
        res.status(500).json({ error: "Failed to add sell record" });
    }
};

exports.uploadExcel = async (req, res) => {
    const data = req.body;
    const userId = req.user.id;
    // console.log(data[0]);
    if (!Array.isArray(data) || data.length === 0) {
        return res.status(400).json({ message: 'No data received' });
    }

    try {
        // Get list of valid column names from the 'stocks' table
        const [columnsRows] = await pool.query("SHOW COLUMNS FROM diamond_stock");
        // console.log('Columns:', columnsRows);
        const validColumns = columnsRows.map(row => row.Field);

        for (const stock of data) {
            const { STOCKID } = stock;
            if (!STOCKID) continue;

            // Filter keys to only include valid columns
            const filteredStock = {};
            for (const key of Object.keys(stock)) {
                if (validColumns.includes(key)) {
                    filteredStock[key] = stock[key];
                }
            }

            // Skip if no valid fields remain
            if (Object.keys(filteredStock).length === 0) continue;

            // Delete old entry
            await pool.query(`DELETE FROM diamond_stock WHERE STOCKID = ?`, [STOCKID]);
        }

        const insertQuery = `
        INSERT INTO diamond_stock (
            USER_ID, KAPAN, PACKET, TAG, STOCKID, SHAPE, WEIGHT, COLOR, CLARITY, CUT, POLISH, SYMMETRY, 
            FLUORESCENCE, LENGTH, WIDTH, HEIGHT, SHADE, MILKY, EYE_CLEAN, LAB, CERTIFICATE_COMMENT, REPORT_NO,
            CITY, STATE, COUNTRY, TREATMENT, DEPTH_PERCENT, TABLE_PERCENT, DIAMOND_VIDEO, DIAMOND_IMAGE, 
            RAP_PER_CARAT, PRICE_PER_CARAT, RAP_PRICE, DISCOUNT, FINAL_PRICE, HEART_ARROW, STAR_LENGTH, 
            LASER_DESCRIPTION, GROWTH_TYPE, KEY_TO_SYMBOL, LW_RATIO, CULET_SIZE, CULET_CONDITION, 
            GIRDLE_THIN, GIRDLE_THICK, GIRDLE_CONDITION, GIRDLE_PER, CERTIFICATE_IMAGE, 
            FLUORESCENCE_COLOR, ADMIN_ID, STATUS, DIAMOND_TYPE, IS_ACTIVE, BGM, NO_BGM, TINGE, 
            FANCY_COLOR, FANCY_COLOR_INTENSITY, FANCY_COLOR_OVERTONE, CERTIFICATE_NUMBER, 
            CROWN_HEIGHT, CROWN_ANGLE, PAVILLION_DEPTH, PAVILION_ANGLE
        ) VALUES ?
        `;

        const values = data.map(item => [
            userId,
            item["KAPAN"] || '', item["PACKET"] || '', item["TAG"] || '', item["STOCKID"] || '',
            item["SHAPE"] || '', item["WEIGHT"] || '', item["COLOR"] || '', item["CLARITY"] || '',
            item["CUT"] || '', item["POLISH"] || '', item["SYMMETRY"] || '', item["FLUORESCENCE"] || '',
            item["LENGTH"] || '', item["WIDTH"] || '', item["HEIGHT"] || '', item["SHADE"] || '',
            item["MILKY"] || '', item["EYE_CLEAN"] || '', item["LAB"] || '', item["CERTIFICATE_COMMENT"] || '',
            item["REPORT_NO"] || '', item["CITY"] || '', item["STATE"] || '', item["COUNTRY"] || '',
            item["TREATMENT"] || '', item["DEPTH_PERCENT"] || '', item["TABLE_PERCENT"] || '', item["DIAMOND_VIDEO"] || '',
            item["DIAMOND_IMAGE"] || '', item["RAP_PER_CARAT"] || '', item["PRICE_PER_CARAT"] || '', item["RAP_PRICE"] || '',
            item["DISCOUNT"] || '', item["FINAL_PRICE"] || '', item["HEART_ARROW"] || '', item["STAR_LENGTH"] || '',
            item["LASER_DESCRIPTION"] || '', item["GROWTH_TYPE"] || '', item["KEY_TO_SYMBOL"] || '', item["LW_RATIO"] || '',
            item["CULET_SIZE"] || '', item["CULET_CONDITION"] || '', item["GIRDLE_THIN"] || '', item["GIRDLE_THICK"] || '',
            item["GIRDLE_CONDITION"] || '', item["GIRDLE_PER"] || '', item["CERTIFICATE_IMAGE"] || '', item["FLUORESCENCE_COLOR"] || '',
            item["ADMIN_ID"] || '', item["STATUS"] || 'AVAILABLE', item["DIAMOND_TYPE"] || '', item["IS_ACTIVE"] || '',
            item["BGM"] || '', item["NO_BGM"] || '', item["TINGE"] || '', item["FANCY_COLOR"] || '',
            item["FANCY_COLOR_INTENSITY"] || '', item["FANCY_COLOR_OVERTONE"] || '', item["CERTIFICATE_NUMBER"] || '', item["CROWN_HEIGHT"] || '',
            item["CROWN_ANGLE"] || '', item["PAVILLION_DEPTH"] || '', item["PAVILION_ANGLE"] || ''
        ]);
        // console.log('Column Count:', values[0].length);
        const [result] = await pool.query(insertQuery, [values]);
        res.json({ message: `Inserted ${result.affectedRows} rows` });


        // db.query(insertQuery, [values], (err, result) => {
        //     if (err) {
        //         console.error('Insert error:', err);
        //         return res.status(500).json({ message: 'DB insert failed' });
        //     }
        //     res.json({ message: `Inserted ${result.affectedRows} rows` });
        // });
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

exports.getDiamondStock = async (req, res) => {
    const userId = req.user.id;
    const query = 'SELECT * FROM diamond_stock WHERE USER_ID = ? ORDER BY ID';
    try {
        const [results] = await pool.query(query, [userId]);
        res.json(results);
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).json({ message: 'Error fetching data' });
    }
}

exports.apiDiamondStock = async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        return res.status(400).json({ message: 'User ID missing in token' });
    }
    const query = 'SELECT * FROM diamond_stock WHERE USER_ID = ? ORDER BY ID';
    try {
        const [results] = await pool.query(query, [userId]);
        res.json(results);
    } catch (err) {
        console.error('Error fetching API data ś:', err);
        res.status(500).json({ message: 'Error fetching API data' });
    }
}

// Share API
const ApiShareData = require('../models/apiShareData');
const ShareAPI = require('../config/shareAPIEmail');
// const { useId } = require('react');
exports.shareApi = async (req, res) => {
    const { name, email } = req.body;
    const token = req.cookies.token;
    const userId = req.user.id;

    if (!email || !name) return res.status(400).json({ message: 'Email and name are required' });
    if (!token) return res.status(401).json({ message: 'Authentication token missing' });

    try {
        ShareAPI({ name, email, token });
        res.json({ message: 'Email sent successfully!' });

        // Store in DB api_shares table 
        await ApiShareData.createShare({
            userId: userId,
            recipientEmail: email,
            Name: name
        });

    } catch (error) {
        console.error('Error sending email:', error.message);
        res.status(500).json({ message: 'Failed to send email' });
    }
}

exports.SharedAPI = async (req, res) => {
    const userId = req.user.id;
    try {
        const [rows] = await ApiShareData.getSharedAPI(userId);
        // console.log(rows);
        res.json(rows);
    } catch (err) {
        console.error('Error fetching share history:', err.message);
        res.status(500).json({ message: 'Could not fetch history' });
    }
}