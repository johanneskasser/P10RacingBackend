const mongoose = require('mongoose')

const betSchema = new mongoose.Schema({
    placedBy: {
        type: String,
        required: true
    },
    p10: {
        type: String,
        required: true
    },
    firstDNF: {
        type: String,
        required: true
    },
    roundNr: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Bet', betSchema)