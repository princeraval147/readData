const express = require('express');
const cors = require('cors');
const db = require('./config/db');
const pool = require('./config/pool');
const cookieParser = require('cookie-parser');
const allRoutes = require('./routes/AllRoutes');

const app = express();
const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT || 5000;
require('dotenv').config();

// ✅ MySQL connection 
db.connect((err) => {
    if (err) {
        console.error('MySQL connection error:', err);
        return;
    }
    console.log('Connected to MySQL');
});

// Only once at startup
pool.query('SELECT 1')
    .then(() => {
        console.log('MySQL pool is connected.');
    })
    .catch((err) => {
        console.error('MySQL pool connection error:', err);
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

app.get('/', (req, res) => {
    res.send('Backend is working!');
});
app.use((err, req, res, next) => {
    console.log("got error");
    console.error(err.stack);
    res.status(500).send('Backend Server not response!');
});



app.post('/api/auth/forgot-password', async (req, res) => {
    const { email, password } = req.body;

    try {
        const [users] = await pool.query('SELECT * FROM USERS WHERE EMAIL = ?', [email]);

        if (users.length === 0) {
            return res.status(404).json({ message: 'Email not found' });
        }

        await pool.query('UPDATE USERS SET PASSWORD = ? WHERE EMAIL = ?', [password, email]);

        // Ideally, hash password before storing — not shown here
        res.json({ message: 'Password reset' });

    } catch (error) {
        console.error('Password reset error:', error);
        res.status(500).json({ message: 'Server error during password reset' });
    }
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
        const [results] = await pool.query(query, [token]);

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
