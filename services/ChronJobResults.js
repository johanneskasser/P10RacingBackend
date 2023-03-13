const cron = require('node-cron')
const getLatestResultsService = require('../services/getLatestRoundResultsService')
const bet = require("../models/betModel");
const calculatePointsService = require("../services/calculatePointsService");
const User = require("../models/user");
const getCurrentRoundService = require('../services/getCurrentRoundService')

cron.schedule('0 10 * * 1', async () => {
    console.log("Entering Results Scanning Process...")
    const raceResult = await getLatestResultsService.getLatestResults();
    const lastRace = await getCurrentRoundService.getCurrentRound(new Date(new Date().getTime() - (2 * 24 * 60 * 60 * 1000)))
    if(lastRace ===! -1) {
        const highestBetRound = await bet.aggregate([{
            $group: {
                _id: null,
                mostRecentBetRound: {$max: "$roundNr"}
            }
        }])
        const recentBets = await bet.find({roundNr: highestBetRound[0].mostRecentBetRound})
        //console.log(raceResult)
        for (let i = 0; i < recentBets.length; i++) {
            console.log("ID: ", recentBets[i].placedBy)
            let postition = null;

            for (let j = 0; j < raceResult.length; j++) {
                let driver = raceResult[j].Driver;
                if (driver.$.code === recentBets[i].p10) {
                    postition = raceResult[j].$.position;
                    break;
                }
            }
            console.log(recentBets[i].p10)
            console.log(postition)

            const points = calculatePointsService.calculatePoints(postition)
            const user = await User.findOne({_id: recentBets[i].placedBy})
            const newPoints = parseInt(user.points) + parseInt(points)
            await User.updateOne(
                {_id: recentBets[i].placedBy},
                {$set: {points: newPoints}}
            )
        }
    } else {
        console.log("Seems like there was no Race this week to process!")
        console.log("2 Days before: " + new Date(new Date().getTime() - (2 * 24 * 60 * 60 * 1000)))
    }
}, {
    timezone: 'CET'
});