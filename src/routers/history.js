const express = require("express");
const HistoryModel = require("../models/History");
const { authToken } = require("../middleware/auth");
const router = new express.Router();

router.post("/history", authToken, async (req, res) => {
  const history = new HistoryModel({
    ...req.body,
    owner: req.user._id,
  });

  try {
    const checkHistory = await HistoryModel.findOneAndDelete({
      videoId: req.body.videoId,
    });

    await history.save();
    res.status(200).send(history);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/history", authToken, async (req, res) => {
  try {
    await req.user.populate("historys");
    const returnArr = [];
    req.user.historys.forEach((history) =>
      returnArr.unshift(history.historyVideo)
    );
    res.send(returnArr);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.delete("/history", authToken, async (req, res) => {
  await HistoryModel.deleteMany({ owner: req.user._id });
});

module.exports = router;
