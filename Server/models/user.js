const { default: mongoose } = require('mongoose')
const bcrypt = require('bcrypt')
const crypto = require('crypto')

const saltRounds = 10
var userSchema = new mongoose.Schema(
    {
        firstname: {
            type: String,
            required: true,
        },
        lastname: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        mobile: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },

        role: {
            type: String,
            default: 'user',
        },
        cart: [
            {
                product: { type: mongoose.Types.ObjectId, ref: 'Product' },
                quantity: Number,
                color: String,
            },
        ],
        address: String,
        wishlist: [{ type: mongoose.Types.ObjectId, ref: 'Product' }],
        isBlocked: {
            type: Boolean,
            default: false,
        },
        refreshToken: {
            type: String,
        },
        passwordChangeAt: {
            type: String,
        },
        passwordResetToken: {
            type: String,
        },
        passwordResetExpires: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
)

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) next()

    const salt = bcrypt.genSaltSync(saltRounds)
    this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods = {
    isCorrectPassword: async function (password) {
        return await bcrypt.compare(password, this.password)
    },
    createPasswordResetToken: function () {
        const token = crypto.randomBytes(32).toString()
        this.passwordResetToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex')
        this.passwordResetExpires = Date.now() + 15 * 60 * 1000
        return this.passwordResetToken
    },
}

module.exports = mongoose.model('User', userSchema)
