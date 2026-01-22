import { useState } from "react";
import axios from "axios";

function ExpenseForm() {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.post("http://localhost:5000/api/expenses", {
      title,
      amount,
      date
    });

    setTitle("");
    setAmount("");
    setDate("");
    alert("Expense added");
  };

  return (
    <div>
      <h2>Add Expense</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Expense Title" value={title}
          onChange={(e) => setTitle(e.target.value)} />

        <input type="number" placeholder="Amount" value={amount}
          onChange={(e) => setAmount(e.target.value)} />

        <input type="date" value={date}
          onChange={(e) => setDate(e.target.value)} />

        <button type="submit">Add</button>
      </form>
    </div>
  );
}

export default ExpenseForm;
