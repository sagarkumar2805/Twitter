const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const UserModel = mongoose.model("UserModel");
const TweetModel = mongoose.model("TweetModel");
const protectedRoute = require("../middleware/protectedResource");

// Get a single user detail (GET /api/user/:id):
router.get("/api/user/:id", protectedRoute, async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await UserModel.findById(userId);
    user.password = undefined;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching user details", error: error.message });
  }
});

// Follow user (POST /api/user/:id/follow):

router.post("/api/user/:id/follow", protectedRoute, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const userToFollowId = req.params.id;

    if (loggedInUserId.equals(userToFollowId)) {
      return res.status(400).json({ message: "Cannot follow yourself" });
    }

    const loggedInUser = await UserModel.findById(loggedInUserId);
    const userToFollow = await UserModel.findById(userToFollowId);

    if (!loggedInUser || !userToFollow) {
      return res.status(404).json({ message: "User not found" });
    }

    if (loggedInUser.following.includes(userToFollowId)) {
      return res
        .status(400)
        .json({ message: "You are already following this user" });
    }

    loggedInUser.following.push(userToFollowId);
    userToFollow.followers.push(loggedInUserId);

    await loggedInUser.save();
    await userToFollow.save();

    res.json({ message: "You have successfully followed the user" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error following user", error: error.message });
  }
});

// Unfollow user (POST /api/user/:id/unfollow):

router.post("/api/user/:id/unfollow", protectedRoute, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const userToUnfollowId = req.params.id;

    // Check if the user is trying to unfollow himself/herself
    if (loggedInUserId.equals(userToUnfollowId)) {
      return res.status(400).json({ message: "Cannot unfollow yourself" });
    }

    const loggedInUser = await UserModel.findById(loggedInUserId);
    const userToUnfollow = await UserModel.findById(userToUnfollowId);

    // Check if both logged-in user and user to unfollow exist
    if (!loggedInUser || !userToUnfollow) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the logged-in user is already following the user to unfollow
    if (!loggedInUser.following.includes(userToUnfollowId)) {
      return res
        .status(400)
        .json({ message: "You are not following this user" });
    }

    // Remove the userToUnfollowId from the following array of loggedInUser
    loggedInUser.following.pull(userToUnfollowId);

    // Remove the loggedInUserId from the followers array of userToUnfollow
    userToUnfollow.followers.pull(loggedInUserId);

    // Save the changes in the database
    await loggedInUser.save();
    await userToUnfollow.save();

    res.json({
      success: true,
      message: "You have successfully unfollowed the user",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error unfollowing user", error: error.message });
  }
});

//  Edit user details Endpoint PUT /api/user/:id/

router.put("/api/user/:id", protectedRoute, async (req, res) => {
  try {
    const userId = req.params.id;
    const loggedInUserId = req.user._id;
    const { name, dob, location } = req.body;

    // Check if the logged-in user is editing their own profile
    if (!loggedInUserId.equals(userId)) {
      return res
        .status(403)
        .json({ message: "You are not allowed to edit other user's details" });
    }

    // Only allow specific fields (name, dob, location) to be updated
    const updateFields = {};
    if (name) updateFields.name = name;
    if (dob) updateFields.dob = dob;
    if (location) updateFields.location = location;

    // Update and return the edited user (use { new: true } option to return the updated document)
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      updateFields,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating user details", error: error.message });
  }
});

// . Get user tweet Endpoint POST /api/user/:id/tweets

// Get user tweets API
router.get("/api/user/:id/tweets", async (req, res) => {
  try {
    const userId = req.params.id;

    // Check if the user exists
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find all tweets tweeted by the user
    const userTweets = await TweetModel.find({ tweetedBy: userId }).populate(
      "tweetedBy",
      "name userName"
    );

    res.json(userTweets.reverse());
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error getting user tweets", error: error.message });
  }
});

// Configure multer to specify the destination and file name for the uploaded image
const storage = multer.diskStorage({
  destination: "./images",
  filename: (req, file, callback) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname);
    const fileName = `profile-pic-${uniqueSuffix}${fileExtension}`;
    callback(null, fileName);
  },
});

// Define the file filter to accept only .jpg, .jpeg, and .png files
const fileFilter = (req, file, callback) => {
  const allowedExtensions = [".jpg", ".jpeg", ".png"];
  const fileExtension = path.extname(file.originalname).toLowerCase();
  if (allowedExtensions.includes(fileExtension)) {
    callback(null, true);
  } else {
    // Return an error if the file type is not allowed
    callback(
      new Error(
        "Invalid file type. Only .jpg, .jpeg, and .png files are allowed."
      )
    );
  }
};

// Create the multer middleware
const upload = multer({ storage });

// Upload user profile picture API
router.post(
  "/api/user/:id/uploadProfilePic",
  protectedRoute,
  upload.single("profilePic"),
  async (req, res) => {
    try {
      const userId = req.params.id;
      const loggedInUserId = req.user._id;

      // Check if the logged-in user is uploading their own profile picture
      if (!loggedInUserId.equals(userId)) {
        return res
          .status(403)
          .json({
            message:
              "You are not allowed to upload profile picture for other users",
          });
      }

      console.log(req.file.path);
      // Get the file path of the uploaded image
      const profilePicPath = req.file?.path;

      // Update the user's profilePic field with the file path
      const updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        { profilePic: profilePicPath },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(updatedUser);
    } catch (error) {
      // Check for multer error (invalid file type)
      if (
        error instanceof multer.MulterError &&
        error.code === "LIMIT_FILE_TYPES"
      ) {
        return res.status(400).json({ message: error.message });
      }
      res
        .status(500)
        .json({
          message: "Error uploading profile picture",
          error: error.message,
        });
    }
  }
);

module.exports = router;
