const express = require("express");
const router = express.Router();
const Article = require('../models/article.model');

router.get("/", async (req, res, next) => {
    try {
      const articles = await Article.find({}) // find all documents stored in the Article Model
      res.status(200).json(articles)
    } catch (err) {
        next(err)
    }
}); 

module.exports = router;
  