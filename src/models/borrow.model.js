const mongoose = require("mongoose");

const borrowSchema = new mongoose.Schema({
  person: String,

  amount: Number,

  type: String,

  status: {
    type: String,
    default: "pending",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Borrow", borrowSchema);