import { Card, CardContent, CardHeader } from "@/components/ui/card";
import TransactionForm from '@/components/TransactionForm';
import TransactionsList from '@/components/TransactionsList';
function Transactions({
  transactions,
  addTransaction,
  deleteTransaction,
  editTransaction,
}) {
  const balance = transactions.reduce((acc, item) => {
    return item.type === "expense"
      ? acc - Number(item.amount)
      : acc + Number(item.amount);
  }, 0);

  const balanceIsPositive = balance >= 0;

  return (
  <div className="main-container">
    <Card className="card">
      <CardHeader>
        <h2 className="sub-heading-medium">Current Balance</h2>
      </CardHeader>
      <CardContent>
        <span
          className={`sub-heading-large ${
            balanceIsPositive ? "amount-income" : "amount-expense"
          }`}
        >
          ₹{balance.toLocaleString()}
        </span>
      </CardContent>
    </Card>
    <TransactionForm addTransaction={addTransaction} />
    <TransactionsList transactions={transactions}  
    deleteTransaction={deleteTransaction}
      editTransaction={editTransaction} /> 
  </div>
  );
}

export default Transactions;