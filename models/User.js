const { Schema, model } = require('mongoose');
const thoughtSchema = require('./Thought');

//Schema to create User model
const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            max_length: 50,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: true,
            max_length: 50,
        },
        thoughts: [thoughtSchema],
        friends: [friendSchema],//needs to reference?**!!**!!
    },
    {
        toJSON: {
            virtuals: true,//include virtuals
        },
        id: false,
    }
);
//create a virtual property 'friendCount' that gets the number of friends per user
userSchema
.virtual('friendCount')
//getter
.get(function () {
    return `${this.friend.length}`;
})
const User = model('user', userSchema);

module.exports = User;