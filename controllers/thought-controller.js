const { Thought, User } = require('../models');
const { ObjectId } = require('mongoose').Types;

module.exports = {
//get all thoughts
    getThoughts(req, res) {
        Thought.find()
            .then(thoughtData => res.json(thoughtData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },
    //get a thought
    getSingleThought(req, res) {
        Thought.findOne({ _id: req.params.thoughtId })
            .select('-__v')
            .then((thought) =>
            !thought
                ? res.status(404).json({ message: 'No thought with that ID' })
                : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
        },
    //create thought
    addThought(req, res) {
        Thought.create(req.body)
            .then(({ _id }) => {
                return User.findOneAndUpdate(
                    { _id: req.params.userId },
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
    //update thought
    updateThought(req, res) {
        Thought.findByIdAndUpdate(
            { _id: req.params.thoughtId },
            { $set: req.body },
            { new: true, timestamps: true, runValidators: true })
            .then((thoughtData) => 
                !thoughtData
                    ? res.status(404).json({ message: 'No thought found with that Id!'})
                    : res.json(thoughtData)
            )
            .catch((err) => res.status(500).json(err));
    },
    //delete a thought
    deleteThought(req, res) {
        Thought.findOneAndDelete({ _id: req.params.thoughtId })
            .then((thoughtData) => 
                !thoughtData
                    ? res.status(404).json({ message: 'No thought found with that Id!'})
                    : User.deleteMany({ _id: { $in: thoughtData.users } })
            )
                .then(() => res.json({ message: 'Thought and users deleted!' }))
                .catch((err) => res.status(500).json(err));
    },
    //add reaction to a thought
    addReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: { reactions: req.body } },
            { new: true, timestamps: true, runValidators: true })
            .then((thoughtData) => 
            !thoughtData
                ? res.status(404).json({ message: 'Incorrect reaction data!' })
                : res.json(thoughtData)
            )
            .catch(err => res.json(err));
    },
    //delete a reaction from a thought
    deleteReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: {reactionId : req.params.reactionId } } },
            { new: true, timestamps: true, runValidators: true }
        )
        .then((thoughtData) => 
            !thoughtData
                ? res.status(404).json({ message: 'Incorrect reaction data!' })
                : res.json(thoughtData)
        )
        .catch(err => res.json(err));
    },

};