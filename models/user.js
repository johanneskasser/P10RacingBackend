const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    friends: [{
        type: String,
        required: false
    }],
    points: {
        type: String,
        default: "0",
        required: false
    }
}, {timestamps: true})

module.exports = mongoose.model('User', userSchema)