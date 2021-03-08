const express = require("express");
const app = express();
app.use(express.json());

const userRouter = require("./routes/users.routes");
app.use("/users", userRouter);

module.exports = app;
