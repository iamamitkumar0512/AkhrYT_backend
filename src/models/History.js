const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const historySchema = new mongoose.Schema({
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  historyVideo: {},
  videoId: {
    type: "String",
    required: true,
  },
});

const History = mongoose.model("History", historySchema);
module.exports = History;
