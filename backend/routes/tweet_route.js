const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const protectedRoute = require("../middleware/protectedResource");
const UserModel = mongoose.model("UserModel");
const TweetModel = mongoose.model("TweetModel");

// Set up the storage destination and filename for uploaded images
const storage = multer.diskStorage({
  destination: './images',
  filename: (req, file, callback) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    const fileName = `tweet-${uniqueSuffix}${fileExtension}`;
    callback(null, fileName);
  }
});

// Create a multer upload middleware to handle the image uploads
const upload = multer({ storage });

// 1. Create a tweet
router.post("/api/tweet", protectedRoute, upload.single("image"), async (req, res) => {
  try {
    const { content } = req.body;
    const loggedInUserId = req.user._id;

    if (!content) {
      return res.status(400).json({ message: "Tweet content is required" });
    }

    // Create a new tweet instance with content and tweetedBy (user ID)
    const newTweet = new TweetModel({
      content,
      tweetedBy: loggedInUserId,
      image: req.file?.path, // Save image location if uploaded
    });

    // Save the tweet into the DB
    await newTweet.save();

    res.status(201).json({ message: "Tweet created successfully", tweet: newTweet });
  } catch (error) {
    res.status(500).json({ message: "Error creating tweet", error: error.message });
  }
});

//  2 . Like a tweet - Endpoint - POST /api/tweet/:id/like
router.post("/api/tweet/:id/like", protectedRoute, async (req, res) => {
  try {
    const tweetId = req.params.id;
    const loggedInUserId = req.user._id;

    // check whether tweet exists or not

    const tweet = await TweetModel.findById(tweetId);

    if (!tweet) {
      return res.status(404).json({ message: "Tweet not found" });
    }


    // check if tweet is already liked by user

    if (tweet.likes.includes(loggedInUserId)) {
      return res.status(400).json({ message: "you have already liked this tweet" });
    }

    // add the user's id to the likes array of the tweet

    tweet.likes.push(loggedInUserId);

    // save the updated tweet to the db
    await tweet.save();

    res.json({ message: "tweet liked successfully" })

  } catch (error) {
    res.status(500).json({ message: "Error liking tweet", error: error.message });


  }
});

// 3.  Dislike a tweet - Endpoint - POST /api/tweet/:id/dislike
router.post("/api/tweet/:id/dislike", protectedRoute, async (req, res) => {
  try {
    const tweetId = req.params.id;
    const loggedInUserId = req.user._id;

    // Check if the tweet exists
    const tweet = await TweetModel.findById(tweetId);
    if (!tweet) {
      return res.status(404).json({ message: "Tweet not found" });
    }

    // Check if the user has liked the tweet
    if (!tweet.likes.includes(loggedInUserId)) {
      return res.status(400).json({ message: "You can only dislike a tweet you have liked" });
    }

    // Remove the user's ID from the likes array of the tweet
    tweet.likes = tweet.likes.filter((userId) => !userId.equals(loggedInUserId));

    // Save the updated tweet to the DB
    await tweet.save();

    res.json({ message: "Tweet disliked successfully" });
    console.log( "Tweet disliked successfully")
  } catch (error) {
    res.status(500).json({ message: "Error disliking tweet", error: error.message });
  }
});

// 4. reply on a tweet  Endpoint - POST /api/tweet/:id/reply
router.post("/api/tweet/:id/reply", protectedRoute, async (req, res) => {
  try {
   
    const tweetId = req.params.id;
    const loggedInUserId = req.user._id;
    const commentContent = req.body.reply;    

    // check if the tweet exists
    const parentTweet = await TweetModel.findById(tweetId);
    if (!parentTweet) {
      return res.status(404).json({ message: "Parent tweet not found" });
    }

    // create a new tweet for the reply

    const newReplyTweet = new TweetModel({
      content: commentContent,
      tweetedBy: loggedInUserId,
    });

    // save the new reply tweet to the db
    const savedReplyTweet = await newReplyTweet.save();

    // add the new reply tweet's ID to the parent tweet's replies array

    parentTweet.replies.push(savedReplyTweet._id);

    // save the updated parent tweet to the db
    await parentTweet.save();

    res.json({ message: "Reply posted successfully", replyTweet: savedReplyTweet });


  } catch (error) {
    res.status(500).json({ message: "Error posting reply", error: error.message });

  }
});

