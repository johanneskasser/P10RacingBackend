const User = require('../models/user')
const bet = require('../models/betModel')
const getCurrentRoundService = require('./getCurrentRoundService')
const f1Driver = require("../models/F1Driver");

module.exports = {
    async placeBet(req,res) {
        const UID = req.body.uid
        const p10 = req.body.p10
        const firstDNF = req.body.firstDNF

        const user = await User.findOne({_id: UID})
        const f1DriverP10 = await f1Driver.findOne({code: p10})
        const f1DriverDNF = await f1Driver.findOne({code: firstDNF})
        if(!user){
            res.status(404).send({
                message: 'User does not exist!'
            })
        } else {
            if(!f1DriverP10 && !f1DriverDNF) {
                res.status(404).send({
                    message: "Drivers do not exist! Please provide the CODE for each Driver (e.g. HAM for Hamilton)"
                })
            } else {
                const currentTime = new Date()
                const roundNr = await getCurrentRoundService.getCurrentRound(currentTime)
                //console.log(currentTime)
                //const races = await getCurrentRoundService.getAllRacesForYear()
                if(roundNr === -1) {
                    res.status(403).send({
                        message: "There is no upcoming Race!"
                    })
                } else {
                    const duplicate = await bet.findOne({placedBy: UID, roundNr: roundNr});
                    if(duplicate) {
                        res.status(403).send({
                            message: "Bet for this round already set!"
                        })
                    } else {
                        await new bet({
                            placedBy: UID,
                            p10: p10,
                            firstDNF: firstDNF,
                            roundNr: roundNr
                        }).save()
                        res.status(200).send({
                            message: "Bet set successfully!"
                        })
                    }
                }

            }
        }
    }
}