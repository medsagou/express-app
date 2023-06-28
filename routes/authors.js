const express = require("express");
const router = express.Router();
const Author = require("../models/authorModel");

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

router.get("/new", (req, res) => {
  res.render("authors/new");
});

router.post("/", (req, res) => {
  res.render("authors/new");
});
router.delete("/delete/:id", (req, res) => {
  console.log("delete author with id ");
});
module.exports = router;
