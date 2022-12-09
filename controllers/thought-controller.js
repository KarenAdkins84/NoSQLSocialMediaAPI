const { Thought, User } = require('../models');
const { ObjectId } = require('mongoose').Types;

module.exports = {

    getThoughts(req, res) {
        Thought.find({})
            .then(thoughtData => res.json(thoughtData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },
    getSingleThought({ params }, res) {
        Thought.findOne({ _id: params.thoughtId})
        .then(thoughtData => res.json(thoughtData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },
    addThought({ params, body }, res) {
        Thought.create(body)
            .then(({ _id }) => {
                return User.findOneAndUpdate(
                    { _id: params.userId },
                    { $push: { thoughts: _id } },
                    { new: true, timestamps: true }
                );
            })
            .then(thoughtData => {
                if (!thoughtData) {
                    res.status(404).json({ message: 'Incorrect thought data!' });
                    return;
                }
                res.json(thoughtData);
            })
            .catch(err => res.json(err));
    },
    updateThought({ params, body }, res) {
        Thought.findByIdAndUpdate({ _id: params.thoughtId }, body, {runValidators: true, new: true, timestamps: true})
            .then(thoughtData => {
                if(!thoughtData) {
                    res.status(404).json({ message: 'No thought found with that Id!'});
                    return;
                }
                res.json(thoughtData);
            })
            .catch(err => res.json(err));
    },
    deleteThought({ params }, res) {
        Thought.findByIdAndDelete(
            { _id: params.thoughtId }, 
            { runValidators: true, new: true, timestamps: true})
            .then(thoughtData => {
                if(!thoughtData) {
                    res.status(404).json({ message: 'No thought found with that Id!'});
                    return;
                }
                res.json(thoughtData);
            })
            .catch(err => res.json(err));
    },
    addReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $push: {reactions: body} },
            { new: true, runValidators: true, timestamps: true })
            .then(thoughtData => {
            if (!thoughtData) {
                res.status(404).json({ message: 'Incorrect reaction data!' });
                return;
            }
            res.json(thoughtData);
        })
        .catch(err => res.json(err));
    },
    deleteReaction({ params }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: {reactions: {reactionId : params.reactionId}}},
            { new: true, runValidators: true, timestamps:true }
        )
        .then(thoughtData => {
            if (!thoughtData) {
                res.status(404).json({ message: 'Incorrect reaction data!' });
                return;
            }
            res.json(thoughtData);
        })
        .catch(err => res.json(err));
    },

}