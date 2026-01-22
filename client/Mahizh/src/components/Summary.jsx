import { useEffect, useState } from "react";
import axios from "axios";

function Summary() {
  const [collections, setCollections] = useState([]);
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/collections")
      .then(res => setCollections(res.data));

    axios.get("http://localhost:5000/api/expenses")
      .then(res => setExpenses(res.data));
  }, []);

  const totalCollected = collections.reduce((sum, c) => sum + c.amount, 0);
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div>
      <h2>Summary</h2>
      <p>Total Collected: ₹{totalCollected}</p>
      <p>Total Spent: ₹{totalSpent}</p>
      <p>Balance: ₹{totalCollected - totalSpent}</p>
    </div>
  );
}

export default Summary;
