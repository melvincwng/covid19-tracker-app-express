//about.model.js
const mongoose = require("mongoose");

const aboutSchema = new mongoose.Schema({
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
  body2: {
    type: String,
    required: true,
    minlength: 1,
  },
  body3: {
    type: String,
    required: true,
    minlength: 1,
  },
  body4: {
    type: String,
    required: true,
    minlength: 1,
  },
});

const About = mongoose.model("About", aboutSchema);

module.exports = About;
