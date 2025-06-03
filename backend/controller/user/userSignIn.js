const bcrypt = require('bcryptjs')
const userModel = require('../../models/userModel')
const jwt = require('jsonwebtoken');

async function userSignInController(req, res) {
    try {
        const { email, password } = req.body

        if (!email) {
            return res.status(400).json({
                message: "Email is required",
                error: true,
                success: false
            })
        }
        
        if (!password) {
            return res.status(400).json({
                message: "Password is required",
                error: true,
                success: false
            })
        }

        const user = await userModel.findOne({ email })

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password",
                error: true,
                success: false
            })
        }

        const checkPassword = await bcrypt.compare(password, user.password)

        if (!checkPassword) {
            return res.status(401).json({
                message: "Invalid email or password",
                error: true,
                success: false
            })
        }

        const tokenData = {
            _id: user._id,
            email: user.email,
            role: user.role
        }
        
        const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY, { expiresIn: '8h' });

        const tokenOption = {
            httpOnly: true,
            secure: true
        }

        res.cookie("token", token, tokenOption).status(200).json({
            message: "Login successful",
            data: token,
            success: true,
            error: false
        })

    } catch (err) {
        res.status(500).json({
            message: err.message || err,
            error: true,
            success: false,
        })
    }
}

module.exports = userSignInController