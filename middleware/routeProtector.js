const jwt = require("jsonwebtoken");
const User = require("../models/user");
module.exports = {
    async protectedRoute(req, res, next) {
        try {
            console.log(req.cookies)
            const cookie = req.cookies['jwt']
            console.log(req.cookies)

            if(cookie) {
                const claims = jwt.verify(cookie, process.env.USER_SECRET_TOKEN)

                if (!claims) {
                    return res.status(403).send({
                        message: 'Not Authorized!'
                    })
                }

                const user = await User.findOne({_id: claims._id})

                if(user) {
                    return next()
                } else {
                    return res.status(403).send({
                        message: 'Not Authorized!'
                    })
                }
            } else {
                return res.status(403).send({
                    message: 'Not Authorized!'
                })
            }

        } catch (e) {
            res.status(500).send({
                message: "Failed to check " + e.message
            })
        }
    }
}