import { useEffect, useState } from "react";
import axios from "axios";

function ExpenseTable() {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/expenses")
      .then((res) => setExpenses(res.data));
  }, []);

  return (
    <div>
      <h2>Expenses</h2>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Title</th>
            <th>Date</th>
            <th>Amount (₹)</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((e) => (
            <tr key={e._id}>
              <td>{e.title}</td>
              <td>{new Date(e.date).toLocaleDateString()}</td>
              <td>{e.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ExpenseTable;
