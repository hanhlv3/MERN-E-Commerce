const asyncHandler = require('express-async-handler')
const nodemailer = require('nodemailer')

const sendMail = asyncHandler(async ({ email, html }) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // Use `true` for port 465, `false` for all other ports
        auth: {
            user: process.env.EMAIL_NAME,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    })

    const info = await transporter.sendMail({
        from: '"Shop Le Hanh" <no-reply@shoplehanh.com>', // sender address
        to: email, // list of receivers
        subject: 'Forgot Password', // Subject line
        html: html, // html body
    })

    return info
})


module.exports = {
    sendMail
}