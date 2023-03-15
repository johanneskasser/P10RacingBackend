const jwt = require("jsonwebtoken");
const User = require("../models/user");
module.exports = {
    async protectedRoute(req, res, next) {
        try {
            const userId = req.session.userId;

            //console.log(req.session)

            if (!userId) {
                return res.status(403).send({
                    message: 'Not Authorized!'
                });
            }

            const user = await User.findOne({_id: userId});

            if (!user) {
                return res.status(403).send({
                    message: 'Not Authorized!'
                });
            }

            return next();
        } catch (e) {
            res.status(500).send({
                message: "Failed to check " + e.message
            });
        }
    }
}