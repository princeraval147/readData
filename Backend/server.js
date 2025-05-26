const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const db = require('./config/db');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = 5000;

// Base paths
const sourceDir = path.join('E:', 'Work', 'BhaktiGems', 'Sarin');
const doneDir = path.join(sourceDir, 'Done');
const errorDir = path.join(sourceDir, 'Error');

// ✅ MySQL connection 


db.connect((err) => {
    if (err) {
        console.error('MySQL connection error:', err);
        return;
    }
    console.log('Connected to MySQL');
});


// app.use(cors());
app.use(
    cors({
        origin: "http://localhost:5173", // frontend URL
        credentials: true,               // <== allow cookies
    })
);
// app.use(express.json());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());



app.get('/csv/:filename', (req, res) => {
    const filename = req.params.filename.trim();
    const filePath = path.join(sourceDir, filename);

    fs.readFile(filePath, 'utf8', (readErr, data) => {
        if (readErr) {
            console.error('Error reading file:', readErr.message);

            // Try to move to Error folder
            const errorPath = path.join(errorDir, filename);
            fs.rename(filePath, errorPath, (moveErr) => {
                if (moveErr) {
                    console.error('Failed to move file to Error:', moveErr.message);
                } else {
                    console.log(`File moved to Error/: ${filename}`);
                }
            });

            return res.status(500).json({ error: 'Failed to read CSV, moved to Error' });
        }

        // Success: send file and move to Done
        res.send(data);

        setTimeout(() => {
            const donePath = path.join(doneDir, filename);
            fs.rename(filePath, donePath, (moveErr) => {
                if (moveErr) {
                    console.error('Failed to move file to Done:', moveErr.message);
                } else {
                    console.log(`File moved to Done/: ${filename}`);
                }
            });
        }, 1000);
    });
});

app.get('/csv-files', (req, res) => {
    const sourceDir = path.join('E:', 'Work', 'BhaktiGems', 'Sarin');

    fs.readdir(sourceDir, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read folder' });
        }

        const csvFiles = files.filter(file => file.toLowerCase().endsWith('.csv'));
        res.json(csvFiles);
    });
});

// ✅ API to save CSV data
app.post('/api/save-csv', (req, res) => {
    const csvData = req.body.data;
    if (!Array.isArray(csvData) || csvData.length === 0) {
        return res.status(400).json({ message: 'No data to insert' });
    }

    // Customize this based on your database schema
    const insertQuery = `
        INSERT INTO planning (TAG, USERNAME, STONENAME, KAPAN, PACKET, ROUGHWGT, PARTWGT, POLISHWGT, COLOR, SHAPE, CLARITY, CUT, EX1, EX2, PRICEPERCARAT, PRICEDISCOUNT, VALUENOCOMMA, LENGTH, WIDTH, TOTALPRICE, TOTALPOLISHWGT, TOTALPARTUSAGE) VALUES ?
    `;

    const values = csvData.map(row => [
        row['Tag'],
        row['CurrentUserName'],
        row['StoneName'],
        row['Kapan'],
        row['Packet'],
        row['ROUGHWEIGHT'],
        row['PartWeight'],
        row['PolishWeight'],
        row['Color'],
        row['ShapeName'],
        row['Clarity'],
        row['CutGrade'],
        row['EX'],
        row['EX'],
        row['PricePerCaratNoComma'],
        row['PriceDiscount'],
        row['ValueNoComma'],
        row['Length'],
        row['Width'],
        row['TotalPriceNoComma'],
        row['TotalPolishWeight'],
        row['TotalPartUsage'],
    ]);
    // console.log('Column count:', 17);
    // console.log('First row value count:', values[0].length);

    db.query(insertQuery, [values], (err, result) => {
        if (err) {
            console.error('Insert error:', err);
            return res.status(500).json({ message: 'DB insert failed' });
        }
        res.json({ message: `Inserted ${result.affectedRows} rows` });
    });
});

