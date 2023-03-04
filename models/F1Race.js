const mongoose = require('mongoose')

const f1RaceSchema = new mongoose.Schema({
    roundNr: {
        type: String,
        required: true
    },
    CircuitName: {
        type: String
    },

    Date: {
        type: Date
    },
})

module.exports = mongoose.model('F1Race', f1RaceSchema)