var axios = require('axios');
const xml2js = require('xml2js')
const f1Race = require('../models/F1Race')

module.exports = {
    async getAllRacesForYear(){
        var config = {
            method: 'get',
            url: 'http://ergast.com/api/f1/2023',
            headers: { }
        };

        axios(config)
            .then(function (response) {
                const racesXML = response.data;
                //console.log(racesXML)
                const parser = new xml2js.Parser({explicitArray: false})
                parser.parseString(racesXML, async (err, res) => {
                        if (err) {
                            console.log(err)
                            return;
                        }

                        const races = res.MRData.RaceTable.Race;

                        for (let i = 0; i < races.length; i++) {
                            await new f1Race({
                                roundNr: races[i].$.round,
                                CircuitName: races[i].RaceName,
                                Date: new Date(races[i].Date)
                            }).save()
                        }
                    }
                )

            })
            .catch(function (error) {
                console.log(error);
            });
    },

    async getCurrentRound(currentDate) {
        const oneWeekMs = 7 * 24 * 60 * 60 * 1000;
        //console.log(currentDate)
        let nextRound = null;
        const races = await f1Race.find()
        races.forEach((race) => {
            const raceDate = new Date(race.Date)
            //console.log(raceDate)

            const timeDiff = raceDate.getTime() - currentDate.getTime();
            //console.log(timeDiff)
            if(timeDiff <= oneWeekMs && timeDiff >= 0) {
                const round = race.roundNr

                if(nextRound === null || round < nextRound) {
                    nextRound = round
                }
            }
        })
        if(nextRound === null) {
            return -1
        }
        console.log("Round NR: ", nextRound)
        return nextRound;
    }
}