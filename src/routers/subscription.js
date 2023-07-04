const express = require("express");
const SubscriptionModel = require("../models/Subscription");
const { authToken } = require("../middleware/auth");
const router = new express.Router();

router.post("/subscription", authToken, async (req, res) => {
  const subscription = new SubscriptionModel({
    ...req.body,
    owner: req.user._id,
  });
  try {
    await subscription.save();
    res.status(200).send(history);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/subscription", authToken, async (req, res) => {
  try {
    await req.user.populate("subscribe");
    const returnArr = [];
    req.user.subscribe.forEach((subscribed) =>
      returnArr.push(subscribed.subscribeChannel)
    );
    res.send(returnArr);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.delete("/subscription", authToken, async (req, res) => {
  await SubscriptionModel.findOneAndDelete({
    subscribeChannel: req.body.subscribeChannel,
  });
});

module.exports = router;
