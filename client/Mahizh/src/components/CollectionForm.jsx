import { useState } from "react";
import axios from "axios";

function CollectionForm() {
  const [homeNumber, setHomeNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.post("http://localhost:5000/api/collections", {
      homeNumber,
      amount,
      month,
      year
    });

    setHomeNumber("");
    setAmount("");
    setMonth("");
    setYear("");
    alert("Collection added");
  };

  return (
    <div>
      <h2>Add Collection</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Home Number" value={homeNumber}
          onChange={(e) => setHomeNumber(e.target.value)} />

        <input type="number" placeholder="Amount" value={amount}
          onChange={(e) => setAmount(e.target.value)} />
{/*
        <input placeholder="Month" value={month}
          onChange={(e) => setMonth(e.target.value)} /> */}

        <select value={month} onChange={(e) => setMonth(e.target.value)}>
            <option value="">Select Month</option>
            <option value="January">January</option>
            <option value="February">February</option>
            <option value="March">March</option>
            <option value="April">April</option>
            <option value="May">May</option>
            <option value="June">June</option>
            <option value="July">July</option>
            <option value="August">August</option>
            <option value="September">September</option>
            <option value="October">October</option>
            <option value="November">November</option>
            <option value="December">December</option>
        </select>

{/*
        <input type="number" placeholder="Year" value={year}
          onChange={(e) => setYear(e.target.value)} /> */}

          <select value={year} onChange={(e) => setYear(e.target.value)}>
            <option value="">Select Year</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
            <option value="2026">2026</option>
            <option value="2027">2027</option>
        </select>


        <button type="submit">Add</button>
      </form>
    </div>
  );
}

export default CollectionForm;
