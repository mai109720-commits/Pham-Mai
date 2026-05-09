const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

module.exports = async (req, res, next) => {

  try {

    const token = req.cookies.token;

    if (!token) {
      return res.redirect("/auth/login");
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.redirect("/auth/login");
    }

    req.user = user;

    res.locals.user = user;

    next();

  } catch (err) {

    console.log("AUTH ERROR:", err);

    return res.redirect("/auth/login");
  }
};