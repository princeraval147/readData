require('dotenv').config(); // Always at top
const express = require('express');
const pool = require('./config/pool');
const cors = require('cors');
const db = require('./config/db');
const cookieParser = require('cookie-parser');
const allRoutes = require('./routes/AllRoutes');

const app = express();
const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('Backend is working!');
});

app.set('trust proxy', 1); // Trust NGINX for secure cookies

const allowedOrigins = process.env.CLIENT_ORIGIN?.split(',') || [];
app.use((req, res, next) => {
    const origin = req.headers.origin;
    // console.log("🌐 Incoming request origin:", origin);

    if (origin && allowedOrigins.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin);
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    }

    // ✅ Handle preflight (OPTIONS)
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }

    next();
});


app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

app.use(express.json());

app.use(cookieParser());
app.use(allRoutes);

app.use((err, req, res, next) => {
    console.error('got error:', err);
    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error',
    });
});

app.get('/api/auth/validate-token', async (req, res) => {
    // const authHeader = req.headers['authorization'];
    const token = req.cookies.token; // Get token from HttpOnly cookie
    // console.log('Token From cookie :', token);

    // if (!authHeader) return res.status(401).json({ valid: false, message: 'No token provided' });

    // const token = authHeader.split(' ')[1]; // Expect "Bearer <token>"
    if (!token) return res.status(401).json({ valid: false, message: 'Token is Missing' });

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


// Catch-all route for undefined paths (404 Not Found)
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.originalUrl}`
    });
});

pool.query('SELECT 1')
    .then(() => {
        console.log("✅ MySQL pool connected!");
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("❌ Failed to connect to MySQL:", err.message);
        process.exit(1);
    });


