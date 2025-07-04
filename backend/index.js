const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());


mongoose
  .connect(process.env.MONGODB_URI, { dbName: "expense-tracker" })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));


const transactionSchema = new mongoose.Schema({
  id: Number,
  amount: Number,
  description: String,
  type: {
    type: String,
    enum: ["income", "expense"],
    default: "expense",
    required: true,
  },
  category: {
    type: String,
    default: "General",
    required: true,
  },
});

const logSchema = new mongoose.Schema({
  action: String,
  transactionId: String,
  data: Object,
  timestamp: String, 
});

const Transaction = mongoose.model("Transaction", transactionSchema);
const Log = mongoose.model("Log", logSchema);

// Routes
app.get("/", (req, res) => {
  res.send("API is running.");
});

app.get("/transactions", async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ id: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get("/transactions/:id", async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    res.json(transaction);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post("/transactions", async (req, res) => {
  try {
    const newTransaction = new Transaction(req.body);
    await newTransaction.save();

    await Log.create({
      action: "ADD",
      transactionId: newTransaction._id.toString(),
      data: newTransaction,
      timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    });

    res.json(newTransaction);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.put("/transactions/:id", async (req, res) => {
  try {
    const updated = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true });

    await Log.create({
      action: "EDIT",
      transactionId: req.params.id,
      data: updated,
      timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    });

    res.json(updated);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.delete("/transactions/:id", async (req, res) => {
  try {
    const deleted = await Transaction.findByIdAndDelete(req.params.id);

    await Log.create({
      action: "DELETE",
      transactionId: req.params.id,
      data: deleted,
      timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    });

    res.json(deleted);
  } catch (err) {
    res.status(500).send(err.message);
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
