const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const videoSchema = require("../models/video.model").schema;

const playlistSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    videos: [videoSchema],
    username: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const videoForPlaylistSchema = new Schema({
  videoId: {
    type: Schema.Types.ObjectId,
    ref: "video",
  },
  playlists: [Schema.Types.ObjectId], // playlists a particular video is a part of
});

const userprofileSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  allVideos: [videoForPlaylistSchema],
  playlists: [playlistSchema],
});

const UserModel = mongoose.model("userprofile", userprofileSchema);
module.exports = UserModel;
