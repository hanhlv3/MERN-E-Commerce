const User = require('../models/user')
const {
    generateAccessToken,
    generateRefreshToken,
} = require('../middlewares/jwt')
const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const { sendMail } = require('../utils/sendMail')

const register = asyncHandler(async (req, res) => {
    const { email, password, firstname, lastname, mobile } = req.body

    if (!email || !password || !firstname || !lastname || !mobile)
        return res.status(400).json({
            status: false,
            response: 'Missing inut',
        })

    const user = await User.findOne({ email })

    if (user) throw new Error('User has existed')
    else {
        const newUser = await User.create(req.body)
        return res.status(200).json({
            sucess: newUser ? true : false,
            mes: newUser ? 'Register is successfully' : 'Something went wrong',
        })
    }
})

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    if (!email || !password)
        return res.status(400).json({
            status: false,
            response: 'Missing inut',
        })

    const user = await User.findOne({ email })

    if (user && (await user.isCorrectPassword(password))) {
        const { password, role, refreshToken, ...userData } = user.toObject()
        const accessToken = generateAccessToken(userData._id, role)
        const refreshTokenData = generateRefreshToken(userData._id)

        await User.findByIdAndUpdate(
            userData._id,
            { refreshToken: refreshTokenData },
            { new: true }
        )
        // save to cookie
        res.cookie('refreshToken', refreshTokenData, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        return res.status(200).json({
            sucess: true,
            accessToken,
            userData,
        })
    } else throw new Error('Invalid credentials')
})

const getCurrent = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const user = await User.findById(_id).select(
        '-refreshToken -password -role'
    )

    return res.status(200).json({
        success: user ? true : false,
        userData: user ? user : 'User not found',
    })
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const cookie = req.cookies

    if (!cookie || !cookie.refreshToken)
        throw new Error('No refresh token in cookies')
    const decode = jwt.verify(cookie.refreshToken, process.env.JWT_SECRET)

    if (decode === null) throw new Error('Invalid refresh token')

    const response = await User.findOne({
        _id: decode._id,
        refreshToken: cookie.refreshToken,
    })

    return res.status(200).json({
        success: response ? true : false,
        newAccessToken: response
            ? generateAccessToken(response._id, response.role)
            : 'Fail',
    })
})

const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies
    if (!cookie || !cookie.refreshToken) throw new Error('Not token')

    await User.findOneAndUpdate(
        { refreshToken: cookie.refreshToken },
        { refreshToken: '' },
        { new: true }
    )
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
    })

    return res.status(200).json({
        success: true,
        mes: 'Logout is done',
    })
})

const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.query
    if (!email) throw new Error('Missing email')

    const user = await User.findOne({ email })
    if (!user) throw new Error('User not found')

    const token = user.createPasswordResetToken()
    await user.save()
    console.log(token)
    const html = `Vui lòng click vào link bên dưới để thay đổi mật khẩu, hạn chỉ 15 phút 
        <a href='${process.env.URL_SERVER}/api/user/reset-password?token=${token}'>Click here</a>`

    const data = {
        email,
        html,
    }

    const rs = await sendMail(data)

    return res.status(200).json({
        success: true,
        mes: 'Please check mail',
    })
})

const changePassword = asyncHandler(async (req, res) => {
    const { token, password } = req.body
    if (!token || !password) throw new Error('Missing input')
    const passwordResetToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex')
    const user = await User.findOne({
        passwordResetToken,
        passwordResetExpires: { $gt: Date.now() },
    })

    if (!user) throw new Error('Invalid user')
    
    user.passwordChangeAt = Date.now()
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    await user.save()

    return res.status(200).json({
        success: user ? true : false,
        mes: user ? 'updated password' : 'Something went wrong' 
    })
})

module.exports = {
    register,
    login,
    getCurrent,
    refreshAccessToken,
    logout,
    forgotPassword,
}
