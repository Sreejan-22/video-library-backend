const Saved = require("../models/saved.model");
const Video = require("../models/video.model");

const getSavedVideos = async (req, res) => {
  try {
    const { username } = req.params;
    const videos = await Saved.find({ username })
      .sort({ createdAt: -1 })
      .populate({ path: "videoId", model: Video });
    res.status(200).json({ success: true, videos });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Failed to fetch saved videos",
      error: err,
    });
  }
};

const saveVideo = async (req, res) => {
  try {
    const savedVideo = await Video.create(req.body);
    res.status(201).json({ success: true, message: "Added to saved videos" });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Failed to save video",
      error: err,
    });
  }
};

const removeSavedVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const removedVideo = await Saved.findByIdAndDelete(id);
    res
      .status(200)
      .json({ success: true, message: "Video removed from saved playlist" });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Something went wrong!",
      error: err,
    });
  }
};

module.exports = {
  getSavedVideos,
  saveVideo,
  removeSavedVideo,
};
