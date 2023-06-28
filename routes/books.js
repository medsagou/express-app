const express = require("express");
const router = express.Router();
const Book = require("../models/bookModel");
const Author = require("../models/authorModel");

router.get("/", (req, res) => {
  res.render("books/index");
});

// new book
router.get("/new", (req, res) => {
  res.render("books/new", { book: new Book() });
});

router.post("/", async (req, res) => {
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    description: req.body.description,
    publicationYear: req.body.publicationYear,
    converImage: req.body.coverImage,
    bookPdf: req.body.bookPdf,
  });

  const author = new Author({
    name: req.body.author,
  });
  try {
    const newBook = await book.save();
    const newAuth = await author.save();
    res.redirect("/books");
  } catch {
    res.render("/books/new");
  }
});
module.exports = router;
