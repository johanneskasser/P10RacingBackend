const router = require("express").Router()
const auth = require('../services/authentication')
const userHandler = require('../services/userHandler')
const bet = require('../services/bet')
const f1Driver= require('../services/f1DriverService')
const cronJobTest = require('../services/testcronjob')
const roundService = require('../services/roundService')
const {protectedRoute} = require('../middleware/routeProtector')

router.post("/register", auth.register)

router.post("/login", auth.login)

router.get("/user", auth.user)

router.post("/logout", protectedRoute, auth.logout)

router.put("/addFriend", protectedRoute, userHandler.addFriend)

router.get('/searchByUserName', protectedRoute, userHandler.findByUserName)

router.post('/placeBet', protectedRoute, bet.placeBet)

router.get('/getCurrentRound', protectedRoute, roundService.returnCurrentRoundAndRaceName)

router.get('/getFriends', protectedRoute, userHandler.getFriends)

//router.get("/test", cronJobTest.triggerCronJob)

module.exports = router;