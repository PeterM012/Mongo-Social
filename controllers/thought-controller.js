const { Thought, User } = require("../models");

const thoughtController = {
 //Gets all Thoughts
    getAllThoughts(req, res) {
    Thought.find({})
      .then((dbThoughtData) => res.json(dbThoughtData))
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
//Gets all thought by ID
  getThoughtById({ params }, res) {
    Thought.findOne({
      _id: params.id,
    })
      .select("-__v")
      .sort({
        _id: -1,
      })
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          res.status(404).json({
            message: "No thought found.",
          });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },
//Allows to add a Thought
  addThought({ body }, res) {
    Thought.create(body)
      .then((ThoughtData) => {
        return User.findOneAndUpdate(
          {
            _id: body.userId,
          },
          {
            $addToSet: {
              thoughts: ThoughtData._id,
            },
          },
          {
            new: true,
          }
        );
      })
      .then((dbUsersData) => {
        if (!dbUsersData) {
          res.status(404).json({
            message: "No user found.",
          });
          return;
        }
        res.json(dbUsersData);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },
//Allows to update a Specific Thought
  updateThought({ params, body }, res) {
    Thought.findOneAndUpdate(
      {
        _id: params.thoughtId,
      },
      {
        $set: body,
      },
      {
        runValidators: true,
        new: true,
      }
    )
      .then((updateThought) => {
        if (!updateThought) {
          return res.status(404).json({
            message: "No thought found.",
          });
        }
        return res.json({
          message: "Successful",
        });
      })
      .catch((err) => res.json(err));
  },
//Remove a specific thought from a User 
  removeThought({ params }, res) {
    Thought.findOneAndDelete({
      _id: params.thoughtId,
    })
      .then((deletedThought) => {
        if (!deletedThought) {
          return res.status(404).json({
            message: "No thought found",
          });
        }
        return User.findOneAndUpdate(
          {
            thoughts: params.thoughtId,
          },
          {
            $pull: {
              thoughts: params.thoughtId,
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
            message: "No thought found",
          });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => res.json(err));
  },
//Adds a reaction to a specific thought by ID
  addReaction({ params, body }, res) {
    Thought.findOneAndUpdate(
      {
        _id: params.thoughtId,
      },
      {
        $push: {
          reactions: body,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    )
      .then((updatedThought) => {
        if (!updatedThought) {
          res.status(404).json({
            message: "No reactions found",
          });
          return;
        }
        res.json(updatedThought);
      })
      .catch((err) => res.json(err));
  },
//Remove a reaction from a specific Thought by ID
  removeReaction({ params }, res) {
    Thought.findOneAndUpdate(
      {
        _id: params.thoughtId,
      },
      {
        $pull: {
          reactions: {
            reactionId: params.reactionId,
          },
        },
      },
      {
        new: true,
      }
    )
      .then((thought) => {
        if (!thought) {
          res.status(404).json({
            message: "No reactions found",
          });
          return;
        }
        res.json(thought);
      })
      .catch((err) => res.json(err));
  },
};

module.exports = thoughtController;
