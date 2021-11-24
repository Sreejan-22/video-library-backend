const { Router } = require("express");
const {
  getFullProfile,
  createNewProfile,
  createNewPlaylist,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
} = require("../controllers/userprofile.controller");
const { checkAuthentication } = require("../middlewares/auth.middleware");

const router = Router();

router.get("/profile/:username", checkAuthentication, getFullProfile);
router.post("/profile/:username", checkAuthentication, createNewProfile);
router.post("/newplaylist/:username", checkAuthentication, createNewPlaylist);
router.put(
  "/userplaylist/add/:username",
  checkAuthentication,
  addVideoToPlaylist
);
router.put(
  "/userplaylist/remove/:username",
  checkAuthentication,
  removeVideoFromPlaylist
);
router.delete("/userplaylist/:username", checkAuthentication, deletePlaylist);

module.exports = router;
