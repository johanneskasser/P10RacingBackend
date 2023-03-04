const express = require('express')
const routes = require('./routes/routes')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv/config')

app = express()

app.use(express.json())

app.use('/api', routes)

mongoose.connect(process.env.P10DBConnection, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

mongoose.connection.once("open", () => console.log("Connected to DB!")).on("Error", error => {
    console.log("Error while connecting to DB: ", error);
})

app.listen(process.env.PORT || 8000)