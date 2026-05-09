const express = require("express");

const router = express.Router();

const authMiddleware = require("../helpers/auth.middleware");

const adminMiddleware = require("../helpers/admin.middleware");

router.get(
  "/dashboard",
  authMiddleware,
  adminMiddleware,
  (req, res) => {
    res.render("pages/dashboard");
  }
);
module.exports = router;