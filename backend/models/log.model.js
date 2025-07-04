const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  action: String,           // ADD, EDIT, DELETE
  transactionId: String,    // Related transaction _id
  data: Object,             // The full transaction object
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Log", logSchema);
