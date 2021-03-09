const express = require("express");
const router = express.Router();
const About = require('../models/about.model');

router.get("/", async (req, res, next) => {
    try {
      const about = await About.find({}) // find all documents stored in the About Model
      res.status(200).json(about)
    } catch (err) {
        next(err)
    }
}); 

module.exports = router;