// 5. Get a single tweet detail (GET /api/user/:id):
router.get('/api/tweet/:id', async (req, res) => {
  try {
    const tweetId = req.params.id;
    // Find the tweet by its ID and populate the fields with refs
    const tweet = await TweetModel.findById(tweetId)
      .populate("tweetedBy", "-password") // Populate the 'tweetedBy' field, excluding the 'password'
      .populate("likes", "-password") // Populate the 'likes' field, excluding the 'password'
      .populate("retweetBy", "-password") // Populate the 'retweetBy' field, excluding the 'password'
      .populate({
        path: "replies",
        populate: {
          path: "tweetedBy",
          select: "-password", // Populate the 'replies' field, excluding the 'password' of users who replied
        },
      });


    if (!tweet) {
      return res.status(404).json({ message: 'Tweet not found' });
    }

    res.json(tweet);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user details', error: error.message });
  }
});

// 6. Get all tweet details
router.get("/api/tweet", async (req, res) => {
  try {
    // Find all tweets and populate the fields with refs
    const tweets = await TweetModel.find()
      .populate("tweetedBy", "-password") // Populate the 'tweetedBy' field, excluding the 'password'
      .populate("likes", "-password") // Populate the 'likes' field, excluding the 'password'
      .populate("retweetBy", "-password") // Populate the 'retweetBy' field, excluding the 'password'
      .populate({
        path: "replies",
        populate: {
          path: "tweetedBy",
          select: "-password", // Populate the 'replies' field, excluding the 'password' of users who replied
        },
      })
      .sort({ createdAt: -1 }); // Sort the tweets in descending order by 'createdAt' field

    res.status(200).json({tweets:tweets});
  } catch (error) {
    res.status(500).json({ message: "Error retrieving tweets", error: error.message });
  }
});

// 7. Delete a tweet
router.delete('/api/tweet/:id', protectedRoute, async (req, res) => {
  try {
    const tweetId = req.params.id;
    const loggedInUserId = req.user._id;

    const tweet = await TweetModel.findById(tweetId);
    if (!tweet) {
      return res.status(404).json({ message: 'Tweet not found' });
    }

    // Check if the logged-in user is the one who created the tweet
    if (tweet.tweetedBy.toString() !== loggedInUserId.toString()) {
      return res.status(403).json({ message: 'You are not authorized to delete this tweet' });
    }

    // Perform the delete operation
    await TweetModel.findByIdAndDelete(tweetId);

    res.json({ message: 'Tweet deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting tweet', error: error.message });
  }
});

// 8. RETWEET Endpoint - POST /api/tweet/:id/retweet
router.post('/api/tweet/:id/retweet', protectedRoute, async (req, res) => {
  try {
    const tweetId = req.params.id;
    const loggedInUserId = req.user._id;

    const tweet = await TweetModel.findById(tweetId);
    if (!tweet) {
      return res.status(404).json({ message: 'Tweet not found' });
    }

    // Check if the user has already retweeted the tweet
    if (tweet.retweetBy.includes(loggedInUserId)) {
      return res.status(400).json({ message: 'You have already retweeted this tweet' });
    }

    // Add the user's ID to the retweetBy array
    tweet.retweetBy.push(loggedInUserId);

    // Save the updated tweet in the database
    await tweet.save();

    res.json({ message: 'Tweet retweeted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error retweeting tweet', error: error.message });
  }
});




module.exports = router;
