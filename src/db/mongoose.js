const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGODB_CONNECT_URL)
  .then(() => console.log("connected"))
  .catch((err) => console.log(err));
