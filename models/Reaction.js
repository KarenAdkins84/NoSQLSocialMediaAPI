const { Schema, Types } = require('mongoose');

const reactionSchema = new Schema(
    {
        reactionId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId(),
        },
        reactionBody: {
            type: String,
            required: true,
            min_length: 1,
            max_length: 280
        },
        username: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            },
        ],
        createdAt: {
            type: Date,
            default: Date.now//use getter method to format timestamps on query
        }

        },
        {
            toJSON: {
                getters: true,
                virtuals: true,
            },
            id: false,
            _id: false
        }
);



module.exports = reactionSchema;

