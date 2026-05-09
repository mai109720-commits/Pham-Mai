const express = require("express");
const router = express.Router();

const Borrow = require("../models/borrow.model");
const User = require("../models/user.model");

// HOME
router.get("/", async (req, res) => {

  let user = null;

  if (req.user?.id) {
    user = await User.findById(req.user.id);
  }

  // lấy danh sách
  const borrows = await Borrow.find();

  const totalBorrow = borrows
    .filter(item => item.type === "borrow")
    .reduce((sum, item) => sum + Number(item.amount), 0);

  // tổng cho vay
  const totalLend = borrows
    .filter(item => item.type === "lend")
    .reduce((sum, item) => sum + Number(item.amount), 0);


  res.render("pages/home", {
    borrows,
    totalBorrow,
    totalLend,
    user
  });

});

router.post("/add", async (req, res) => {

  const { person, amount, type } = req.body;

  await Borrow.create({
    person,
    amount,
    type,
    status: "pending",
  });

  res.redirect("/home");

});

router.get("/history", async (req, res) => {

  const borrows = await Borrow.find();

  res.render("pages/history", {
    borrows,
  });

});

module.exports = router;