const express = require('express')
const express_session = require('express-session')
const routes = require('./routes/routes')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieparser = require('cookie-parser')
const cron = require('node-cron')
require('dotenv/config')
const cronJobLogic = require("./services/cronJobLogic");

app = express()

app.use(express.json())

app.use(cookieparser())

app.use(express_session({
    secret: process.env.USER_SECRET_TOKEN,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        domain: process.env.Domain,
        maxAge: 24 * 60 * 60 * 1000
    }
}))

app.use(cors({
    credentials: true,
    origin: ['http://localhost:8080', 'https://www.p10racing.net', 'http://10.0.0.8:8080']
}))

app.use('/api', routes)

mongoose.connect(process.env.P10DBConnection, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

mongoose.connection.once("open", () => console.log("Connected to DB!")).on("Error", error => {
    console.log("Error while connecting to DB: ", error);
})

app.listen(process.env.PORT || 8000, () => {
    console.log("Server Running at port " + (process.env.PORT || "8000"))

})

cron.schedule('0 10 * * 1', async () => {
    await cronJobLogic.calculatePoints()
}, {
    timezone: 'CET'
});