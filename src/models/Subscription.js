const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const subscriptionSchema = mongoose.Schema({
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  subscribeChannel: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Subscription", subscriptionSchema);
