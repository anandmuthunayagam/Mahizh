import { useEffect, useState } from "react";
import axios from "axios";

function CollectionTable() {
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/collections")
      .then((res) => setCollections(res.data));
  }, []);

  return (
    <div>
      <h2>Collections</h2>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Home</th>
            <th>Month</th>
            <th>Year</th>
            <th>Amount (₹)</th>
          </tr>
        </thead>
        <tbody>
          {collections.map((c) => (
            <tr key={c._id}>
              <td>{c.homeNumber}</td>
              <td>{c.month}</td>
              <td>{c.year}</td>
              <td>{c.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CollectionTable;
