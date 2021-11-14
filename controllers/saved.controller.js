const Saved = require("../models/saved.model");

const getSavedVideos = async (req, res) => {
  try {
    const { username } = req.params;
    const videos = await Saved.find({ username });
    res.status(200).json({ success: true, videos });
  } catch (err) {
    res
      .status(400)
      .json({
        success: false,
        message: "Failed to fetch saved videos",
        error: err,
      });
  }
};

module.exports = {
  getSavedVideos,
};
