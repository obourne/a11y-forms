import React, { useRef, useState } from "react";
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
              <p className="visuallyhidden" id={errorId}>
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

const ErrorSummary = ({ errors, labels, showSkip }) => {
  const keys = errors && Object.keys(errors);
  const contents =
    keys && keys.length > 0 ? (
      <div className="error-summary">
        <p tabIndex="-1" id="error-summary-intro">
          There are errors to address:
        </p>

        {keys.map(key => (
          <p key={key}>
            {labels[key]}: {errors[key]}
          </p>
        ))}
        {showSkip ? (
          <p>
            <a href={`#form-field-${keys[0]}`}>Skip to first error</a>
          </p>
        ) : (
          undefined
        )}
      </div>
    ) : (
      undefined
    );
  return <div role="alert">{contents}</div>;
};

const focusErrorSummary = () => {
  wait(100).then(() => {
    const input = document.querySelector("#error-summary-intro");
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

const createSubmitHandler = autoFocus => async (values, form) => {
  const errors = {
    firstName: validateRequired(values.firstName),
    lastName: validateRequired(values.lastName),
    password: validateNotFerrari(values.password)
  };
  const hasErrors = Object.keys(errors).reduce(
    (hasError, errorKey) => hasError || errors[errorKey] !== undefined,
    false
  );
  if (!hasErrors) {
    form.alert(
      "Form submitted successfully! Don't forget to set focus when you move to the next step."
    );
    return;
  }
  if (autoFocus) {
    focusErrorSummary();
  }
  return errors;
};

const AutofocusSetting = ({ withAutoFocus, setWithAutoFocus }) => (
  <div className="autofocus-setting">
    <label>
      <input
        type="checkbox"
        name="with-autofocus"
        value="autofocus"
        checked={withAutoFocus}
        onChange={e =>
          console.log(e.target.checked) || setWithAutoFocus(e.target.checked)
        }
        aria-describedBy="autofocus-setting-advice"
      />
      Use example with autofocusing submit error
    </label>
    <p id="autofocus-setting-advice" className="field-instructions">
      Some screenreader users can find automatically moving focus disorienting
      and may prefer to have the error announced and to navigate to the fields
      themselves. Both options are valid and accessible but consider which makes
      most sense for your use case.
    </p>
  </div>
);

const Notes = () => (
  <details className="implementation-notes">
    <summary>Notes on implementation and screenreader experience</summary>
    <ul>
      <li>
        On submit failure an error summary is added to an aria live region with
        role="alert" ensuring it is announced when it appears
      </li>
      <li>
        Autofocusing error summary on failed submission (when example setting is
        enabled). This can make it easier to tab to the field with the error but
        can also be confusing as the user will not know where there focus is
        relative to the rest of the page.
      </li>
      <li>
        A link to skip to first error from the summary is also added when using
        autofocus to make it easy to jump to the correct place. This is omitted
        when focusing is not used as it would be difficult to action when the
        focus is not in the that region.
      </li>
      <li>
        Submit button marked as aria-disabled when unaddressed errors are
        present. It's also associated with error summary intro using
        aria-describedby to explain the disabled state.
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

const FormSubmit = () => {
  const formRef = useRef(null);
  const [withAutoFocus, setWithAutoFocus] = useState(false);
  const submitHandler = createSubmitHandler(withAutoFocus);
  return (
    <div>
      <h2>Form with submit validation using alert live region</h2>
      <Notes />
      <AutofocusSetting
        withAutoFocus={withAutoFocus}
        setWithAutoFocus={setWithAutoFocus}
      />
      <Form
        onSubmit={submitHandler}
        render={({
          handleSubmit,
          submitErrors,
          dirtySinceLastSubmit,
          submitFailed
        }) => {
          const disabledSubmit = submitFailed && !dirtySinceLastSubmit;
          return (
            <form onSubmit={handleSubmit} ref={formRef}>
              <ErrorSummary
                errors={submitErrors}
                labels={fieldLabels}
                showSkip={withAutoFocus}
              />
              <LabelledField
                name="firstName"
                label="First Name"
                autoComplete="given-name"
                required
              />
              <LabelledField
                name="lastName"
                label="Last Name"
                autoComplete="family-name"
                required
              />
              <LabelledField
                name="password"
                label="Password"
                instruction='Enter anything except "ferrari"'
                type="password"
                autoComplete="new-password"
                required
              />
              <button
                className="submit-button"
                type="submit"
                aria-disabled={disabledSubmit}
                aria-describedby="error-summary-intro"
              >
                Submit
              </button>
            </form>
          );
        }}
      />
    </div>
  );
};

export default FormSubmit;
