const { Schema, model, Types, default: mongoose } = require('mongoose');
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
                ref: 'User'
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

thoughtSchema.virtual('reactionCount').get(function () {
    return this.reactions.length;
})

const Thought = model('thought', thoughtSchema);
mongoose.model('Thought', thoughtSchema);
module.exports = Thought;