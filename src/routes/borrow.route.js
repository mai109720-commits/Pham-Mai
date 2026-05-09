const express = require("express");
const router = express.Router();

const Borrow = require("../models/borrow.model");

router.post("/create", async (req, res) => {

  await Borrow.create(req.body);

  res.redirect("/home/history");

});
router.get("/toggle/:id", async (req, res) => {

  const item = await Borrow.findById(req.params.id);

  item.status =
    item.status === "pending"
      ? "paid"
      : "pending";

  await item.save();

  res.redirect("/home/history");

});

router.get("/delete/:id", async (req, res) => {

  await Borrow.findByIdAndDelete(req.params.id);

  res.redirect("/home/history");

});

module.exports = router;