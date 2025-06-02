const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const db = require('./config/db');
const cookieParser = require('cookie-parser');
const allRoutes = require('./routes/AllRoutes');

const app = express();
const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT || 5000;
require('dotenv').config();

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
const allowedOrigins = process.env.CLIENT_ORIGIN?.split(',') || [];

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
    })
);
// app.use(
//     cors({
//         origin: process.env.CLIENT_ORIGIN, // frontend URL
//         credentials: true,               // <== allow cookies
//     })
// );

// app.use(express.json());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use(allRoutes);
// Handle uncaught errors as JSON
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error',
    });
});

//  can't stop server
// app.get('/', (req, res, next) => {
//     throw new Error('BROKEN');
// });

app.get('/', (req, res) => {
    res.send('Backend is working!');
});
app.use((err, req, res, next) => {
    console.log("got error");
    console.error(err.stack);
    res.status(500).send('Backend Server not response!');
});



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

// app.get('/api/auth/approve', (req, res) => {
// const { token } = req.query;
// if (!token) return res.status(400).json({ message: 'Token is required' });

// // Step 1: Find user ID from token
// const findTokenQuery = 'SELECT USER_ID FROM tokens WHERE TOKEN = ?';
// db.query(findTokenQuery, [token], (err, results) => {
//     if (err || results.length === 0) {
//         return res.status(400).json({ message: 'Invalid or expired token' });
//     }

//     const userId = results[0].USER_ID;

//     // Step 2: Update user to isApproved = true
//     const updateUserQuery = 'UPDATE USERS SET isApproved = true WHERE ID = ?';
//     db.query(updateUserQuery, [userId], (err) => {
//         if (err) {
//             return res.status(500).json({ message: 'Failed to approve user' });
//         }

//         // Step 3: Optionally delete token
//         const deleteTokenQuery = 'DELETE FROM tokens WHERE TOKEN = ?';
//         db.query(deleteTokenQuery, [token], () => { });

//         res.send('Your account has been approved. You can now log in.');
//     });
// });
// });



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
app.get('/api/auth/validate-token', async (req, res) => {
    // const authHeader = req.headers['authorization'];
    const token = req.cookies.token; // Get token from HttpOnly cookie
    // console.log('Token From cookie :', token);

    // if (!authHeader) return res.status(401).json({ valid: false, message: 'No token provided' });

    // const token = authHeader.split(' ')[1]; // Expect "Bearer <token>"
    if (!token) return res.status(401).json({ valid: false, message: 'Malformed token' });

    // Check token in DB
    const query = 'SELECT * FROM tokens WHERE TOKEN = ?';

    try {
        const [results] = await db.query(query, [token]);

        if (results.length === 0) {
            return res.status(401).json({ valid: false, message: 'Invalid token' });
        }

        return res.json({
            valid: true,
            user: {
                id: results[0].USER_ID,
            }
        });

    } catch (err) {
        console.error('Token validation error:', err);
        res.status(500).json({ valid: false, message: 'Server error' });
    }

    // db.query(query, [token], (err, results) => {
    //     if (err) return res.status(500).json({ valid: false, message: 'Server error' });
    //     if (results.length === 0) {
    //         return res.status(401).json({ valid: false, message: 'Invalid token' });
    //     }
    //     // Token is valid, you can send back user info if you want
    //     return res.json({
    //         valid: true,
    //         user: {
    //             id: results[0].USER_ID,
    //             // Add more user info if needed by joining tables
    //         }
    //     });
    // });
});

// app.post('/api/auth/logout', (req, res) => {
//     res.cookie('token', '', {
//         httpOnly: true,
//         expires: new Date(0),
//         path: '/'
//     });
//     res.json({ message: 'Logged out' });
// });
// Production logout
app.post('/api/auth/logout', (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        sameSite: 'None',  // must match cookie settings from login
        secure: true,      // must match cookie settings from login
        expires: new Date(0),
        path: '/',         // path must match cookie path
    });
    res.json({ message: 'Logged out' });
});




app.listen(PORT, () => {
    console.log(`Server running on http://${HOST}:${PORT}`);
});
