const { Router } = require("express");
const {
  getPlaylists,
  createPlaylist,
  addToPlaylist,
  removeFromPlaylist,
  deletePlaylist,
} = require("../controllers/playlist.controller");
const { checkAuthentication } = require("../middlewares/auth.middleware");

const router = Router();

router.get("/playlists/:username", checkAuthentication, getPlaylists);
router.post("/playlists", checkAuthentication, createPlaylist);
router.put("/playlists/add/:id", checkAuthentication, addToPlaylist);
router.put("/playlists/remove/:id", checkAuthentication, removeFromPlaylist);
router.delete("/playlists/:id", checkAuthentication, deletePlaylist);

module.exports = router;
