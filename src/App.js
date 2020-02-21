import React, { useState } from "react";
import FormLive from "./FormLive";
import FormSubmit from "./FormSubmit";
import FormNoA11y from "./FormNoA11y";
import "./App.css";
const formsList = [
  { id: "live", name: "Instant validation with auto focus" },
  { id: "submit", name: "Submit validation with summary alert" },
  { id: "no-a11y", name: "Poor a11y" }
];
const App = () => {
  const [form, setForm] = useState(formsList[0].id);

  return (
    <div className="App">
      <h1>Accessible Forms Examples</h1>
      <nav className="nav-buttons">
        {formsList.map(({ id, name }) => {
          const selected = form === id;
          return (
            <button
              key={id}
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
