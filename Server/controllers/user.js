const User = require('../models/user')

const asyncHandler = require('express-async-handler')

const register = asyncHandler(async (req, res) => {
    const { email, password, firstname, lastname, mobile } = req.body

    if (!email || !password || !firstname || !lastname || !mobile) {
        return res.status(400).json({ 
            status: false, 
            response: 'Missing inut' 
        })
    }

    const response = await User.create(req.body)
    return res.status(200).json({
        sucess: response ? true : false,
        response: response ? response : 'User not created'
    })
})


module.exports = {
    register,
}