import React, { useRef } from "react";
import { Form, Field } from "react-final-form";

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
const validateRequired = value =>
  !value ? "You must enter a value" : undefined;
const validateNotFerrari = value =>
  validateRequired(value) ||
  (typeof value === "string" && value.trim().toLowerCase() === "ferrari"
    ? 'I said no "ferrari"'
    : undefined);
const LabelledField = ({
  label,
  instruction,
  autoComplete,
  "aria-required": ariaRequired,
  required,
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
              aria-invalid={Boolean(error)}
              aria-describedby={describedBy}
              aria-required={required || ariaRequired}
              autoComplete={autoComplete}
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
  if (!errors || !formRef || Object.keys(errors).length === 0) {
    return;
  }

  wait(100).then(() => {
    const input = formRef.current.querySelector("[aria-invalid]");
    if (input) {
      input.focus();
    }
  });
};

const A11yForm = ({
  handleSubmit,
  errors,
  submitFailed,
  dirtySinceLastSubmit
}) => {
  const formRef = useRef(null);
  const disabledSubmit = submitFailed && !dirtySinceLastSubmit;

  return (
    <form
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
        autoComplete="given-name"
        aria-required
      />
      <LabelledField
        name="lastName"
        label="Last Name"
        validate={validateRequired}
        autoComplete="family-name"
        aria-required
      />
      <LabelledField
        name="password"
        label="Password"
        instruction='Enter anything except "ferrari"'
        type="password"
        autoComplete="new-password"
        validate={validateNotFerrari}
        aria-required
      />
      <button
        className="submit-button"
        type="submit"
        aria-disabled={disabledSubmit}
        aria-describedby="submit-disabled-note"
      >
        Submit
      </button>
      <p className="visuallyhidden" id="submit-disabled-note">
        There are errors to address
      </p>
    </form>
  );
};

const Notes = () => (
  <details className="implementation-notes">
    <summary>Notes on implementation and screenreader experience</summary>
    <ul>
      <li>
        On submit failure focus is moved to the first field with an error. This
        will result in the field being announced as being invalid and the error
        message read out.
      </li>
      <li>
        Error messages are shown after exiting fields but they aren't announced
        to screenreader users until they try to submit. This is because reading
        out the error messages using a live region would be too distracting and
        would compete with announcing the next field when tabbing between
        fields. This way sighted users benefit from early validation but
        screenreader users aren't overwhelmed with messages.
      </li>
      <li>
        Submit button is marked as aria-disabled when unaddressed errors are
        present. It's also associated with hint using aria-describedby to
        explain the disabled state.
      </li>
      <li>Labels are correctly associated with inputs</li>
      <li>
        aria-required and aria-invalid states set appropriately to ensure they
        are announced
      </li>
      <li>
        Error messages and instructions linked to inputs using aria-describedby
      </li>
      <li>
        Correct autocomplete values set to allow autopopulation when possible
      </li>
    </ul>
  </details>
);

const FormLive = () => {
  return (
    <div>
      <h2>
        Form with validation as you type and autofocus first field on submit
      </h2>
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

export default FormLive;
