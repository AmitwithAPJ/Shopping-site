const userModel = require("../../models/userModel")

async function userDetailsController(req, res) {
    try {
        const user = await userModel.findById(req.userId)
        
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                error: true,
                success: false
            })
        }

        // Don't expose password in response
        const { password, ...userWithoutPassword } = user.toObject()

        res.status(200).json({
            data: userWithoutPassword,
            error: false,
            success: true,
            message: "User details retrieved successfully"
        })

    } catch (err) {
        res.status(500).json({
            message: err.message || err,
            error: true,
            success: false
        })
    }
}

module.exports = userDetailsController