const Playlist = require("../models/playlist.model");
const Video = require("../models/video.model");

const getPlaylists = async (req, res) => {
  try {
    const { username } = req.params;
    const playlists = await Playlist.find({ username }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, playlists });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Failed to fetch playlists",
      error: err,
    });
  }
};

// create a playlist with 1 video
const createPlaylist = async (req, res) => {
  try {
    const playlist = new Playlist(req.body);
    await playlist.save();

    res
      .status(200)
      .json({ success: true, message: "Playlist created", playlist });
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({
        success: false,
        message: "A playlist with this name already exists",
        error: err,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Failed to create playlist",
        error: err,
      });
    }
  }
};

const addToPlaylist = async (req, res) => {
  try {
    const { id } = req.params;
    const { video } = req.body;

    const playlist = await Playlist.findById(id);
    const temp = [...playlist.videos];

    if (temp.includes(video._id)) {
      res.status(400).json({
        success: false,
        message: "Video already exists in playlist",
        error: err,
      });
      return;
    }

    temp.push(video);
    playlist.videos = temp;
    await playlist.save();
    res.status(200).json({
      success: true,
      message: "Video added to playlist",
      updatedPlaylist: playlist,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: "Failed to add video to playlist",
      error: err,
    });
  }
};

const removeFromPlaylist = async (req, res) => {
  try {
    const { id } = req.params;
    const { index } = req.body;
    const playlist = await Playlist.findById(id);
    const temp = [...playlist.videos];
    temp.splice(index, 1);
    playlist.videos = temp;
    await playlist.save();
    res.status(200).json({
      success: true,
      message: "Video removed from playlist",
      updatedPlaylist: playlist,
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
    const { id } = req.params;
    const deletedPlaylist = await Playlist.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Playlist deleted" });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Failed to delete playlist",
      error: err,
    });
  }
};

module.exports = {
  getPlaylists,
  createPlaylist,
  addToPlaylist,
  removeFromPlaylist,
  deletePlaylist,
};
