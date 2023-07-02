const express = require("express");
const router = express.Router();
// const multer = require("multer");
const Book = require("../models/bookModel");
const Author = require("../models/authorModel");
const path = require("path");
const { json } = require("body-parser");
// const uploadPath = path.join("public", Book.coverImageBasePath);
// const imageMimeTypes = ["image/jpeg", "image/png", "images/gif"];
// const upload = multer({
//   dest: uploadPath,
//   //   fileFilter: (req, file, callback) => {
//   //     callback(null, imageMimeTypes.includes(file.minetype));
//   //   }
// });
// const cpUpload = upload.fields([
//   { name: "cover", maxCount: 1 },
//   { name: "bookPdf", maxCount: 1 },
// ]);

router.get("/", async (req, res) => {
  let query = Book.find();
  if (req.query.title != null && req.query.title != "") {
    query = query.regex("title", new RegExp(req.query.title, "i"));
  }
  if (req.query.publishedBefore != null && req.query.publishedBefore != "") {
    query = query.lte("publicationYear", req.query.publishedBefore);
  }
  if (req.query.publishedAfter != null && req.query.publishedAfter != "") {
    query = query.gte("publicationYear", req.query.publishedAfter);
  }

  try {
    const books = await query.exec();
    res.render("books", {
      books: books,
      searchOptions: req.query,
    });
  } catch {
    res.redirect("/books");
  }
});

// new book
router.get("/new", async (req, res) => {
  res.render("books/new", { book: new Book() });
});

router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    const author = await Author.findById(book.author);
    res.render("books/view", {
      book: book,
      author: author,
    });
    // console.log(book.author);
  } catch {
    console.log("Error Loading the book");
    res.redirect("/books");
  }
});

router.post("/", async (req, res) => {
  try {
    // const files = req.files;

    // const coverName = files["cover"][0].filename;
    // const pdfName = files["bookPdf"][0].filename;

    const book = new Book({
      title: req.body.title,
      //   author: req.body.author,
      description: req.body.description,
      publicationYear: req.body.publicationYear,
    });
    saveCover(book, req.body.cover);
    savePdf(book, req.body.bookPdf);

    const allAuthors = await Author.find({}, "name");
    let testAuth = true;
    allAuthors.forEach(async (author) => {
      if (author.name.toUpperCase() === req.body.author.toUpperCase()) {
        const authorId = author.id;

        book.author = authorId;
        testAuth = false;
      }
    });
    if (testAuth == true) {
      const author = new Author({
        name: req.body.author,
      });
      const newAuth = await author.save();
      const authorId = newAuth.id;

      book.author = authorId;
    }
    const newBook = await book.save();

    res.redirect("/books/" + book.id);
  } catch (err) {
    console.log(err);
    console.log("There is an error");
    res.redirect("/books/new");
  }
  //   try {
  //     const newBook = await book.save();
  //     res.redirect("/books");
  //   } catch {
  //     res.render("/books/new");
  //   }
});

router.get("/:id/edit", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    const author = await Author.findById(book.author);
    res.render("books/edit", {
      book: book,
      author: author,
    });
  } catch {
    console.log("error here");
  }
});

router.put("/:id", async (req, res) => {
  let book;
  let author;
  try {
    book = await Book.findById(req.params.id);
    author = await Book.findById(book.author);

    book.title = req.body.title;
    book.description = req.body.description;
    book.publicationYear = req.body.publicationYear;
    saveCover(book, req.body.cover);
    const allAuthors = await Author.find({}, "name");
    let testAuth = true;
    allAuthors.forEach(async (author) => {
      if (author.name.toUpperCase() === req.body.author.toUpperCase()) {
        const authorId = author.id;
        book.author = authorId;
        testAuth = false;
      }
    });

    console.log(testAuth);
    if (testAuth == true) {
      const newAuthor = new Author({
        name: req.body.author,
      });
      const newAuth = await newAuthor.save();
      const authorId = newAuth.id;
      book.author = authorId;
    }
    book.save();
    res.redirect("/books/" + book.id);
  } catch (err) {
    res.redirect("/books/" + book.id + "/edit");
  }
});

router.get("/:id/delete", async (req, res) => {
  let book;
  try {
    book = await Book.findById(req.params.id);
    res.render("partials/deleteConfirmationBook", {
      book: book,
    });
  } catch (err) {
    console.log(err);
    if (book != null && book !== "") {
      res.redirect("/books/" + book.id);
    } else {
      res.redirect("/books");
    }
  }
});
router.delete("/:id", async (req, res) => {
  let book;
  try {
    book = await Book.deleteOne({ _id: req.params.id });

    res.redirect("/books");
  } catch {
    if (book != null) {
      res.redirect("/books/" + book.id);
    } else {
      res.redirect("/");
    }
  }
});

router.get("/:id/download", async (req, res) => {
  let book;
  try {
    book = await Book.findById(req.params.id);
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=${book.title}.pdf`,
    });
    res.send(book.bookPdf);
  } catch (err) {
    console.log(err);
    console.log("Eroor Downloading The Book");
  }
});
function saveCover(book, fileEncoded) {
  if (fileEncoded == null) return;
  const cover = JSON.parse(fileEncoded);
  if (cover != null) {
    book.coverImage = new Buffer.from(cover.data, "base64");
  }
}
function savePdf(book, fileEncoded) {
  if (fileEncoded == null) return;
  const cover = JSON.parse(fileEncoded);
  if (cover != null) {
    book.bookPdf = new Buffer.from(cover.data, "base64");
  }
}

module.exports = router;
