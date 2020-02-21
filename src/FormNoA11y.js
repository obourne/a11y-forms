import React, { useRef } from "react";
import { Form, Field } from "react-final-form";

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
        const instructionId = instruction
          ? `form-field-error-${input.name}`
          : undefined;
        return (
          <div className="labelled-field">
            <label>
              {label}
              {required ? " *" : ""}
            </label>
            <input {...input} />

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
      />
      <button className="submit-button" type="submit">
        Submit
      </button>
    </form>
  );
};

const Notes = () => (
  <details className="implementation-notes">
    <summary>Notes on implementation</summary>
    <ul>
      <li>
        Labels are not associated with input. Screenreader can't announce field
        label when tabbing through
      </li>
      <li>aria-required attribute is not present on required fields</li>
      <li>aria-invalid attribute is not present on fields with errors</li>
      <li>No screenreader feedback on failed submission</li>
    </ul>
  </details>
);

const FormNoA11y = () => {
  return (
    <div>
      <h2>Form with poor a11y</h2>
      <Notes />
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

export default FormNoA11y;
