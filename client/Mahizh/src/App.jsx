import CollectionForm from "./components/CollectionForm";
import ExpenseForm from "./components/ExpenseForm";
import Summary from "./components/Summary";
import CollectionTable from "./components/CollectionTable";
import ExpenseTable from "./components/ExpenseTable";

function App() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Apartment Maintenance Tracker</h1>

      <Summary />

      <CollectionForm />
      <CollectionTable />

      <ExpenseForm />
      <ExpenseTable />
    </div>
  );
}

export default App;



