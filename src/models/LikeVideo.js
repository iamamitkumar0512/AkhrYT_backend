const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const likeVideoSchema = new mongoose.Schema({
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  likeVideo: {},
  videoId: {
    type: "String",
    required: true,
  },
});

module.exports = mongoose.model("LikeVideo", likeVideoSchema);
