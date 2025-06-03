const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
require('dotenv').config()
const connectDB = require('./config/db')
const router = require('./routes')
const path = require('path');

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
    // Serve static files
    app.use(express.static(path.join(__dirname, '../frontend/build')))
    
    // Handle React routing, return all requests to React app
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'))
    })
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

