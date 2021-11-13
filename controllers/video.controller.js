const Video = require("../models/video.model");
const videos = require("../data/videos");

// template to copy
// const getAllVideos = async (req, res) => {
//   try {
//   } catch (err) {}
// }

const getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find();
    res.status(200).json({ success: true, videos });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Failed to fetch videos",
      error: err,
    });
  }
};

const getVideosOfCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const videos = await Video.find({ category });
    res.status(200).json({ success: true, videos });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Failed to fetch videos",
      error: err,
    });
  }
};

const insertData = async (req, res) => {
  try {
    const insertedData = await Video.insertMany(videos);
    res.status(201).json({ success: true, message: "Videos stored in DB" });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: "Failed to store videos",
      error: err,
    });
  }
};

const deleteAll = async (req, res) => {
  try {
    const temp = await Video.deleteMany({});
    res.status(200).json({ success: true, message: "All data deleted" });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: "Failed to delete data",
      error: err,
    });
  }
};

module.exports = {
  getAllVideos,
  getVideosOfCategory,
};
