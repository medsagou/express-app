const express = require("express");
const router = express.Router();
const Book = require("../models/bookModel");

router.get("/", async (req, res) => {
  let books;
  try {
    books = await Book.find({}).limit(3);
  } catch {
    books = [];
  }
  res.render("index.ejs", {
    books: books,
  });
});

module.exports = router;
