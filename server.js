require("dotenv").config();

const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");

const indexRouter = require("./routes/index");
app.set("views", __dirname + "/views");

// Set Templating Engine
app.use(expressLayouts);
app.set("layout", "./layouts/layout");
app.set("view engine", "ejs");

app.use(express.static("public"));

const mongoose = require("mongoose");

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
  console.log("connected to the database");
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

app.use("/", indexRouter);
app.listen(process.env.PORT || "3000");
