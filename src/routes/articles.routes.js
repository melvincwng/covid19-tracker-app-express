const express = require("express");
const router = express.Router();
const Article = require('../models/article.model');
const protectRoute = require('../../middleware/protectRoute');
const multer = require('multer');

//Multer middleware (a node.js middleware fn to handle file uploads)
const storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, "../../images");
    },
    filename: function(req, file, callback) {   
        callback(null, file.originalname);
    }
});

const fileFilter = (req, file, callback) => {
    const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if(allowedFileTypes.includes(file.mimetype)) {
        callback(null, true);
    } else {
        callback(null, false);
    }
}

let upload = multer({ storage, fileFilter }); //storing all the storage fn and fileFilter fn in a variable called 'upload'

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

router.post("/", upload.single('articleImage'), protectRoute, async (req, res, next) => {
    try {
        const article = new Article({
            title: req.body.title,
            body: req.body.body,
            authorName: req.body.authorName,
            articleImage: req.file.articleImage
        });
        console.log(req.file)
        await Article.init(); // make sure indexes are done building
        const newArticle = await article.save(); 
        res.status(201).send("New article posted!");
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

router.delete("/:id", protectRoute, async (req, res, next) => {
    try {
      await Article.findByIdAndDelete(req.article._id)
      res.status(200).json(req.article);
    } catch (err) {
        next(err)
    }
    
});

module.exports = router;
  