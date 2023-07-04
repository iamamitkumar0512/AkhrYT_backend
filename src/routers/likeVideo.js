const express = require("express");
const LikeVideoModel = require("../models/LikeVideo");
const { authToken } = require("../middleware/auth");
const router = new express.Router();

router.post("/likeVideo", authToken, async (req, res) => {
  const likedVideo = new LikeVideoModel({
    ...req.body,
    owner: req.user._id,
  });
  try {
    await likedVideo.save();
    res.status(200).send(likedVideo);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/likeVideo", authToken, async (req, res) => {
  try {
    await req.user.populate("likeVideos");
    const returnArr = [];
    req.user.likeVideos.forEach((likeVideo) =>
      returnArr.unshift(likeVideo.likeVideo)
    );
    res.send(returnArr);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.delete("/likeVideo", authToken, async (req, res) => {
  await LikeVideoModel.findOneAndDelete({
    videoId: req.body.videoId,
  });
});

module.exports = router;
