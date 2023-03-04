const router = require("express").Router()
const auth = require('../services/authentication')
const userHandler = require('../services/userHandler')
const bet = require('../services/bet')
const f1Driver= require('../services/f1DriverService')
const cronJobTest = require('../services/testcronjob')

router.post("/register", auth.register)

router.post("/login", auth.login)

router.get("/user", auth.user)

router.post("/logout", auth.logout)

router.put("/addFriend", userHandler.addFriend)

router.get('/searchByUserName', userHandler.findByUserName)

router.post('/placeBet', bet.placeBet)

//router.get("/test", cronJobTest.triggerCronJob)

module.exports = router;