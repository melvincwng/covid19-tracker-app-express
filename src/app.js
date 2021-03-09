const express = require("express");
const app = express();
app.use(express.json());
const cookieParser = require("cookie-parser");
app.use(cookieParser());
require("dotenv").config();

const userRouter = require("./routes/users.routes");
app.use("/users", userRouter);


//Default error handler
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    res.status(err.statusCode).send(err.message);
  });
  
module.exports = app;
