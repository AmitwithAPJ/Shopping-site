/**
 * Production Start Script
 * 
 * This script sets NODE_ENV to production and starts the server.
 * Works on all platforms including Windows.
 */

// Set environment variable
process.env.NODE_ENV = 'production';

// Import and run the server
require('./backend/index.js'); 