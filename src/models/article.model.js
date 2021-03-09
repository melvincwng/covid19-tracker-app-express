//article.model.js
const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 1,
  },
  body: {
    type: String,
    required: true,
    minlength: 1,
  },
});

const Article = mongoose.model("Article", articleSchema);

module.exports = Article;
