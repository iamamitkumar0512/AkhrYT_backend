const express = require("express");
const router = new express.Router();
const TokenModel = require("../models/Token");

const UserModel = require("../models/User");
const {
  authUser,
  getAuthToken,
  getResetPasswordToken,
  authToken,
  sendResetEmail,
  authOtpToken,
  sendWelcomeEmail,
  getResetPasswordOtp,
  authResetToken,
  getResetToken,
} = require("../middleware/auth");

router.post("/register", async (req, res) => {
  try {
    const data = await UserModel.findOne({ email: req.body.email });
    if (data?.email) {
      return res.status(400).send({ message: "Email Id already registered!" });
    }

    const user = new UserModel(req.body);
    await user.save();
    const mail = await sendWelcomeEmail(user.email, user);
    if (mail) {
      return res.status(400).send({ message: "Error Occured!" });
    }
    res.send({
      message: "User Registed Successfully. Please check registred email",
    });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

router.post("/login", async (req, res) => {
  if (!req.body?.email || !req.body?.password) {
    return res
      .status(400)
      .send({ message: "Please provide  email and password" });
  }
  try {
    let token;
    const user = await authUser(req.body.email, req.body.password);
    token = await getAuthToken(user);

    res.send({ user, token });
  } catch (err) {
    // console.log(err.message);
    res.status(400).send({ message: err.message });
  }
});

router.post("/resetPassword", async (req, res) => {
  if (!req.body?.email) {
    return res.send({ message: "Please provide email" });
  }
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).send({ message: "Email not found!" });
    }
    const token = await TokenModel.findOne({ userId: user.id });
    if (token) {
      await token.deleteOne();
    }
    const headrerToken = await getResetPasswordToken(user);
    const otp = await getResetPasswordOtp();
    const token_data = await new TokenModel({
      userId: user._id,
      token: otp,
    });
    token_data.save();
    const data = await sendResetEmail(user.email, otp);
    // console.log(data);
    if (data) {
      return res.status(400).send({ message: "Error Occured!" });
    }
    res.send({
      message: "Check Email for Reset Password Otp!",
      token: headrerToken,
    });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

router.post("/verifyOtp", authOtpToken, async (req, res) => {
  try {
    const otp_send = await TokenModel.findOne({ userId: req.user._id });
    const otp_recived = req.body.otp;
    // console.log(otp_send);
    if (otp_recived === otp_send.token) {
      const resetToken = await getResetToken(req.user);
      res.send({ message: "Otp verified", resetToken: resetToken });
    } else {
      res.status(403).send({ message: "Otp did not match" });
    }
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

router.post("/resetpasswordset", authResetToken, async (req, res) => {
  try {
    const user = await UserModel.findOne({ _id: req.user._id });
    if (!user) {
      return res.status(404).send({ message: "Invalid user!" });
    }
    user.password = req.body.password;
    await user.save();
    res.send({ message: "Password changed successfully!" });
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
});

router.get("/profile", authToken, async (req, res) => {
  try {
    // console.log(req.user._id);
    let user = await UserModel.findOne({ _id: req.user._id });
    // console.log(user);
    if (!user) {
      return res.status(404).send({ message: "User not found!" });
    }
    res.status(200).send({ user });
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
});

router.put("/update/user", authToken, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["firstName", "lastName", "mobile", "profileImg"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ message: "Invalid updates!" });
  }

  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    res.send({ message: "Profile successfully updated!", user: req.user });
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
});

module.exports = router;
