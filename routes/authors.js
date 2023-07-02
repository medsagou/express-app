const express = require("express");
const router = express.Router();
const Author = require("../models/authorModel");
const Book = require("../models/bookModel");

router.get("/", async (req, res) => {
  let searchOptions = {};
  if (req.query.name != null && req.query.name !== "") {
    searchOptions.name = new RegExp(req.query.name, "i");
  }
  try {
    const authors = await Author.find(searchOptions);
    res.render("authors/index", {
      authors: authors,
      searchOptions: req.query.name,
    });
  } catch {
    res.redirect("/");
  }
});

router.get("/:id", async (req, res) => {
  const author = await Author.findOne({ _id: req.params.id });
  //   const books = await Book.find({ author: author.name });
  const books = await Book.find({ author: author.id });
  res.render("authors/view", { author: author, books: books });
});

router.get("/:id/edit", async (req, res) => {
  const author = await Author.findById(req.params.id);
  res.render("authors/edit", { author: author });
});

router.put("/:id", async (req, res) => {
  const newAuthorName = req.body.name;
  if (newAuthorName != null && newAuthorName !== "") {
    try {
      const author = await Author.findById(req.params.id);
      author.name = newAuthorName;
      author.save();
    } catch {
      res.render("/authors/" + req.params.id + "/edit", {
        errorMessage: "Error updating Author",
      });
    }
  }
  res.redirect("/authors/" + req.params.id);
});

router.post("/", (req, res) => {
  res.render("authors/edit");
});

router.get("/:id/delete", async (req, res) => {
  const author = await Author.findOne({ _id: req.params.id });
  res.render("partials/deleteConfimation", {
    author: author,
    url: "/authors/" + req.params.id,
  });
});

router.delete("/:id", async (req, res) => {
  let author;
  let books;

  try {
    books = await Book.find({ author: req.params.id });

    books.forEach((book) => {
      book.deleteOne();
    });
    author = await Author.deleteOne({ _id: req.params.id });
    res.redirect("/authors");
  } catch {
    if (author != null) {
      res.redirect("/authors/" + author.id);
    } else {
      res.redirect("/");
    }
  }
});

module.exports = router;
