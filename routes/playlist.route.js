const { Router } = require("express");
const {
  getPlaylists,
  createPlaylist,
  addToPlaylist,
  removeFromPlaylist,
  deletePlaylist,
} = require("../controllers/playlist.controller");

const router = Router();

router.get("/playlists/:username", getPlaylists);
router.post("/playlists", createPlaylist);
router.put("/playlists/add/:id", addToPlaylist);
router.put("/playlists/remove/:id", removeFromPlaylist);
router.delete("/playlists/:id", deletePlaylist);

module.exports = router;
