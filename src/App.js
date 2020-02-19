import React, { useState } from "react";
import FormLive from "./FormLive";
import FormSubmit from "./FormSubmit";
import FormNoA11y from "./FormNoA11y";
import "./App.css";

const App = () => {
  const [form, setForm] = useState("no-a11y");
  return (
    <div className="App">
      <h1>A11y Forms Example</h1>
      <nav className="nav-buttons">
        <button
          className={form === "no-a11y" ? "button-active" : undefined}
          onClick={() => setForm("no-a11y")}
        >
          Form with bad a11y
        </button>
        <button
          className={form === "live" ? "button-active" : undefined}
          onClick={() => setForm("live")}
        >
          Form with live validation
        </button>
        <button
          className={form === "submit" ? "button-active" : undefined}
          onClick={() => setForm("submit")}
        >
          Form with submit validation
        </button>
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
