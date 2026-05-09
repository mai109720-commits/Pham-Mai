require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const jwt = require("jsonwebtoken");

const User = require("./models/user.model");

const adminRoute = require("./routes/admin.route");

const app = express();


app.use(expressLayouts);

app.use(express.static(path.join(__dirname, "public")));

// ================== PARSE ==================

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ================== COOKIE ==================

app.use(cookieParser());

// ================== GLOBAL USER ==================

app.use(async (req, res, next) => {

  res.locals.user = null;

  try {

    const token = req.cookies.token;

    if (token) {

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      const user = await User.findById(decoded.id);

      if (user) {
        res.locals.user = user;
      }

    }

  } catch (error) {
    console.log(error);
  }

  next();

});

// ================== VIEW ENGINE ==================

app.set("view engine", "ejs");

app.set(
  "views",
  path.join(__dirname, "views")
);

app.set("layout", "layout");

// ================== DEFAULT ==================

app.get("/", (req, res) => {
  res.redirect("/auth/login");
});

// ================== ROUTES ==================

const authRoute = require("./routes/auth.route");
const homeRoute = require("./routes/home.route");
const borrowRoute = require("./routes/borrow.route");

app.use("/auth", authRoute);

app.use("/home", homeRoute);

app.use("/borrow", borrowRoute);

app.use("/admin", adminRoute);

// ================== MONGODB ==================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = app;