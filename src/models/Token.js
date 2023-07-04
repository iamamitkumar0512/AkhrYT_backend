const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tokenSchema = mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  token: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Token", tokenSchema);
