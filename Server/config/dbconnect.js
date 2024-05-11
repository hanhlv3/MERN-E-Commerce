const { default: mongoose } = require('mongoose')

const dbConnect = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI)
        if (conn.connection.readyState === 1) {
            console.log('MongoDB Connected')
        } else {
            console.log('Failed to connect')
        }
    } catch (error) {
        console.log(error.message)
        throw new Error(error.message)
    }
}

module.exports = dbConnect
