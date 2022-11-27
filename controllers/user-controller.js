const { User } = require("../models");

const userController = {
  getAllUsers(req, res) {
    User.find({})
      .populate({
        path: "thoughts",
        select: "-__v",
      })
      .populate({
        path: "friends",
        select: "-__v",
      })
      .select("-__v")
      .sort({
        _id: -1,
      })
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  getUserById({ params }, res) {
    User.findOne({
      _id: params.id,
    })
      .populate({
        path: "thoughts",
        select: "-__v",
      })
      .select("-__v")
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  createUser({ body }, res) {
    User.create(body)
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => res.status(400).json(err));
  },

  updateUser({ params, body }, res) {
    User.findOneAndUpdate(
      {
        _id: params.id,
      },
      body,
      {
        new: true,
        runValidators: true,
      }
    )
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({
            message: "User not found.",
          });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => res.status(400).json(err));
  },

  deleteUser({ params }, res) {
    User.findOneAndDelete({
      _id: params.id,
    })
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({
            message: "User not found.",
          });
          return;
        }
        return dbUserData;
      })
      .then((dbUserData) => {
        User.updateMany(
          {
            _id: {
              $in: dbUserData.friends,
            },
          },
          {
            $pull: {
              friends: params.userId,
            },
          }
        )
          .then(() => {
            Thought.deleteMany({
              username: dbUserData.username,
            })
              .then(() => {
                res.json({
                  message: "User deleted successfully",
                });
              })
              .catch((err) => {
                console.log(err);
                res.status(400).json(err);
              });
          })
          .catch((err) => {
            console.log(err);
            res.status(400).json(err);
          });
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  addToFriendList({ params }, res) {
    User.findOneAndUpdate(
      {
        _id: params.userId,
      },
      {
        $push: {
          friends: params.friendId,
        },
      },
      {
        new: true,
      }
    )
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({
            message: "User not found.",
          });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => {
        console.log(err);
        res.json(err);
      });
  },

  removeFromFriendList({ params }, res) {
    User.findOneAndDelete({
      _id: params.thoughtId,
    })
      .then((deletedFriend) => {
        if (!deletedFriend) {
          return res.status(404).json({
            message: "Friend not found.",
          });
        }
        return User.findOneAndUpdate(
          {
            friends: params.friendId,
          },
          {
            $pull: {
              friends: params.friendId,
            },
          },
          {
            new: true,
          }
        );
      })
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({
            message: "Friend not found.",
          });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => res.json(err));
  },
};

module.exports = userController;
