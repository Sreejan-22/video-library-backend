const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const playlistSchema = new Schema(
  {
    videos: {
      type: [Schema.Types.ObjectId],
      required: true,
      ref: "videos",
    },
    username: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Playlist = mongoose.model("playlist", playlistSchema);
module.exports = Playlist;
