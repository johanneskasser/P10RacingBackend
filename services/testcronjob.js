const cronJobLogic = require('../services/cronJobLogic')

module.exports = {
    async triggerCronJob(req, res) {
        await cronJobLogic.calculatePoints()
        res.status(200).send({
            message: "Schau in die Konsole!"
        })
    }
}