const User = require('../models/user');

module.exports = {
    async addFriend(req, res) {
        const requestingFriend = req.body.requestingFriend;
        const requestedFriend = req.body.requestedFriend;

        User.updateOne(
            {_id: requestingFriend},
            {$push: { friends: requestedFriend}}
        )
        User.updateOne(
            {_id: requestedFriend},
            {$push: {friends: requestingFriend}}
        )

        res.status(200).send({
            message: 'Friends added.'
        })
    },
    async findByUserName(req,res) {
        const username = req.query.username;
        const user = await User.findOne({
            username: username
        })
        if(user) {
            const {password, ...data} = await user.toJSON()
            res.status(200).send(data)
        } else {
            res.status(404).send({
                message: "User not Found!"
            })
        }
    }
}