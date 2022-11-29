const router = require('express').Router();

const {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    addToFriendList,
    removeFromFriendList
  } = require('../../controllers/user-controller');
// Sets up POST/GET all users
router
  .route('/')
  .get(getAllUsers)
  .post(createUser);
//Sets PUT/DELETE/GET for one specific user
router
  .route('/:id')
  .get(getUserById)
  .put(updateUser)
  .delete(deleteUser);
//Sets up POST for adding a friend to a User
router
  .route('/:userId/friends/:friendId')
  .post(addToFriendList);
//Sets up DELETE for deleting a friend of a User
router
  .route('/:userId/friends/:friendId')
  .delete(removeFromFriendList);

module.exports = router;