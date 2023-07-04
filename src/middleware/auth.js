const jwt = require("jsonwebtoken");
const express = require("express");
const UserModel = require("../models/User");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");
const Token = require("../models/Token");

const authUser = async (email, password) => {
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new Error("Email not found");
  }
  const matchpassword = await bcrypt.compare(password, user.password);

  if (!matchpassword) {
    throw new Error("Inncorrect password");
  }

  return user;
};

const getAuthToken = async (user) => {
  const token = jwt.sign({ _id: user._id }, process.env.AUTH_CODE);
  return token;
};

const getResetPasswordOtp = async () => {
  const otp = otpGenerator.generate(4, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
  });
  return otp;
};

const getResetPasswordToken = async (user) => {
  const token = jwt.sign({ _id: user._id }, process.env.OTP_CODE, {
    expiresIn: 3000,
  });
  return token;
};

const authToken = async (req, res, next) => {
  try {
    const token = req.header("authToken");
    // console.log(token);
    const decode = jwt.verify(token, process.env.AUTH_CODE);
    // console.log(decode);
    const user = await UserModel.findOne({ _id: decode._id });

    if (!user) {
      throw new Error("Authentication Failed");
    }
    req.user = user;
    next();
  } catch (e) {
    res.status(401).send({ message: "Authentication Failed." });
  }
};
const authOtpToken = async (req, res, next) => {
  try {
    const otpToken = req.header("otpToken");
    const decode = jwt.verify(otpToken, process.env.OTP_CODE);
    const user = await UserModel.findOne({ _id: decode._id });

    if (!user) {
      throw new Error("Otp token failed please try again.");
    }
    req.user = user;
    next();
  } catch (e) {
    res.status(401).send({ message: "Otp token failed please try again." });
  }
};

const getResetToken = async (user) => {
  const token = jwt.sign({ _id: user._id }, process.env.RESET_CODE, {
    expiresIn: 300,
  });
  return token;
};

const authResetToken = async (req, res, next) => {
  try {
    const resetToken = req.header("resetToken");
    const decode = jwt.verify(resetToken, process.env.RESET_CODE);
    const user = await UserModel.findOne({ _id: decode._id });

    if (!user) {
      throw new Error("Reset token validation failed");
    }
    req.user = user;
    next();
  } catch (e) {
    res.status(401).send({ message: "Otp token failed please try again." });
  }
};

const sendResetEmail = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      service: "gmail",
      port: 587,
      secure: true,
      auth: {
        user: process.env.SEND_WELCOMEEMAIL_USER,
        pass: process.env.SEND_WELCOMEEMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SEND_WELCOMEEMAIL_USER,
      to: email,
      subject: "Reset Password",
      html: `<h1>Reset Password Code</h1><br>This code is valid for 5 Minutes only!<br><h2>Reset code : ${otp}</h2>`,
    });
    return;
  } catch (e) {
    return e.message;
  }
};

const sendWelcomeEmail = async (email, user) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      service: "gmail",
      port: 587,
      secure: false,
      auth: {
        user: process.env.SEND_WELCOMEEMAIL_USER,
        pass: process.env.SEND_WELCOMEEMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SEND_WELCOMEEMAIL_USER,
      to: email,
      subject: "Welcome to AKHR YT",
      html: `
      <h1>Welcome to Our Website</h1>
      <p>Dear ${user.firstName} ${user.lastName}</p>
      <p>
        Thank you for joining AKHR YT! We're excited to have you on board.
      </p>
      <p>
        You now have access to all the features and benefits our website has to
        offer.
      </p>
      <p>
        If you have any questions or suggestion, feel free to submit Feedback form.
      </p>
      <p>Happy exploring!</p>
      <p>
        <a class="button" href="https://master--akhryt.netlify.app/feedback">Feedback</a>
      </p>
    </div>
  
`,
    });
    return;
  } catch (e) {
    return e.message;
  }
};

module.exports = {
  authUser,
  getAuthToken,
  getResetPasswordToken,
  authToken,
  authOtpToken,
  sendResetEmail,
  sendWelcomeEmail,
  authResetToken,
  getResetToken,
  getResetPasswordOtp,
};
