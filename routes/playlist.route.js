const { Router } = require("express");
const {
  getPlaylists,
  getSinglePlaylist,
  createPlaylist,
  addToPlaylist,
  removeFromPlaylist,
  deletePlaylist,
  saveVideo,
  unsaveVideo,
  getSavedPlaylist,
} = require("../controllers/playlist.controller");
const { checkAuthentication } = require("../middlewares/auth.middleware");

const router = Router();

router.get("/playlists/:username", checkAuthentication, getPlaylists);
router.get(
  "/singleplaylist/:username/:id",
  checkAuthentication,
  getSinglePlaylist
);
router.post("/playlists/:username", checkAuthentication, createPlaylist);
router.put("/playlists/add/:username", checkAuthentication, addToPlaylist);
router.put(
  "/playlists/remove/:username",
  checkAuthentication,
  removeFromPlaylist
);
router.delete("/playlists/:username/:id", checkAuthentication, deletePlaylist);
router.put("/save/:username", checkAuthentication, saveVideo);
router.put("/unsave/:username", checkAuthentication, unsaveVideo);
router.get("/saved/:username", checkAuthentication, getSavedPlaylist);

module.exports = router;
