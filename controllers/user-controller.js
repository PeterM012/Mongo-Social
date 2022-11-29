const { User } = require("../models");

const userController = {
//Gets all users
    getAllUsers(req, res) {
        User.find({})
            .populate({
                path: 'thoughts',
                select: ('-__v')
            })
            .populate({
                path: 'friends',
                select: ('-__v')
            })
            .select('-__v')
            .sort({
                _id: -1
            })
            .then(dbUserData => res.json(dbUserData))
            .catch(err => {
                console.log(err);
                res.status(500).json(err);
            });
    },
//Gets User by Id
    getUserById({
        params
    }, res) {
        User.findOne({
                _id: params.id
            })
            .populate({
                path: 'thoughts',
                select: '-__v'
            })
            .select('-__v')
            .then(dbUserData => res.json(dbUserData))
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            });
    },
//Creates User
    createUser({
        body
    }, res) {
        User.create(body)
            .then(dbUserData => res.json(dbUserData))
            .catch(err => res.status(400).json(err));
    },
//Updates User
    updateUser({
        params,
        body
    }, res) {
        User.findOneAndUpdate({
                _id: params.id
            }, body, {
                new: true,
                runValidators: true
            })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({
                        message: 'No user found'
                    });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.status(400).json(err));
    },
//Deletes User
    deleteUser({
        params
    }, res) {
        User.findOneAndDelete({
                _id: params.id
            })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({
                        message: 'No user found'
                    });
                    return;
                }
                return dbUserData;
            })
            .then(dbUserData => {
                User.updateMany({
                        _id: {
                            $in: dbUserData.friends
                        }
                    }, {
                        $pull: {
                            friends: params.userId
                        }
                    })
                    .then(() => {
                        Thought.deleteMany({
                                username: dbUserData.username
                            })
                            .then(() => {
                                res.json({
                                    message: 'User deleted successfully'
                                });
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(400).json(err);
                            })
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(400).json(err);
                    })
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            })
    },
//Allows to a Friend to a User
    addToFriendList({
        params
    }, res) {
        User.findOneAndUpdate({
                _id: params.userId
            }, {
                $push: {
                    friends: params.friendId
                }
            }, {
                new: true
            })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({
                        message: 'No user found'
                    });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => {
                console.log(err)
                res.json(err)
            });
    },
//Allows to Delete Friend from User
    removeFromFriendList({
        params
    }, res) {
        User.findOneAndDelete({
                _id: params.thoughtId
            })
            .then(deletedFriend => {
                if (!deletedFriend) {
                    return res.status(404).json({
                        message: 'No friend found'
                    })
                }
                return User.findOneAndUpdate({
                    friends: params.friendId
                }, {
                    $pull: {
                        friends: params.friendId
                    }
                }, {
                    new: true
                });
            })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({
                        message: 'No friend found'
                    })
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.json(err));
    },
};

module.exports = userController;
