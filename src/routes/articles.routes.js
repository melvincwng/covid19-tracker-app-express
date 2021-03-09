const express = require("express");
const router = express.Router();
const Article = require('../models/article.model');
const protectRoute = require('../../middleware/protectRoute');

//Middleware
router.param("id", async (req, res, next, id) => {
    try {
        const selectedArticle = await Article.findById(req.params.id);
        req.article = selectedArticle;
        next();
    } catch (err) {
        next(err);
    }
  })

//Routes
router.get("/", async (req, res, next) => {
    try {
      const articles = await Article.find({}) // find all documents stored in the Article Model
      res.status(200).json(articles)
    } catch (err) {
        next(err)
    }
}); 

router.get("/:id", async (req, res, next) => {
    try {
        res.status(200).json(req.article);
    } catch (err) {
        next(err)
    }
}); 

router.post("/", protectRoute, async (req, res, next) => {
    try {
        const article = new Article(req.body); 
        await Article.init(); // make sure indexes are done building
        const newArticle = await article.save(); 
        res.status(201).json(newArticle);
    } catch (err) {
        next(err)
    }
});

router.put("/:id", protectRoute, async (req, res, next) => {
    try {
        const article = await Article.findByIdAndUpdate(req.article._id, req.body, {new: true, runValidators:true});
        res.status(200).json(article);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
  