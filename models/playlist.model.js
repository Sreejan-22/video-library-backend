const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const videoSchema = require("./video.model").schema;

const playlistSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    videos: [videoSchema],
    username: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Playlist = mongoose.model("playlist", playlistSchema);
module.exports = Playlist;
