const mongoose = require('mongoose');

const tweetSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    tweetedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel',
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'UserModel',
        }
    ],
    retweetBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'UserModel',
        }
    ],
    image: {
        type: String,
    },
    replies: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'TweetModel',
        }
    ],
}, { timestamps: true }); // Adding timestamps to track createdAt and updatedAt

const TweetModel = mongoose.model("TweetModel", tweetSchema);
module.exports = TweetModel;
