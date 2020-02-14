import React, { useRef } from "react";
import { Form, Field } from "react-final-form";
import "./App.css";

const validateRequired = value => (!value ? "Required" : undefined);
const validateNotFerrari = value =>
  validateRequired(value) ||
  (typeof value === "string" && value.trim().toLowerCase() === "ferrari"
    ? 'I said no "ferrari"'
    : undefined);
const LabelledField = ({
  label,
  instruction,
  "aria-required": required,
  ...props
}) => {
  return (
    <Field
      {...props}
      render={({ meta, input }) => {
        const inputId = `form-field-${input.name}`;
        const submitError = !meta.dirtySinceLastSubmit && meta.submitError;
        const validationError = meta.touched && meta.error;
        const error = validationError || submitError;
        const errorId = error ? `form-field-error-${input.name}` : undefined;
        const instructionId = instruction
          ? `form-field-error-${input.name}`
          : undefined;
        const describedBy = [errorId, instructionId].filter(Boolean).join(" ");
        return (
          <div className="labelled-field">
            <label htmlFor={inputId}>
              {label}
              {required ? " *" : ""}
            </label>
            <input
              {...input}
              id={inputId}
              aria-invalid={Boolean(errorId)}
              aria-describedby={describedBy}
              aria-required={required}
            />
            {errorId && (
              <p className="field-error-message" id={errorId}>
                {error}
              </p>
            )}
            {instructionId && (
              <p className="field-instructions" id={instructionId}>
                {instruction}
              </p>
            )}
          </div>
        );
      }}
    />
  );
};

const focusFirstErrorIfFailed = (formRef, errors) => {
  if (!errors || !formRef) {
    return;
  }
  const errorInputNames = Object.keys(errors);
  if (errorInputNames.length === 0) return;

  const errorInputSelector = errorInputNames
    .map(inputName => `[name="${inputName}"]`)
    .join(", ");
  const input = formRef.current.querySelector(errorInputSelector);
  if (input) {
    // might need a delay here for all screenreaders to catch it.
    input.focus();
  }
};

const A11yForm = ({ handleSubmit, errors }) => {
  const formRef = useRef(null);

  return (
    <form
      // just disabled for dev
      autoComplete="off"
      onSubmit={event => {
        handleSubmit(event);

        focusFirstErrorIfFailed(formRef, errors);
      }}
      ref={formRef}
    >
      <LabelledField
        name="firstName"
        label="First Name"
        validate={validateRequired}
        aria-required
      />
      <LabelledField
        name="lastName"
        label="Last Name"
        validate={validateRequired}
        aria-required
      />
      <LabelledField
        name="password"
        label="Password"
        instruction='Enter anything except "ferrari"'
        type="password"
        validate={validateNotFerrari}
        aria-required
      />
      <button className="submit-button" type="submit">
        Submit
      </button>
    </form>
  );
};
const App = () => {
  return (
    <div className="App">
      <h1>A11y Forms Example</h1>
      <Form
        onSubmit={async (values, form) => {
          alert(
            "Form submitted successfully! Don't forget to set focus when you move to the next step."
          );
        }}
        component={A11yForm}
      />
    </div>
  );
};

export default App;
