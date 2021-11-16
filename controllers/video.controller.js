const Video = require("../models/video.model");
const highlights = require("../data/highlights");
const tutorials = require("../data/tutorials");
const performances = require("../data/performances");

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

const search = async (req, res) => {
  try {
    const { query } = req.query;
    const resultsByTitle = await Video.find({
      title: { $regex: query, $options: "i" },
    });
    const resultsByDescription = await Video.find({
      description: { $regex: query, $options: "i" },
    });
    // merge 2 arrays and remove any duplicates if any
    let ids = new Set(resultsByTitle.map((item) => item._id));
    let results = [
      ...resultsByTitle,
      ...resultsByDescription.filter((item) => !ids.has(item._id)),
    ];

    res.status(200).json({ success: true, results });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Failed to fetch search results",
      error: err,
    });
  }
};

const insertData = async (req, res) => {
  try {
    const videos = [...highlights, ...performances, ...tutorials];
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
  search,
  insertData,
  deleteAll,
};
