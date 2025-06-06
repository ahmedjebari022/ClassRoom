const express = require('express');
const cors = require('cors');
const session = require('express-session'); // ✅ Install: npm install express-session
const connectDB = require('./src/config/database');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Session middleware (MUST come before passport)
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
    resave: false,           // Don't save session if unmodified
    saveUninitialized: false, // Don't create session until something stored
    cookie: {
        secure: false,       // Set to true in production with HTTPS
        httpOnly: true,      // Prevent XSS attacks
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// ✅ Import and initialize passport (AFTER session)
const passport = require('./src/strategies/local-strategy');
app.use(passport.initialize());
app.use(passport.session());

// CORS configuration
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true, // ✅ Important: allows cookies/sessions
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

//Auth Routes
    const authRoutes = require('./src/routes/authRoutes');
    app.use('/api/auth', authRoutes);
// Test route
app.get('/', (req, res) => {
    res.json({ 
        message: 'ClassRoom Server is running!',
        user: req.user || 'Not logged in' // ✅ req.user available after authentication
    });
});

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
            console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
        });
    } catch (error) {
        console.error(`❌ Error starting server: ${error.message}`);
        process.exit(1);
    }
};

startServer();
module.exports = app;