const UserProfile = require("../models/userprofile.model");
const Video = require("../models/video.model");
const Playlist = require("../models/playlist.model");

const getFullProfile = async (req, res) => {
  try {
    const { username } = req.params;
    const userProfile = await UserProfile.findOne({ username }).populate({
      path: "allVideos.videoId",
    });
    res.status(200).json({ success: true, userProfile });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Failed to fetch user profile details",
      error: err,
    });
  }
};

const getVideosForSingleVideoPage = async (req, res) => {
  try {
    const { username } = req.params;
    const { category, currVideoId } = req.query;
    const userProfile = await UserProfile.findOne({ username }).populate({
      path: "allVideos.videoId",
    });

    const videos = userProfile.allVideos.filter(
      (item) =>
        item.videoId.category === category &&
        String(item.videoId._id) !== String(currVideoId)
    );

    res.status(200).json({ success: true, userProfile, videos });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Failed to fetch videos",
      error: err,
    });
  }
};

const searchUserVideos = async (req, res) => {
  try {
    const { query } = req.query;
    const resultsByTitle = await UserProfile.find({
      "allVideos.videoId.title": { $regex: query, $options: "i" },
    });
    const resultsByDescription = await UserProfile.find({
      "allVideos.videoId.description": { $regex: query, $options: "i" },
    });

    console.log(resultsByTitle);
    console.log(resultsByDescription);

    // merge 2 arrays and remove any duplicates if any
    // also convert mongodbid to string otherwise comparisons would go wrong
    let results = [...resultsByTitle];
    let ids = resultsByTitle.map((item) =>
      mongoose.Types.ObjectId.toString(item._id)
    );
    resultsByDescription.forEach((item) => {
      const id = mongoose.Types.ObjectId.toString(item._id);
      if (!ids.includes(id)) {
        results.push(item);
      }
    });

    res.status(200).json({ success: true, results });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Failed to fetch search results",
      error: err,
    });
  }
};

const createNewProfile = async (req, res) => {
  try {
    const { username } = req.params;
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
    res.status(201).json({ success: true, newUserProfile });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Failed to create new user profile",
      error: err,
    });
  }
};

const createNewPlaylist = async (req, res) => {
  try {
    const { username } = req.params;
    const { video, name } = req.body;
    const userProfile = await UserProfile.findOne({ username });

    // first update the "playlists" field
    const playlistData = {
      name,
      videos: [video],
      username,
    };
    userProfile.playlists.push(playlistData);
    await userProfile.save();

    // now update the "allVideos" field
    const newPlaylistId =
      userProfile.playlists[userProfile.playlists.length - 1]._id;
    const currVideo = userProfile.allVideos.find(
      (item) => String(item.videoId) === String(video._id)
    );
    currVideo.playlists.push(newPlaylistId);
    await userProfile.save();
    res.status(201).json({ success: true, updatedUserProfile: userProfile });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Failed to create new playlist",
      error: err,
    });
  }
};

const addVideoToPlaylist = async (req, res) => {
  try {
    const { username } = req.params;
    const { video, playlistId } = req.body;
    const userProfile = await UserProfile.findOne({ username });

    // first update the "playlists" field
    const playlist = userProfile.playlists.find(
      (item) => String(item._id) === String(playlistId)
    );
    playlist.videos.push(video);

    // now update the "allVideos" field
    const currVideo = userProfile.allVideos.find(
      (item) => String(item.videoId) === String(video._id)
    );
    currVideo.playlists.push(playlistId);
    await userProfile.save();
    res.status(200).json({
      success: true,
      message: "Video added to playlist",
      updatedUserProfile: userProfile,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Failed to add video to playlist",
      error: err,
    });
  }
};

const removeVideoFromPlaylist = async (req, res) => {
  try {
    const { username } = req.params;
    const { videoId, playlistId } = req.body;
    const userProfile = await UserProfile.findOne({ username });

    // first update the "playlists" field
    const playlist = userProfile.playlists.find(
      (item) => String(item._id) === String(playlistId)
    );

    let index = playlist.videos.findIndex(
      (item) => String(item._id) === videoId
    );
    playlist.videos.splice(index, 1);

    // now update the "allVideos" field
    const currVideo = userProfile.allVideos.find(
      (item) => String(item.videoId) === String(videoId)
    );
    let playlistIndex = currVideo.playlists.findIndex(
      (item) => String(item) === String(playlistId)
    );
    currVideo.playlists.splice(playlistIndex, 1);
    await userProfile.save();

    res.status(200).json({
      success: true,
      message: "Video removed from playlist",
      updatedUserProfile: userProfile,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Failed to remove video from playlist",
      error: err,
    });
  }
};

const deletePlaylist = async (req, res) => {
  try {
    const { username } = req.params;
    const { playlistId } = req.body;

    const userProfile = await UserProfile.findOne({ username });

    // first update the "playlists" field
    const playlistIndex = userProfile.playlists.findIndex(
      (item) => String(item._id) === String(playlistId)
    );

    userProfile.playlists.splice(playlistIndex, 1);

    // now update the "allVideos" field
    userProfile.allVideos.forEach((item) => {
      item.playlists = item.playlists.filter(
        (id) => String(id) !== String(playlistId)
      );
    });
    await userProfile.save();

    res.status(200).json({
      success: true,
      message: "Playlist deleted",
      updatedUserProfile: userProfile,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: "Failed to delete playlist",
      error: err,
    });
  }
};

module.exports = {
  getFullProfile,
  getVideosForSingleVideoPage,
  searchUserVideos,
  createNewProfile,
  createNewPlaylist,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
};
