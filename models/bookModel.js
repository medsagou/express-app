const mongoose = require("mongoose");

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
    required: true,
  },
  publicationYear: {
    type: Number,
    required: true,
  },
  coverImage: {
    data: Buffer,
    contentType: String,
  },
  bookPdf: {
    data: Buffer,
    contentType: String,
  },
});
module.exports = mongoose.model("Book", bookSchema);
