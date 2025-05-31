const db = require('../config/db');
require('dotenv').config();

const transporter = require('../config/mailer');
const generateToken = require('../utils/generateToken');
const token = generateToken(16);

// user
exports.register = (req, res) => {
    const { username, email, password } = req.body;

    // Step 1: Check if email already exists
    const checkQuery = 'SELECT * FROM USERS WHERE EMAIL = ?';
    db.query(checkQuery, [email], (err, results) => {
        if (err) {
            console.error('Email check error:', err);
            return res.status(500).json({ message: 'Server error during registration' });
        }

        if (results.length > 0) {
            return res.status(409).json({ message: 'Email already exists' });
        }

        // Step 2: Insert user if email not found
        const insertQuery = 'INSERT INTO USERS (USERNAME, EMAIL, PASSWORD) VALUES (?, ?, ?)';
        db.query(insertQuery, [username, email, password], (err, result) => {
            if (err) {
                console.error('Registration error:', err);
                return res.status(500).json({ message: 'Registration failed' });
            }

            const userId = result.insertId;

            // Step 3: Store token for new user
            const insertTokenQuery = 'INSERT INTO tokens (USER_ID, TOKEN) VALUES (?, ?)';
            db.query(insertTokenQuery, [userId, token], (err) => {
                if (err) {
                    console.error('Token storage error:', err);
                    return res.status(500).json({ message: 'Token generation failed' });
                }

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

                // Step 4: Respond with token and basic user info
                res.status(201).json({
                    message: 'User registered successfully',
                    token,
                    user: {
                        id: userId,
                        email,
                        username
                    }
                });
            });
        });
    });
}

exports.login = (req, res) => {
    const { email, password } = req.body;
    const query = 'SELECT * FROM USERS WHERE EMAIL = ? AND PASSWORD = ?';
    // console.log('Login attempt with email:', email, ' and password:', password);

    db.query(query, [email, password], (err, result) => {
        if (err) {
            console.error('Login error:', err);
            return res.status(500).json({ message: 'Login failed' });
        }

        // console.log('Login result:', result);
        // Compare password (assume plain text for now — use bcrypt in real app)
        // if (user.password !== password) {
        //     return res.status(401).json({ message: 'Invalid email or password' });
        // }
        if (result.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const user = result[0];

        if (!user.ISAPPROVED) {
            return res.status(403).json({ message: 'You are not approved by admin yet' });
        }

        if (user.PASSWORD !== password) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // IF approve, Fetch existing token
        const tokenQuery = 'SELECT TOKEN FROM tokens WHERE USER_ID = ? LIMIT 1';
        db.query(tokenQuery, [user.ID], (err, tokenResult) => {
            if (err || tokenResult.length === 0) {
                return res.status(500).json({ message: 'Token not found' });
            }
            const token = tokenResult[0].TOKEN;
            // console.log('Token fetched from DB:', token);
            // ✅ Set HTTP-only cookie
            res.cookie('token', token, {
                httpOnly: true,
                sameSite: 'Lax', // or 'Strict' or 'None' depending on use case
                secure: false, // Set to true if using HTTPS
                // secure: process.env.NODE_ENV === 'production', // use HTTPS in production
                maxAge: 7 * 24 * 60 * 60 * 1000 // 1 week
            });

            res.json({
                message: 'Login successful',
                user: {
                    id: user.ID,
                    email: user.EMAIL,
                    username: user.USERNAME,
                }
            });

            // res.json({
            //     message: 'Login successful',
            //     token,
            //     user: {
            //         id: user.ID,
            //         email: user.EMAIL,
            //         username: user.USERNAME,
            // }
            // });
        });

    });
}

// GLobarl
exports.getShape = (req, res) => {
    db.query("SELECT * FROM SHAPE ORDER BY SID", (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "Faild to fetch Shape" });
        } else {
            res.status(200).json(result);
        }
    });
}

exports.getCut = (req, res) => {
    db.query("SELECT * FROM CUT ORDER BY CID", (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "Faild to fetch Cut" });
        } else {
            res.status(200).json(result);
        }
    });
}

exports.getColor = (req, res) => {
    db.query("SELECT * FROM color ORDER BY CID", (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "Faild to fetch Color" });
        } else {
            res.status(200).json(result);
        }
    });
}

exports.getClarity = (req, res) => {
    db.query("SELECT * FROM clarity ORDER BY CID", (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "Faild to fetch Clarity" });
        } else {
            res.status(200).json(result);
        }
    });
}

exports.getFL = (req, res) => {
    db.query("SELECT * FROM fl", (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "Faild to fetch FL" });
        } else {
            res.status(200).json(result);
        }
    });
}


