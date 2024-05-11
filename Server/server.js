const express = require('express')
const dbConnect = require('./config/dbconnect')
const initRoutes = require('./routes')
require('dotenv').config()

const app = express()

const port = process.env.PORT || 3000
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
dbConnect()
initRoutes(app)

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => console.log('Example app listening on port', port))
