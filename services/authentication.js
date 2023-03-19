const User = require('../models/user');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require('dotenv/config')

module.exports = {
    async register (req, res) {

        const duplicate = await User.findOne({
            $or: [
                {email: req.body.email},
                {username: req.body.username}
            ]
        })
        if(duplicate) {
            res.status(403).send({
                message: 'User already exists'
            })
        } else {
            const salt = await bcrypt.genSalt(10)
            const hashedPW = await bcrypt.hash(req.body.password, salt)

            const user = new User({
                username: req.body.username,
                email: req.body.email,
                password: hashedPW,
            })
            const result = await user.save()

            const {password, ...data} = await result.toJSON()      //Deconstruct the data to exclude password

            res.send(data)
        }
    },
    async login(req, res) {
        const user = await User.findOne({email: req.body.email})

        if(!user) {
            return res.status(404).send({
                message: 'user not found'
            })
        }


        if (!await bcrypt.compare(req.body.password, user.password)){
            return res.status(400).send({
                message: 'invalid credentials'
            })
        }

        req.session.userId = user._id.toString()

        req.session.save()

        res.status(200).send(user)
    },
    async user (req, res) {
        try {
            //const cookie = req.cookies['jwt']

            console.log(cookie)

            const claims = jwt.verify(cookie, process.env.USER_SECRET_TOKEN)

            if (!claims) {
                return res.status(401).send({
                    message: 'notFound'
                })
            }

            const user = await User.findOne({_id: claims._id})

            const {password, ...data} = await user.toJSON()

            res.send(data)
        } catch(e) {
            return res.status(401).send({
                message: 'error'
            })
        }
    },
    async logout(req, res) {
        //res.cookie('jwt', '', {maxAge: 0})
        res.send({
            message: "Success"
        })
    },

    async upMessage (req, res) {
        console.log("HERE")
        res.status(200).send("Server is UP")
    }
}