const express = require("express");
const router = new express.Router();
const FeedbackModel = require("../models/Feedback");

router.post("/feedback", async (req, res) => {
  if (!req.body?.email || !req.body?.feedback) {
    return res
      .status(400)
      .send({ message: "Please provide  email and feedback" });
  }
  const feedback = new FeedbackModel(req.body);
  try {
    await feedback.save();
    res.status(200).send(feedback);
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
});

module.exports = router;
