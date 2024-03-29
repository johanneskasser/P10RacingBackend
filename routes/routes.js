const router = require("express").Router()
const auth = require('../services/authentication')
const userHandler = require('../services/userHandler')
const bet = require('../services/bet')
const f1Driver= require('../services/f1DriverService')
const cronJobTest = require('../services/testcronjob')
const roundService = require('../services/roundService')
const {protectedRoute} = require('../middleware/routeProtector')

/**
 * Routes with Route Protection middleware
 */

/*
router.get('/', auth.upMessage)

router.post("/register", auth.register)

router.post("/login", auth.login)

router.get("/user", auth.user)

router.post("/logout", protectedRoute, auth.logout)

router.put("/addFriend", protectedRoute, userHandler.addFriend)

router.get('/searchByUserName', protectedRoute, userHandler.findByUserName)

router.post('/placeBet', protectedRoute, bet.placeBet)

router.get('/getCurrentRound', protectedRoute, roundService.returnCurrentRoundAndRaceName)

router.get('/getFriends', protectedRoute, userHandler.getFriends)

router.get('/getBets', protectedRoute, bet.getBets)

//router.get("/test", cronJobTest.triggerCronJob)
*/

/**
 * Routes without route protection middleware
 */
router.get('/', auth.upMessage)

router.post("/register", auth.register)

router.post("/login", auth.login)

router.get("/user", auth.user)

router.post("/logout", auth.logout)

router.put("/addFriend",  userHandler.addFriend)

router.get('/searchByUserName', userHandler.findByUserName)

router.post('/placeBet', bet.placeBet)

router.get('/getCurrentRound', roundService.returnCurrentRoundAndRaceName)

router.get('/getFriends', userHandler.getFriends)

router.get('/getBets', bet.getBets)

//router.get("/test", cronJobTest.triggerCronJob)

module.exports = router;