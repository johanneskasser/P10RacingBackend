const User = require('../models/user');

module.exports = {
    async addFriend(req, res) {
        const requestingFriend = req.body.requestingFriend;
        const requestedFriend = req.body.requestedFriend;

        //console.log(requestingFriend, requestedFriend)

        if(!requestingFriend || !requestedFriend) {
            res.status(403).send({
                message: "Please Provide a valid Request!"
            })
        } else {
            let friendToAdd = null
            let reqFriend = null
            try {
                friendToAdd = await User.findOne({username: requestedFriend})
                reqFriend = await User.findOne({_id: requestingFriend})
            } catch (e) {
                res.status(404).send({
                    message: "Users were not Found!",
                })
                return
            }

            if(friendToAdd && reqFriend) {
                if(friendToAdd.friends.includes(requestingFriend)) {
                    res.status(403).send({
                        message: "Already Friends!"
                    })
                } else {
                    try {
                        await User.updateOne(
                            {_id: requestingFriend},
                            {$push: { friends: friendToAdd._id}}
                        )
                        await User.updateOne(
                            {_id: friendToAdd._id},
                            {$push: {friends: requestingFriend}}
                        )

                        res.status(200).send({
                            message: 'Friends added.'
                        })
                    } catch (e) {
                        res.status(500).send({
                            message: "Failed to add friends!"
                        })
                        return
                    }

                }
            } else {
                res.status(404).send({
                    message: "User was not found!"
                })
            }

        }
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
    },
    async getFriends(req,res) {
        let friends = []
        if(req.query._id) {
            let reqUser = null
            try {
                reqUser = await User.findOne({_id: req.query._id})
            } catch (e) {
                res.status(404).send({
                    message: "User was not found"
                })
                return
            }
            if(reqUser) {
                if(reqUser.friends.length !== 0) {
                    for (let i = 0; i < reqUser.friends.length; i++) {
                        try {
                            const user = await User.findOne({_id: reqUser.friends[i]})
                            friends.push({username: user.username, points: user.points})
                        } catch (e) {
                            res.status(500).send({
                                message: "Internal Server Error! Please contact Sysadmin!"
                            })
                            return
                        }
                    }
                    res.status(200).send(friends)
                } else {
                    res.status(404).send({
                        message: "No Friends found!"
                    })
                }
            } else {
                res.status(403).send({
                    message: "User was not found!"
                })
            }


        }
    }
}