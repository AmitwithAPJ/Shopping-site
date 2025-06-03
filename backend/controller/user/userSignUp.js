const userModel = require("../../models/userModel")
const bcrypt = require('bcryptjs');

async function userSignUpController(req, res) {
    try {
        const { email, password, name } = req.body

        // Input validation
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
        
        if (!name) {
            return res.status(400).json({
                message: "Name is required",
                error: true,
                success: false
            })
        }

        // Check if user already exists
        const user = await userModel.findOne({ email })

        if (user) {
            return res.status(409).json({
                message: "User with this email already exists",
                error: true,
                success: false
            })
        }

        // Hash password
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = await bcrypt.hash(password, salt);

        // Create user
        const payload = {
            email,
            name,
            role: "GENERAL",
            password: hashPassword,
            profilePic: req.body.profilePic || ""
        }

        const userData = new userModel(payload)
        const saveUser = await userData.save()

        // Return success response without exposing password
        const { password: _, ...userWithoutPassword } = saveUser.toObject();
        
        res.status(201).json({
            data: userWithoutPassword,
            success: true,
            error: false,
            message: "User created successfully!"
        })

    } catch (err) {
        res.status(500).json({
            message: err.message || err,
            error: true,
            success: false,
        })
    }
}

module.exports = userSignUpController