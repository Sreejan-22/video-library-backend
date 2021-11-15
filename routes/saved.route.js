const { Router } = require("express");
const {
  getSavedVideos,
  saveVideo,
  removeSavedVideo,
} = require("../controllers/saved.controller");

const router = Router();

router.get("/saved/:username", getSavedVideos);
router.post("/saved", saveVideo);
router.delete("/saved/:id", removeSavedVideo);
