const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profilePic: {
        type: String

    },
    location: {
        type: String

    },
    dob: {
        type: Date

    },
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'UserModel',
        }
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'UserModel',
        }
    ],

    
},{timestamps:true});

const UserModel = mongoose.model("UserModel", userSchema);
module.exports = UserModel;