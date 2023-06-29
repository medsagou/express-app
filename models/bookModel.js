const mongoose = require("mongoose");
const coverImageBasePath = "uploads/bookCovers";
const path = require("path");

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  publicationYear: {
    type: Number,
    required: true,
    default: new Date().getFullYear(),
  },
  coverImageName: {
    type: String,
    required: true,
  },
  bookPdfName: {
    data: Buffer,
    contentType: String,
  },
});

bookSchema.virtual("coverImagePath").get(function () {
  if (this.coverImageName != null) {
    return path.join("/", coverImageBasePath, this.coverImageName);
  }
});

module.exports = mongoose.model("Book", bookSchema);
module.exports.coverImageBasePath = coverImageBasePath;
