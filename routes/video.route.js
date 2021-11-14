const { Router } = require("express");
const {
  getAllVideos,
  getVideosOfCategory,
  insertData,
  deleteAll,
} = require("../controllers/video.controller");

const router = Router();

router.get("/videos", getAllVideos);
router.get("/videos/:category", getVideosOfCategory);
router.post("/videos", insertData);
router.delete("/videos", deleteAll);

module.exports = router;
