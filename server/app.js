const express = require('express');
const cors = require('cors');
const session = require('express-session'); // ✅ Install: npm install express-session
const connectDB = require('./src/config/database');
require('dotenv').config();
const MongoStore = require('connect-mongo');
const app = express();
const PORT = process.env.PORT || 3000;


app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
    resave: false,           
    saveUninitialized: false,
    
    store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    touchAfter: 24 * 3600, 
    ttl: 7 * 24 * 60 * 60, 
  }),
    
    cookie: {
        secure: process.env.NODE_ENV === 'production',       // Set to true in production with HTTPS
        httpOnly: true,      
        maxAge: 24 * 60 * 60 * 1000 ,
        sameSite: 'strict', 
    },
  
    name: 'classroom.sid', 
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
//User Routes
    const userRoutes = require('./src/routes/userRoutes'); 
    app.use('/api/users', userRoutes);
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