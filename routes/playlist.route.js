const { Router } = require("express");
const {
  getPlaylists,
  createPlaylist,
} = require("../controllers/playlist.controller");

const router = Router();

router.get("/playlists/:username", getPlaylists);
router.post("/playlists", createPlaylist);

module.exports = router;
