const mongoose = require("mongoose");
const validator = require("validator");

const feedbackSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid Email");
      }
    },
  },
  feedback: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Feedback", feedbackSchema);
