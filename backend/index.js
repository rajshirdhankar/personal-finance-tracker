const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const app = express();
app.use(cors());
app.use(express.json());

// Supabase client using service role key (server-side only)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Routes
app.get("/", (req, res) => {
  res.send("API is running.");
});

// Get all transactions (sorted by id descending, same behaviour as before)
app.get("/transactions", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .order("id", { ascending: false });

    if (error) throw error;

    // Frontend expects `_id` like a Mongo/Firebase id, here we just mirror `id`
    const transactions = (data || []).map((row) => ({
      _id: row.id,
      ...row,
    }));

    res.json(transactions);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Get a single transaction by id
app.get("/transactions/:id", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("id", req.params.id)
      .maybeSingle();

    if (error) throw error;
    if (!data) return res.status(404).send("Transaction not found");

    res.json({ _id: data.id, ...data });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Create a new transaction
app.post("/transactions", async (req, res) => {
  try {
    const body = req.body;

    // Ensure the `id` column exists; reuse the frontend-generated id
    const row = {
      id: body.id ?? Date.now(),
      amount: body.amount,
      description: body.description,
      type: body.type,
      category: body.category,
    };

    const { data, error } = await supabase
      .from("transactions")
      .insert(row)
      .select("*")
      .single();

    if (error) throw error;

    // Log entry
    await supabase.from("logs").insert({
      action: "ADD",
      transaction_id: row.id,
      data: row,
      timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    });

    const created = { _id: data.id, ...data };
    res.json(created);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Update an existing transaction
app.put("/transactions/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updates = req.body;

    const { data, error } = await supabase
      .from("transactions")
      .update(updates)
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw error;

    const updated = { _id: data.id, ...data };

    await supabase.from("logs").insert({
      action: "EDIT",
      transaction_id: id,
      data: updated,
      timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    });

    res.json(updated);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Delete a transaction
app.delete("/transactions/:id", async (req, res) => {
  try {
    const id = req.params.id;

    // Fetch before delete so we can log it
    const { data: existing, error: fetchError } = await supabase
      .from("transactions")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError) throw fetchError;
    if (!existing) return res.status(404).send("Transaction not found");

    const { error: deleteError } = await supabase
      .from("transactions")
      .delete()
      .eq("id", id);

    if (deleteError) throw deleteError;

    await supabase.from("logs").insert({
      action: "DELETE",
      transaction_id: id,
      data: existing,
      timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    });

    res.json({ _id: existing.id, ...existing });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
