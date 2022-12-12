const { User, Thought } = require('../models');//check crud operations wrap around to update/delete
const { ObjectId } = require('mongoose').Types;
//const mongoose = require('mongoose');

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
    addUser(req, res) {
        User.create(req.body)
        .then(userData => res.json(userData))
        .catch(err => res.status(400).json(err));
    },
    //get one user by Id
    getSingleUser(req, res) {//use mini-project and this format
        User.findOne({ _id: req.params.id })
        // .populate({
        //     path: 'thoughts',
        //     select: ('-__v')
        // })
        // .select('-__v')
        .then(userData => res.json(userData))
        .catch(err => res.status(400).json(err));
    },
    //update user
    updateUser(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.id },
            { $set: req.body },
            { new: true, timestamps: true })
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
        deleteUser(req, res) {
            User.findOneAndDelete(
            { _id: ObjectId(req.params.id) })
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
        addFriend(req, res) {
            User.findOneAndUpdate(
                { _id: ObjectId(req.params.id) },
                { $push: {friends: req.params.friendId } },
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
        deleteFriend(req, res) {
            User.findOneAndDelete( {_id: ObjectId(req.params.friendId)} )
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