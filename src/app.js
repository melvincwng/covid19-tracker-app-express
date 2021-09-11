const express = require("express");
const app = express();
app.use(express.json());
const cookieParser = require("cookie-parser");
app.use(cookieParser());
require("dotenv").config();

const cors = require("cors");

var corsOptions = {
  origin: [
    process.env.FRONTEND_ONE_URL,
    process.env.FRONTEND_TWO_URL,
    process.env.FRONTEND_THREE_URL,
    process.env.FRONTEND_FOUR_URL,
    "http://localhost:3000",
    "http://localhost:3000/login",
    "http://localhost:3000/articles",
    "http://localhost:3000/about",
  ],
  credentials: true,
};

app.use(cors(corsOptions));

// 12/09/21: To serve static files like images in the 'images' folder of the express app
// https://expressjs.com/en/starter/static-files.html
// Hence in localhost for instance, the images will be hosted at e.g. localhost:3001/images/test.jpg
app.use("/images", express.static("images"));

const userRouter = require("./routes/users.routes");
const articleRouter = require("./routes/articles.routes");
const aboutRouter = require("./routes/about.routes");

app.use("/users", userRouter);
app.use("/articles", articleRouter);
app.use("/about", aboutRouter);

//Default error handler
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    res.status(err.statusCode).send(err.message);
  });

module.exports = app;
