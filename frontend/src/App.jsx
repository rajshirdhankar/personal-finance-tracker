import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";
import Dashboard from "./routes/Dashboard";
import Home from "./routes/Home";
import Transactions from "./routes/Transactions";

function App() {
  const [transactions, setTransactions] = useState(
    JSON.parse(localStorage.getItem("transactions")) || []
  );

  // Using localStorage to persist transactions

  // useEffect(() => {
  // localStorage.setItem("transactions", JSON.stringify(transactions));
  // }, [transactions]);

  // const addTransaction = (transaction) => {
  //   setTransactions([{ ...transaction, id: Date.now() }, ...transactions]);
  // };

  // const deleteTransaction = (id) => {
  //   setTransactions(transactions.filter((t) => t.id !== id));
  // };

  // const editTransaction = (id, updatedTransaction) => {
  //   setTransactions(
  //     transactions.map((t) => (t.id === id ? { ...updatedTransaction, id } : t))
  //   );
  // };\

  // Using fetch to get transactions from the backend

  useEffect(() => {
    fetch("http://localhost:5000/transactions")
      .then((res) => res.json())
      .then((data) => {
        setTransactions(data);
      })
      .catch((err) => {
        console.error("Error fetching transactions:", err);
      });
  }, []);

  const addTransaction = async (tx) => {
    try {
      const res = await fetch("http://localhost:5000/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tx),
      });

      const newTx = await res.json();
      setTransactions((prev) => [newTx, ...prev]);
    } catch (err) {
      console.error("Error adding transaction:", err);
    }
  };

  const deleteTransaction = async (_id) => {
    try {
      await fetch(`http://localhost:5000/transactions/${_id}`, {
        method: "DELETE",
      });

      setTransactions((prev) => prev.filter((t) => t._id !== _id));
    } catch (err) {
      console.error("Error deleting transaction:", err);
    }
  };

  const editTransaction = async (_id, tx) => {
    try {
      await fetch(`http://localhost:5000/transactions/${_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tx),
      });

      setTransactions((prev) =>
        prev.map((t) => (t._id !== _id ? t : { ...t, ...tx }))
      );
    } catch (err) {
      console.error("Error deleting transaction:", err);
    }
  };

  return (
    <div>
      <Navbar />
      <h1 className="main-heading">Personal Finance Tracker</h1>

      <div>
        <Routes>
          <Route path="/" element={<Home transactions={transactions} />} />
          <Route
            path="/transactions"
            element={
              <Transactions
                transactions={transactions}
                addTransaction={addTransaction}
                deleteTransaction={deleteTransaction}
                editTransaction={editTransaction}
              />
            }
          />
          <Route
            path="/dashboard"
            element={<Dashboard transactions={transactions} />}
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