// EXCEL Data 
app.post('/api/upload-excel', async (req, res) => {
    const data = req.body;
    // console.log(data[0]);
    if (!Array.isArray(data) || data.length === 0) {
        return res.status(400).json({ message: 'No data received' });
    }


    const insertQuery = `
        INSERT INTO DIAMOND_STOCK (
            KAPAN, PACKET, TAG, STOCKID, SHAPE, WEIGHT, COLOR, CLARITY, CUT, POLISH, SYMMETRY, 
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
        item["ADMIN_ID"] || '', item["STATUS"] || '', item["DIAMOND_TYPE"] || '', item["IS_ACTIVE"] || '',
        item["BGM"] || '', item["NO_BGM"] || '', item["TINGE"] || '', item["FANCY_COLOR"] || '',
        item["FANCY_COLOR_INTENSITY"] || '', item["FANCY_COLOR_OVERTONE"] || '', item["CERTIFICATE_NUMBER"] || '', item["CROWN_HEIGHT"] || '',
        item["CROWN_ANGLE"] || '', item["PAVILLION_DEPTH"] || '', item["PAVILION_ANGLE"] || ''
    ]);
    // console.log('Column Count:', values[0].length);

    db.query(insertQuery, [values], (err, result) => {
        if (err) {
            console.error('Insert error:', err);
            return res.status(500).json({ message: 'DB insert failed' });
        }
        res.json({ message: `Inserted ${result.affectedRows} rows` });
    });
});

const authenticateToken = require('./middleware/authMiddleware');
app.get('/api/get-diamondstock', authenticateToken, (req, res) => {
    const query = 'SELECT * FROM DIAMOND_STOCK';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            return res.status(500).json({ message: 'Error fetching data' });
        }
        res.json(results);
    });
});



// user login
// app.post('/api/auth/register', (req, res) => {
//     const { username, email, password } = req.body;

//     // Step 1: Check if email already exists
//     const checkQuery = 'SELECT * FROM USERS WHERE EMAIL = ?';
//     db.query(checkQuery, [email], (err, results) => {
//         if (err) {
//             console.error('Email check error:', err);
//             return res.status(500).json({ message: 'Server error during registration' });
//         }

//         if (results.length > 0) {
//             return res.status(409).json({ message: 'Email already exists' });
//         }

//         // Step 2: Insert user if email not found
//         const insertQuery = 'INSERT INTO USERS (USERNAME, EMAIL, PASSWORD) VALUES (?, ?, ?)';
//         db.query(insertQuery, [username, email, password], (err, result) => {
//             if (err) {
//                 console.error('Registration error:', err);
//                 return res.status(500).json({ message: 'Registration failed' });
//             }

//             res.json({ message: 'User registered successfully' });
//         });
//     });
// });

const crypto = require('crypto');

// Utility: Generate short random token
function generateToken(length = 12) {
    return crypto.randomBytes(length)
        .toString('base64')
        .replace(/[^a-zA-Z0-9]/g, '')
        .slice(0, length);
}

app.post('/api/auth/register', (req, res) => {
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
            const token = generateToken(16);

            // Step 3: Store token for new user
            const insertTokenQuery = 'INSERT INTO tokens (USER_ID, TOKEN) VALUES (?, ?)';
            db.query(insertTokenQuery, [userId, token], (err) => {
                if (err) {
                    console.error('Token storage error:', err);
                    return res.status(500).json({ message: 'Token generation failed' });
                }

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
});

app.post('/api/auth/login', (req, res) => {
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

        // Fetch existing token
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
});


app.post('/api/auth/forgot-password', (req, res) => {
    const { email, password } = req.body;
    // Check if the email exists in the database
    const checkQuery = 'SELECT * FROM USERS WHERE EMAIL = ?';
    db.query(checkQuery, [email], (err, results) => {
        if (err) {
            console.error('Email check error:', err);
            return res.status(500).json({ message: 'Server error during password reset' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Email not found' });
        }

        const updatePassword = "UPDATE USERS SET PASSWORD = ? WHERE EMAIL = ?";
        db.query(updatePassword, [password, email], (err, result) => {
            if (err) {
                console.error('Password update error:', err);
                return res.status(500).json({ message: 'Password update failed' });
            }
        });
        // Here you would typically send a password reset email
        res.json({ message: 'Password reset' });
    });
});


// Assuming you store tokens in DB table `tokens` with columns: USER_ID, TOKEN
app.get('/api/auth/validate-token', (req, res) => {
    // const authHeader = req.headers['authorization'];
    const token = req.cookies.token; // Get token from HttpOnly cookie
    // console.log('Token From cookie :', token);

    // if (!authHeader) return res.status(401).json({ valid: false, message: 'No token provided' });

    // const token = authHeader.split(' ')[1]; // Expect "Bearer <token>"
    if (!token) return res.status(401).json({ valid: false, message: 'Malformed token' });

    // Check token in DB
    const query = 'SELECT * FROM tokens WHERE TOKEN = ?';
    db.query(query, [token], (err, results) => {
        if (err) return res.status(500).json({ valid: false, message: 'Server error' });
        if (results.length === 0) {
            return res.status(401).json({ valid: false, message: 'Invalid token' });
        }
        // Token is valid, you can send back user info if you want
        return res.json({
            valid: true,
            user: {
                id: results[0].USER_ID,
                // Add more user info if needed by joining tables
            }
        });
    });
});

app.post('/api/auth/logout', (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0),
        path: '/'
    });
    res.json({ message: 'Logged out' });
});





// [doneDir, errorDir].forEach(dir => {
//     if (!fs.existsSync(dir)) {
//         fs.mkdirSync(dir);
//     }
// });

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
