const { Schema, model } = require('mongoose');

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
        thoughts: [{
            type: Schema.Types.ObjectId,
            ref: 'Thought'
        }],
        friends: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
    },
    {
        toJSON: {
            virtuals: true,//include virtuals
            getters: true,
        },
        id: false,
    }
);
//create a virtual property 'friendCount' that gets the number of friends per user
userSchema.virtual('friendCount')
//getter
.get(function () {
    return this.friends.length;
})
const User = model('user', userSchema);

module.exports = User;