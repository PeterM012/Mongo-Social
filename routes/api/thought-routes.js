const router = require('express').Router();

const {
    getAllThoughts,
    getThoughtById,
    addThought,
    updateThought,
    removeThought,
    addReaction,
    removeReaction,
  } = require('../../controllers/thought-controller');
// Sets up POST/GET all thoughts
  router
  .route('/')
  .get(getAllThoughts)
  .post(addThought);
//Sets PUT/DELETE/GET for one thoughts for a user
  router
  .route('/:thoughtId')
  .get(getThoughtById)
  .put(updateThought)
  .delete(removeThought);
//Sets up POST for adding a reaction to a thought for a User
  router
  .route('/:thoughtId/reactions')
  .post(addReaction);
//Sets up DELETE for deleting a reaction to a User's thought
  router
  .route('/:thoughtId/reactions/:reactionId')
  .delete(removeReaction);

  module.exports = router;