const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Video = new Schema(
  {
    // 3 categories - highlights, tutorial, performances
    category: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    channel: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
