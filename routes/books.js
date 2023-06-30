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
    res.render("books/index", {
      books: books,
      searchOptions: req.query,
    });
  } catch {
    res.redirect("/books/index");
  }
});

// new book
router.get("/new", async (req, res) => {
  res.render("books/new", { book: new Book() });
});

router.post("/", async (req, res) => {
  try {
    // const files = req.files;

    // const coverName = files["cover"][0].filename;
    // const pdfName = files["bookPdf"][0].filename;

    const book = new Book({
      title: req.body.title,
      author: req.body.author,
      description: req.body.description,
      publicationYear: req.body.publicationYear,
    });
    saveCover(book, req.body.cover);
    savePdf(book, req.body.bookPdf);

    const allAuthors = await Author.find({}, "name");
    allAuthors.forEach(async (author) => {
      if (author.name.toUpperCase == req.body.author.toUpperCase) {
      } else {
        const author = new Author({
          name: req.body.author,
        });

        const newAuth = await author.save();
      }
    });

    const newBook = await book.save();
    res.redirect("/books");
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
