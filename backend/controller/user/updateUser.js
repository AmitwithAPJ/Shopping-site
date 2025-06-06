const userModel = require("../../models/userModel")

async function updateUser(req,res){
    try{
        const sessionUser = req.userId

        const { userId, email, name, role, profilePic } = req.body

        const payload = {
            ...( email && { email : email}),
            ...( name && { name : name}),
            ...( role && { role : role}),
            ...( profilePic && { profilePic : profilePic}),
        }

        const user = await userModel.findById(sessionUser)

        console.log("user.role", user.role)

        const updateUser = await userModel.findByIdAndUpdate(userId, payload, { new: true })
        
        // Remove password from response
        const userResponse = updateUser.toObject();
        delete userResponse.password;
        
        res.json({
            data: userResponse,
            message: "User Updated",
            success: true,
            error: false
        })
    } catch(err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false
        })
    }
}

module.exports = updateUser