require("dotenv").config();
const User = require("../models/user.model");
const UserProfile = require("../models/userprofile.model");
const Video = require("../models/video.model");
const bcrypt = require("bcrypt");
const { createToken } = require("../utils/createToken");
const { handleSignupError } = require("../utils/handleSignupErrors");

const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.create({ username, email, password });

    const saltRounds = 10;
    // auto generate a salt and hash
    user.password = await bcrypt.hash(user.password, saltRounds);
    const newUser = await user.save();

    // after a new account is created, the user is logged into the website
    // so a token, to be sent to the frontend, has to be generated
    const token = createToken(newUser._id);

    // create new user profile
    const videos = await Video.find();
    const playlists = []; // new profile so no playlist created yet
    const allVideos = videos.map((item) => {
      return {
        videoId: item._id,
        playlists: [], // no video is part of any playlist yet
      };
    });
    const newUserProfile = await UserProfile.create({
      username,
      allVideos,
      playlists,
    });

    res
      .status(201)
      .json({ success: true, user: newUser, token, newUserProfile });
  } catch (err) {
    const errors = handleSignupError(err);

    if (
      errors.email === "" &&
      errors.username === "" &&
      errors.password === ""
    ) {
      res.status(500).json({
        success: false,
        serverError: true,
        message: "Oops!! Something went wrong!",
        error: err,
      });
    } else {
      res.status(400).json({ success: false, errors });
    }
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      const auth = await bcrypt.compare(password, user.password);
      if (auth) {
        const token = createToken(user._id);
        res.status(200).json({ success: true, user, token });
      } else {
        res.status(401).json({ success: false, message: "Incorrect Password" });
      }
    } else {
      res
        .status(401)
        .json({ success: false, message: "This email is not registered" });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      serverError: true,
      message: "Oops!! Something went wrong!",
      error: err,
    });
  }
};

module.exports = {
  signup,
  login,
};
