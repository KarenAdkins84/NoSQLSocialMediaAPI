const { Schema, model } = require('mongoose');

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
        reactions//array of nested documents?like replies
    },
);

const Thought = model('thought', thoughtSchema);

module.exports = Thought;