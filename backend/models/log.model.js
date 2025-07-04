const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  action: String,           
  transactionId: String,    
  data: Object,             
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Log", logSchema);
