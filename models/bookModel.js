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
  },
  publicationYear: {
    type: Number,
    required: true,
    default: new Date().getFullYear(),
  },
  coverImage: {
    type: Buffer,
    required: true,
  },
  bookPdf: {
    type: Buffer,
    contentType: String,
    required: true,
  },
});

bookSchema.virtual("coverImagePath").get(function () {
  if (this.coverImage != null) {
    return `data:image/png;charset=utf-8;base64,${this.coverImage.toString(
      "base64"
    )}`;
  }
});

module.exports = mongoose.model("Book", bookSchema);
