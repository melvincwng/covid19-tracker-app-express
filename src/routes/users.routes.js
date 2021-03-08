const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");

router.post("/", async (req, res, next) => {
    try {
      const user = new User(req.body);
      const newUser= await user.save();
      res.status(201).send(newUser); // default status code is 200, if successful POST request
    } catch (err) {
      next(err);
    }
  });

router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const result = await bcrypt.compare(password, user.password);

    if (!result) {
      throw new Error("Login failed");
    }

    res.send("You are now logged in!"); 
  } catch (err) {
    if (err.message === "Login failed") {
      err.statusCode = 400;
    }
    next(err);
  }
});

router.post("/logout", (req, res) => {
  res.send("You are now logged out!");
});

module.exports = router;
  