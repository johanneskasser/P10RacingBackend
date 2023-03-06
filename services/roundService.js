const currentRoundService = require('./getCurrentRoundService')
const axios = require('axios')
const f1Race = require('../models/F1Race')

module.exports = {
    async returnCurrentRoundAndRaceName(req, res) {
        const current = new Date()
        //console.log(current)
        const currentRound = await currentRoundService.getCurrentRound(current)
        //console.log(currentRound)
        if(currentRound === -1) {
            res.status(403).send({
                message: "No upcoming Races within one Week!"
            })
        } else {
            const race = await f1Race.findOne({roundNr: currentRound});
            //console.log(race)
            res.status(200).send({raceNr: currentRound, raceName: race.CircuitName})
        }

    }
}