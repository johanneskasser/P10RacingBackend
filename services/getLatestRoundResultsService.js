var axios = require('axios');
const xml2js = require("xml2js");
const f1Race = require("../models/F1Race");

module.exports = {
    async getLatestResults() {
        return new Promise((resolve, reject) => {
            var config = {
                method: 'get',
                url: 'http://ergast.com/api/f1/current/last/results',
                headers: { }
            };

            axios(config)
                .then(function (response) {
                    const driverStandingsXML = response.data;
                    //console.log(racesXML)
                    const parser = new xml2js.Parser({explicitArray: false})
                    parser.parseString(driverStandingsXML, async (err, res) => {
                            if (err) {
                                console.log(err)
                                reject(err);
                            } else {
                                resolve(res.MRData.RaceTable.Race.ResultsList.Result);
                            }
                        }
                    )
                })
                .catch(function (error) {
                    console.log(error);
                });
        })
    }
}