const jwt = require('jsonwebtoken')

async function authToken(req, res, next) {
    try {
        const token = req.cookies?.token

        if (!token) {
            return res.status(401).json({
                message: "Authentication required. Please login.",
                error: true,
                success: false
            })
        }

        jwt.verify(token, process.env.TOKEN_SECRET_KEY, function(err, decoded) {
            if (err) {
                return res.status(401).json({
                    message: "Invalid or expired token. Please login again.",
                    error: true,
                    success: false
                })
            }

            req.userId = decoded?._id
            next()
        });
    } catch (err) {
        res.status(500).json({
            message: "Authentication error: " + (err.message || err),
            data: [],
            error: true,
            success: false
        })
    }
}

module.exports = authToken