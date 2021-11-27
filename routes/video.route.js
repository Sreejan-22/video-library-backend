const { Router } = require("express");
const {
  getAllVideos,
  getAllVideosOfUser,
  getVideosOfCategory,
  getVideosOfCategoryOfUser,
  search,
  insertData,
  deleteAll,
} = require("../controllers/video.controller");
const { checkAuthentication } = require("../middlewares/auth.middleware");

const router = Router();

router.get("/videos", getAllVideos);
router.get("/alluservideos/:username", checkAuthentication, getAllVideosOfUser);
router.get("/videos/:category", getVideosOfCategory);
router.get(
  "/uservideos/:username",
  checkAuthentication,
  getVideosOfCategoryOfUser
);
router.get("/search", search);
router.post("/videos", insertData);
router.delete("/videos", deleteAll);

module.exports = router;