// Diamond Stock Routes
exports.addDiamondStock = (req, res) => {
    const userId = req.user.id;
    const { barcode, kapan, lot, tag, certificate, weight, shape, color, clarity, cut, pol, sym, length, width, price, drate, amountRs, finalprice, party, due } = req.body;
    const query = `INSERT INTO diamond_stock 
        (USER_ID, BARCODE, KAPAN, PACKET, TAG, CERTIFICATE_NUMBER, WEIGHT, SHAPE, COLOR, CLARITY, CUT, POLISH, SYMMETRY, LENGTH, WIDTH, PRICE_PER_CARAT, DOLLAR_RATE, RS_AMOUNT, FINAL_PRICE, PARTY, DUE, STATUS)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
    // ON DUPLICATE KEY UPDATE
    db.query(query, [userId, barcode, kapan, lot, tag, certificate, weight, shape, color, clarity, cut, pol, sym, length, width, price, drate, amountRs, finalprice, party, due, 'AVAILABLE'], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to add diamond stock" });
        } else {
            res.status(201).json({ message: "Diamond stock added successfully", id: result.insertId });
        }
    });
}

exports.updateStock = (req, res) => {
    const { id } = req.params;
    const { status, party } = req.body;
    if (!party) {
        return res.status(400).json({ message: "Party is required." });
    }
    // console.log("Updating diamond stock with ID:", id, "to party:", party);
    const query = "UPDATE diamond_stock SET STATUS = ?, PARTY = ? WHERE ID = ?";
    db.query(query, [status, party, id], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to update diamond stock" });
        } else if (result.affectedRows === 0) {
            res.status(404).json({ error: "Diamond stock not found" });
        } else {
            res.status(200).json({ message: "Diamond stock Hold successfully" });
        }
    });
}

exports.deleteSell = (req, res) => {
    const { id } = req.params;
    // console.log("Deleting diamond stock with ID:", id);
    const query = `DELETE FROM diamond_stock WHERE ID = ?`;
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to delete diamond stock" });
        } else if (result.affectedRows === 0) {
            res.status(404).json({ error: "Diamond stock not found" });
        } else {
            res.status(200).json({ message: "Diamond stock deleted successfully" });
        }
    });
}

exports.addSell = (req, res) => {
    const { id, stoneid, weight, price, finalprice, drate, amountRs, status, party, due } = req.body;
    // console.log("data = ", req.body);
    const query = `INSERT INTO sell_data (ID, STONE_ID, WEIGHT, PRICE_PER_CARAT, FINAL_PRICE, DOLLAR_RATE, RS_AMOUNT, STATUS, PARTY, DUE) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    db.query(query, [id, stoneid, weight, price, finalprice, drate, amountRs, status, party, due], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to add sell record" });
        } else {
            res.status(201).json({ message: "Sell record added successfully", id: result.insertId });
        }
    });
}

exports.uploadExcel = async (req, res) => {
    const data = req.body;
    const userId = req.user.id;
    // console.log(data[0]);
    if (!Array.isArray(data) || data.length === 0) {
        return res.status(400).json({ message: 'No data received' });
    }

    try {
        const dbPromise = db.promise(); // ✅ get a promise-compatible wrapper
        // Get list of valid column names from the 'stocks' table
        const [columnsRows] = await dbPromise.query("SHOW COLUMNS FROM diamond_stock");
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
            await dbPromise.query(`DELETE FROM DIAMOND_STOCK WHERE STOCKID = ?`, [STOCKID]);

            // Insert new entry
            // await dbPromise.query(`INSERT INTO DIAMOND_STOCK SET ?`, [filteredStock]);
        }

        const insertQuery = `
        INSERT INTO DIAMOND_STOCK (
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
        const [result] = await dbPromise.query(insertQuery, [values]);
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

exports.getDiamondStock = (req, res) => {
    const userId = req.user.id;
    const query = 'SELECT * FROM DIAMOND_STOCK WHERE USER_ID = ? ORDER BY ID';
    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            return res.status(500).json({ message: 'Error fetching data' });
        }
        res.json(results);
    });
}

// Share API
const ApiShareData = require('../models/apiShareData');
const ShareAPI = require('../config/shareAPIEmail');
exports.shareApi = async (req, res) => {
    const { name, email } = req.body;
    const token = req.cookies.token;
    const userId = req.user.id;


    if (!email || !name) return res.status(400).json({ message: 'Email and name are required' });
    if (!token) return res.status(401).json({ message: 'Authentication token missing' });

    try {
        // ShareAPI({ name, email, token });    // send mail
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