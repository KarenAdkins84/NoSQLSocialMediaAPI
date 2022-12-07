const router = require('express').Router();
const {
    getUsers,
    getSingleUser,
    addUser,
    updateUser,
    deleteUser,
    addFriend,
    deleteFriend
} = require('../../controllers/user-controller.js');

router.route('/')// /api/users
.get(getUsers)
.post(addUser);

router.route('/:id')// /api/users/:id
.get(getSingleUser)
.put(updateUser)
.delete(deleteUser);

router.route('/:id/friends/:friendId')
// /api/users/:userId/friends/:friendId
.post(addFriend)
.delete(deleteFriend)

module.exports = router;