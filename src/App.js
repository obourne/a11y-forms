import React, { useState } from "react";
import FormLive from "./FormLive";
import FormSubmit from "./FormSubmit";
import FormNoA11y from "./FormNoA11y";
import "./App.css";
const formsList = [
  { id: "no-a11y", name: "Poor a11y" },
  { id: "live", name: "Live validation" },
  { id: "submit", name: "Submit validation" }
];
const App = () => {
  const [form, setForm] = useState("no-a11y");

  return (
    <div className="App">
      <h1>A11y Forms Example</h1>
      <nav className="nav-buttons">
        {formsList.map(({ id, name }) => {
          const selected = form === id;
          return (
            <button
              className={selected ? "button-active" : undefined}
              aria-pressed={selected}
              onClick={() => setForm(id)}
            >
              {name}
            </button>
          );
        })}
      </nav>

      {form === "live" ? (
        <FormLive />
      ) : form === "submit" ? (
        <FormSubmit />
      ) : (
        <FormNoA11y />
      )}
    </div>
  );
};

export default App;
