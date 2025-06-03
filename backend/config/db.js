const mongoose = require("mongoose")

async function connectDB() {
    try {
        // Use default MongoDB URI if environment variable is not set
        const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerce";
        await mongoose.connect(mongoURI)
        console.log("Connected to MongoDB successfully")
    } catch (err) {
        console.log("MongoDB connection error:", err)
        throw err; // Re-throw the error to be caught by the caller
    }
}

module.exports = connectDB
