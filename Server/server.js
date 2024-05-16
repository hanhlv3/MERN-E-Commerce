const express = require('express')
const dbConnect = require('./config/dbconnect')
const initRoutes = require('./routes')
const cookieParser = require('cookie-parser')
require('dotenv').config()

const app = express()
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
dbConnect()
initRoutes(app)

app.get('/', (req, res) => {
    res.send('Hello World!')
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log('Example app listening on port', port))
