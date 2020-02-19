import React, { useRef } from "react";
import { Form, Field } from "react-final-form";

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
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
        const instructionId = instruction
          ? `form-field-error-${input.name}`
          : undefined;
        return (
          <div className="labelled-field">
            <label htmlFor={inputId}>
              {label}
              {required ? " *" : ""}
            </label>
            <input
              {...input}
              id={inputId}
              aria-invalid={Boolean(error)}
              aria-describedby={instructionId}
              aria-required={required}
            />

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

const ErrorSummary = ({ errors, labels }) => {
  if (!errors) return;
  const keys = Object.keys(errors);
  if (keys.length === 0) return;
  return (
    <div className="error-summary">
      <p tabIndex="-1" id="error-summary-intro">
        There are errors to address:
      </p>

      {keys.map(key => (
        <p key={key}>
          {labels[key]}: {errors[key]}
        </p>
      ))}
    </div>
  );
};

const focusErrorSummaryIfFailed = (formRef, errors) => {
  if (!errors || !formRef) {
    return;
  }
  const errorInputNames = Object.keys(errors);
  if (errorInputNames.length === 0) return;

  wait(100).then(() => {
    const input = formRef.current.querySelector("#error-summary-intro");
    if (input) {
      input.focus();
    }
  });
};

const fieldLabels = {
  firstName: "First Name",
  lastName: "Last Name",
  password: "Password"
};
const A11yForm = ({ handleSubmit, errors, submitFailed }) => {
  const formRef = useRef(null);

  return (
    <form
      onSubmit={event => {
        handleSubmit(event);
        focusErrorSummaryIfFailed(formRef, errors);
      }}
      ref={formRef}
    >
      {submitFailed ? (
        <ErrorSummary errors={errors} labels={fieldLabels} />
      ) : (
        undefined
      )}
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
const FormLive = () => {
  return (
    <div>
      <h2>Forms with submit validation</h2>
      <Form
        onSubmit={async () => {
          alert(
            "Form submitted successfully! Don't forget to set focus when you move to the next step."
          );
        }}
        component={A11yForm}
      />
    </div>
  );
};

export default FormLive;
