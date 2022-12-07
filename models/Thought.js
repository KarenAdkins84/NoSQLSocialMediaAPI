const { Schema, model } = require('mongoose');
const reactionSchema = require('./Reaction');
//schema to create Thought model
const thoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            min_length: 1,
            max_length: 280,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            //use getter method to format the timestamp on query
        },
        username: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User'//?capital
            },
        ],
        reactions: [reactionSchema],//array of nested documents?like replies
    },
    {
        toJSON: {
            getters: true,
            virtuals: true,
        }
    }
);

thougtSchema.virtual('reactionCount').get(function () {
    return this.reactions.length;
})

const Thought = model('thought', thoughtSchema);

module.exports = Thought;