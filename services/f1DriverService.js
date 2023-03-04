var axios = require('axios');
const xml2js = require("xml2js");
const f1Driver = require("../models/F1Driver");

module.exports = {
    async getAllDriversForYear(req, res) {
        var config = {
            method: 'get',
            url: 'http://ergast.com/api/f1/2022/drivers',
            headers: { }
        };

        axios(config)
            .then(function (response) {
                const f1DriversXML = response.data;
                //console.log(racesXML)
                const parser = new xml2js.Parser({explicitArray: false})
                parser.parseString(f1DriversXML, async (err, res) => {
                        if (err) {
                            console.log(err)
                            return;
                        }

                        const drivers = res.MRData.DriverTable.Driver;

                        for (let i = 0; i < drivers.length; i++) {
                            await new f1Driver({
                                permanentNumber: drivers[i].PermanentNumber,
                                code: drivers[i].$.code,
                                GivenName: drivers[i].GivenName,
                                FamilyName: drivers[i].FamilyName,
                                DateOfBirth: drivers[i].DateOfBirth,
                                Nationality: drivers[i].Nationality
                            }).save()
                        }
                    }
                )
            })
            .catch(function (error) {
                console.log(error);
            });

    }
}