const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
require('dotenv').config()
const connectDB = require('./config/db')
const router = require('./routes')
const path = require('path');
const fs = require('fs');

// Initialize Express app
const app = express()

// Middleware
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? process.env.FRONTEND_URL || 'https://shopping-site-msp7.onrender.com' 
        : 'http://localhost:3000',
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())

// API Routes
app.use("/api", router)

// Serve static files from the frontend build in production
if (process.env.NODE_ENV === 'production') {
    console.log('Serving static files from frontend build directory');
    // Serve static files - try multiple possible build paths
    const buildPaths = [
        path.join(__dirname, '../frontend/build'),
        path.join(__dirname, '../frontend/dist'),
        path.join(__dirname, '../build'),
        path.join(__dirname, '../dist')
    ];
    
    // Find the first path that exists
    let validBuildPath = buildPaths.find(p => {
        try {
            return fs.existsSync(p);
        } catch (e) {
            return false;
        }
    });
    
    if (!validBuildPath) {
        console.warn('No build directory found. Using default path.');
        validBuildPath = path.join(__dirname, '../frontend/build');
    }
    
    console.log(`Using build path: ${validBuildPath}`);
    app.use(express.static(validBuildPath));
    
    // Handle React routing, return all requests to React app
    app.get('*', (req, res) => {
        res.sendFile(path.join(validBuildPath, 'index.html'));
    });
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({
        message: 'Internal Server Error',
        error: true,
        success: false
    })
})

// 404 handler - only for API routes in production
app.use((req, res, next) => {
    if (req.path.startsWith('/api') || process.env.NODE_ENV !== 'production') {
        res.status(404).json({
            message: 'Route not found',
            error: true,
            success: false
        })
    } else {
        next()
    }
})

const PORT = process.env.PORT || 8080

// Try to connect to database but start server regardless
connectDB()
    .then(() => {
        console.log("MongoDB connected successfully")
    })
    .catch(err => {
        console.error('Failed to connect to database:', err)
        console.log('Starting server without database connection...')
    })
    .finally(() => {
        // Start server regardless of database connection
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    })

