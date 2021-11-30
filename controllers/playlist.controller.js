const Playlist = require("../models/playlist.model");

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

const getSinglePlaylist = async (req, res) => {
  try {
    const { id } = req.params;
    const playlist = await Playlist.findById(id);
    const playlists = await Playlist.find({ username }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, playlists, currPlaylist: playlist });
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
    const { username } = req.params;
    const { name, video } = req.body;

    const temp = await Playlist.findOne({ name, username });

    if (name === "Saved") {
      res.status(400).json({
        success: false,
        message: "A separate playlist for saved videos already exists",
      });
      return;
    }

    if (temp) {
      res.status(400).json({
        success: false,
        message: "A playlist with this name already exists",
      });
      return;
    }

    let playlist = await Playlist.create({
      name,
      videos: [video],
      username,
    });

    const playlists = await Playlist.find({ username }).sort({ createdAt: -1 });

    res.status(201).json({
      success: true,
      message: "New playlist created",
      playlist,
      playlists,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: "Failed to create playlist",
      error: err,
    });
  }
};

const addToPlaylist = async (req, res) => {
  try {
    const { username } = req.params;
    const { id, video } = req.body;

    const playlist = await Playlist.findById(id);
    const temp = [...playlist.videos];

    const flag = temp.filter((item) => String(item._id) === String(video._id));

    if (flag.length) {
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

    const playlists = await Playlist.find({ username }).sort({ createdAt: -1 });

    res.status(201).json({
      success: true,
      message: "Video added to playlist",
      updatedPlaylist: playlist,
      playlists,
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
    const { username } = req.params;
    const { playlistId, videoId } = req.body;
    const playlist = await Playlist.findById(playlistId);
    const temp = [...playlist.videos];
    const index = temp.findIndex(
      (item) => String(item._id) === String(videoId)
    );
    temp.splice(index, 1);
    playlist.videos = temp;
    await playlist.save();

    const playlists = await Playlist.find({ username }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Video removed from playlist",
      updatedPlaylist: playlist,
      playlists,
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
    const { username, id } = req.params;
    const deletedPlaylist = await Playlist.findByIdAndDelete(id);
    const playlists = await Playlist.find({ username }).sort({ createdAt: -1 });
    res
      .status(200)
      .json({ success: true, message: "Playlist deleted", playlists });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Failed to delete playlist",
      error: err,
    });
  }
};

const saveVideo = async (req, res) => {
  try {
    const { username } = req.params;
    const { video } = req.body;
    let result;
    const saved = await Playlist.findOne({ username, name: "Saved" });

    if (saved) {
      const temp = [...saved.videos];
      temp.push(video);
      saved.videos = temp;
      await saved.save();
      result = saved;
    } else {
      const savedPlaylist = await Playlist.create({
        name: "Saved",
        videos: [video],
        username,
      });
      result = savedPlaylist;
    }

    const playlists = await Playlist.find({ username }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, playlists, savedPlaylist: result });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: "Failed to save video",
      error: err,
    });
  }
};

const unsaveVideo = async (req, res) => {
  try {
    const { username } = req.params;
    const { videoId } = req.body;
    const saved = await Playlist.findOne({ username, name: "Saved" });

    if (saved) {
      const temp = [...saved.videos];
      const index = temp.findIndex(
        (item) => String(item._id) === String(videoId)
      );
      temp.splice(index, 1);
      saved.videos = temp;
      await saved.save();
    } else {
      res.status(400).json({
        success: false,
        message: "This video does is not saved",
        error: err,
      });
    }

    const playlists = await Playlist.find({ username }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, playlists, savedPlaylist: saved });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Failed to unsave video",
      error: err,
    });
  }
};

module.exports = {
  getPlaylists,
  getSinglePlaylist,
  createPlaylist,
  addToPlaylist,
  removeFromPlaylist,
  deletePlaylist,
  saveVideo,
  unsaveVideo,
};
