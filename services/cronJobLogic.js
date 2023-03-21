const getLatestResultsService = require("../services/getLatestRoundResultsService");
const getCurrentRoundService = require("../services/getCurrentRoundService");
const bet = require("../models/betModel");
const calculatePointsService = require("../services/calculatePointsService");
const User = require("../models/user");


module.exports = {
    async calculatePoints() {
        console.log("Entering Results Scanning Process...")
        const raceResult = await getLatestResultsService.getLatestResults();
        const lastRace = await getCurrentRoundService.getCurrentRound(new Date(new Date().getTime() - (2 * 24 * 60 * 60 * 1000)))
        if(!(lastRace === -1)) {
            const recentBets = await bet.find({roundNr: lastRace})
            if(recentBets.length === 0) {
                console.log("No Bets to Process for Round NR: " + lastRace)
            } else {
                //console.log(raceResult[raceResult.length - 1].Status._)
                let actualFirstDNF = "n/a"
                let firstDnfPoints = "0"

                let status = raceResult[raceResult.length - 1].Status._

                if(!(status === "Finished" || status.includes("+"))) {
                    actualFirstDNF = raceResult[raceResult.length - 1].Driver.$.code
                }
                for (let i = 0; i < recentBets.length; i++) {
                    console.log("----------------- New Bet -----------------")
                    let postition = null;

                    for (let j = 0; j < raceResult.length; j++) {
                        let driver = raceResult[j].Driver;
                        if (driver.$.code === recentBets[i].p10) {
                            postition = raceResult[j].$.position;
                            break;
                        }
                    }

                    if(actualFirstDNF === recentBets[i].firstDNF) {
                        firstDnfPoints = "15"
                    }

                    const points = calculatePointsService.calculatePoints(postition)
                    let user = await User.findOne({_id: recentBets[i].placedBy})
                    const oldUserPoints = user.points
                    const newPoints = parseInt(user.points) + parseInt(points) + parseInt(firstDnfPoints)
                    await User.updateOne(
                        {_id: recentBets[i].placedBy},
                        {$set: {points: newPoints}}
                    )

                    user = await User.findOne({_id: recentBets[i].placedBy})


                    console.log("ID:                            " + recentBets[i].placedBy)
                    console.log("Username:                      " + user.username)
                    console.log("Driver set for P10:            " + recentBets[i].p10)
                    console.log("Actual Position:               " + postition)
                    console.log("Points for User (P10):         " + points + "\n")
                    console.log("Driver set for firstDNF:       " + recentBets[i].firstDNF)
                    console.log("Actual firstDNF:               " + actualFirstDNF)
                    console.log("Points for firstDNF Bet:       " + firstDnfPoints)

                    console.log("\n-----------------")
                    console.log("Points of User " + user.username + " before bet:       " + oldUserPoints)
                    console.log("Points of User " + user.username + " after bet:        " + user.points)
                    console.log("Total Points earned:                   " + (parseInt(points) + parseInt(firstDnfPoints)))

                    console.log("-----------------   end   -----------------\n")
                }
            }
        } else {
            console.log("Seems like there was no Race this week to process!")
            console.log("2 Days before: " + new Date(new Date().getTime() - (2 * 24 * 60 * 60 * 1000)))
        }
    }
}