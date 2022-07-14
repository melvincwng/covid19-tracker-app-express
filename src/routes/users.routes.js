const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const createJWTToken = require("../config/jwt");

// Commented out this route since we no longer allow users to register their own accounts
/* router.post("/", async (req, res, next) => {
    try {
      const user = new User(req.body);
      const newUser= await user.save();
      res.status(201).send(newUser); // default status code is 200, if successful POST request
    } catch (err) {
      next(err);
    }
  }); */

router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const result = await bcrypt.compare(password, user.password);

    if (!result) {
      throw new Error("Login failed, wrong password!");
    }

    /**
     *  The const 'user' is a document retrieved from Mongoose.
     *  Hence we need to convert to a native JS object first, before we sanitize it.
     *  This block removes the retrieved pw & returns only the necessary user information to the client (in the form of a constant called 'userObject')
     */
    const userObject = user.toObject();
    delete userObject.password;

    const token = createJWTToken(user.username);

    const oneDay = 24 * 60 * 60 * 1000;
    const oneWeek = oneDay * 7;
    const expiryDate = new Date(Date.now() + oneWeek);

    res.cookie("token", token, {
      // you are setting the cookie here, and the name of your cookie is `token`
      expires: expiryDate,
      httpOnly: true, // client-side js cannot access cookie info
      secure: true, // use HTTPS
      sameSite: "none", // need to set sameSite attribute to 'none' so that when we make a cross-origin request to the server, it will allow the cookie inside the response object to be sent back
    }); // Visit https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite for more information on sameSite = 'none';

    res.send(["You are now logged in!", userObject]); // can res.send() or res.json() back stuff such as string, object, or array
  } catch (err) {
    if (err.message === "Login failed, wrong password!") {
      err.statusCode = 400;
    }
    next(err);
  }
});

router.post("/logout", (req, res) => {
  // According to Express.js documentations: http://expressjs.com/en/api.html (res.clearCookie() section)
  // As quoted "Web browsers and other compliant clients will only clear the cookie if the given options is identical to those given to res.cookie(), excluding expires and maxAge."
  // hence I need to insert an 'options' object in res.clearCookie() that is identical (excluding expires) to the 'options' object in res.cookie()
  // if not the cookie won't be deleted (that's the bug I experienced!)
  res
    .clearCookie("token", { httpOnly: true, secure: true, sameSite: "none" })
    .send("You are now logged out!");
});

module.exports = router;
