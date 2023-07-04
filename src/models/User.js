const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const History = require("./History");
const LikeVideo = require("./LikeVideo");
const Subscription = require("./Subscription");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid Email");
      }
    },
  },
  mobile: {
    type: String,
    required: true,
    length: 10,
  },
  password: {
    type: String,
    required: true,
    minlength: 7,
    validate(value) {
      if (value.toLowerCase().includes("password")) {
        throw new Error("Password can not conatin password");
      }
    },
  },
  profileImg: {
    type: String,
  },
});

userSchema.virtual("historys", {
  ref: "History",
  localField: "_id",
  foreignField: "owner",
});

userSchema.virtual("likeVideos", {
  ref: "LikeVideo",
  localField: "_id",
  foreignField: "owner",
});

userSchema.virtual("subscribe", {
  ref: "Subscription",
  localField: "_id",
  foreignField: "owner",
});

userSchema.methods.toJSON = function () {
  const user = this;
  const dataObject = user.toObject();

  delete dataObject.password;

  return dataObject;
};

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
