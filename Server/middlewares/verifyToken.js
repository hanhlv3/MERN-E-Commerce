const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

const verifyAccessToken = asyncHandler(async (req, res, next) => {
    if (req?.headers?.authorization?.startsWith('Bearer')) {
        const token = req.headers.authorization.split(' ')[1]
        const decoded = await jwt.verify(token, process.env.JWT_SECRET)
        if (decoded === null)
            return res.statusCode(401).json({
                success: false,
                message: 'Invalid access token',
            })

        req.user = decoded
        next()
    } else {
        return res.status(401).json({
            success: false,
            message: 'Require authentication',
        })
    }
})

const isAdmin = asyncHandler(async (req, res, next) => {
    const {role} = req.user
    if (role != 'admin') 
        return res.status(401).json({
            success: false,
            mes: 'Invalid role'
        })

    next()
})

module.exports = {
    verifyAccessToken,
    isAdmin,
}
