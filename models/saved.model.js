const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const savedSchema = new Schema(
  {
    videoId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "videos",
    },
    username: {
      type: String,
      required: "true",
    },
  },
  { timestamps: true }
);

const Saved = mongoose.model("savedvideo", savedSchema);
module.exports = Saved;
