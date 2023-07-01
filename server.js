require("dotenv").config();

const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const methodOverride = require("method-override");
const indexRouter = require("./routes/index");
const authorRouter = require("./routes/authors");
const bookRouter = require("./routes/books");
const bodyParser = require("body-parser");

app.set("views", __dirname + "/views");

// Set Templating Engine
app.use(expressLayouts);
app.set("layout", "./layouts/layout");
app.set("view engine", "ejs");

app.use(methodOverride("_method"));
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: false }));
const mongoose = require("mongoose");

// main().catch((err) => console.log(err));
// async function main() {
//   await mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
//   console.log("connected to the database");
//   // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
// }

try {
  mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
  console.log("connected to the database");
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
} catch {
  console.log("error connecting to the dadabse");
}

app.use("/", indexRouter);
app.use("/authors", authorRouter);
app.use("/books", bookRouter);

app.listen(process.env.PORT || "3000");
