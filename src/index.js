const express = require("express");
const cors = require("cors");
require("./db/mongoose.js");
const userRouter = require("./routers/user");
const historyRouter = require("./routers/history");
const likeVideoRouter = require("./routers/likeVideo");
const subscribeRouter = require("./routers/subscription");
const feedbackRouter = require("./routers/feedback");

const app = express();
app.use(cors());
const port = process.env.PORT || 3050;
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});
app.use(express.json({ limit: "50mb" }));
app.use(userRouter);
app.use(historyRouter);
app.use(likeVideoRouter);
app.use(subscribeRouter);
app.use(feedbackRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
