const mongoose = require('mongoose')

const F1DriverSchema = new mongoose.Schema({
    permanentNumber: {
        type: String,
        required: true,
        unique: true
    },
    code: {
        type: String,
        required: true,
    },
    GivenName: {
        type: String,
        required: true,
    },
    FamilyName: {
        type: String,
        required: true,
    },
    DateOfBirth: {
        type: String,
        required: true,
    },
    Nationality: {
        type: String,
        required: true,
    }
})

module.exports = mongoose.model('F1Driver', F1DriverSchema)