const { User, Thought } = require('../models');

module.exports = {
    //get all users
    getUsers(req, res) {
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
            .then(userData => res.json(userData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },
    //add new user
    addUser({ body }, res) {
        User.create(body)
        .then(userData => res.json(userData))
        .catch(err => res.status(400).json(err));
    },
    //get one user by Id
    getSingleUser({ params }, res) {
        User.findOne({ _id: ObjectId(params.id) })
        .populate({
            path: 'thoughts',
            select: ('-__v')
        })
        .select('-__v')
        .then(userData => res.json(userData))
        .catch(err => res.status(400).json(err));
    },
    //update user
    updateUser({ params, body }, res) {
        User.findOneAndUpdate({ _id: ObjectId(params.id) }, body, { new: true, runValidators: true, timestamps: true })
            .then(userData => {
                if(!userData) {
                    res.status(404).json({ message: 'No user found with this ID!' });
                    return;
                }

                res.json(userData);
            })
            .catch(err => res.status(400).json(err));
        },
        //delete a user by Id
        deleteUser({ params }, res) {
            User.findOneAndDelete({_id: ObjectId(params.id)})
            .then(userData => {
                if(!userData) {
                    res.status(404).json({ message: 'No user found with this ID!' });
                    return;
                }
    
                res.json(userData);
            })
            .then(userData => {
                User.updateMany({
                    _id: {
                        $in: userData.friends
                    }
                }, {
                    $pull: {
                        friends: params.userId
                    }
                })
                .then(() => {
                    //delete's a user's thoughts associated with the Id
                    Thought.deleteMany({
                        username: userData.username
                    })
                    .then(() => {
                        res.json({
                            message: 'User successfully deleted!'
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
                console.log(err)
                res.status(400).json(err)
            });
        },
        addFriend({ params }, res) {
            User.findOneAndUpdate(
                { _id: ObjectId(params.id) },
                { $push: {friends: params.friendId } },
                { new: true, timestamps: true }
            )
            .then(userData => {
                if(!userData) {
                    res.status(404).json({ message: 'No user found with that Id!'});
                    return;
                }
                res.json(userData);
            })
            .catch(err => {
                console.log(err)
                res.status(400).json(err)
            });
        },
        deleteFriend({ params }, res) {
            User.findOneAndDelete({_id: ObjectId(params.friendId)})
            .then(userData => {
                if(!userData) {
                    res.status(404).json({ message: 'No friend found with this ID!' });
                    return;
                }
    
                res.json(userData);
            })
            .catch(err => res.status(400).json(err));
        }
}