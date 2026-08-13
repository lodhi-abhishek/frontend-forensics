"use client";

import { type FormEvent, useRef, useState } from "react";
import styles from "./aeos.module.css";

type Values = {
  email: string;
  firstName: string;
  company: string;
  message: string;
};

type Field = keyof Values;

const initialValues: Values = {
  email: "",
  firstName: "",
  company: "",
  message: "",
};

function validate(values: Values) {
  const errors: Partial<Record<Field, string>> = {};
  if (!values.email.trim()) errors.email = "Enter your email address.";
  else if (!/^\S+@\S+\.\S+$/.test(values.email))
    errors.email = "Enter a valid email address.";
  if (!values.firstName.trim()) errors.firstName = "Enter your first name.";
  if (!values.company.trim()) errors.company = "Enter your company name.";
  if (!values.message.trim()) errors.message = "Tell us briefly how we can help.";
  return errors;
}

export function ContactForm() {
  const [values, setValues] = useState(initialValues);
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [success, setSuccess] = useState(false);
  const refs = useRef<Partial<Record<Field, HTMLInputElement | HTMLTextAreaElement | null>>>({});
  const errors = validate(values);

  const setValue = (field: Field, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(values);
    if (Object.keys(nextErrors).length > 0) {
      setTouched({ email: true, firstName: true, company: true, message: true });
      const first = (["email", "firstName", "company", "message"] as Field[]).find(
        (field) => nextErrors[field],
      );
      if (first) refs.current[first]?.focus();
      return;
    }
    setSuccess(true);
  };

  if (success) {
    return (
      <div className={styles.formSuccess} role="status" aria-live="polite">
        <span className={styles.formSuccessMark}>✦</span>
        <h3>Your enquiry is ready.</h3>
        <p>
          This demo keeps your details in this browser and does not transmit form
          data.
        </p>
        <button
          type="button"
          onClick={() => {
            setValues(initialValues);
            setTouched({});
            setSuccess(false);
          }}
        >
          Start another enquiry
        </button>
      </div>
    );
  }

  const fields: Array<{
    field: Field;
    label: string;
    type?: string;
    autoComplete?: string;
    multiline?: boolean;
    fullWidth?: boolean;
  }> = [
    { field: "email", label: "Email", type: "email", autoComplete: "email" },
    {
      field: "firstName",
      label: "First Name",
      autoComplete: "given-name",
    },
    {
      field: "company",
      label: "Company Name",
      autoComplete: "organization",
      fullWidth: true,
    },
    {
      field: "message",
      label: "How can we help?",
      multiline: true,
      fullWidth: true,
    },
  ];

  return (
    <form className={styles.contactForm} noValidate onSubmit={onSubmit}>
      {fields.map(
        ({ field, label, type, autoComplete, multiline, fullWidth }) => {
          const showError = touched[field] && errors[field];
          const common = {
            id: `aeos-${field}`,
            value: values[field],
            placeholder: label,
            onChange: (
              event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
            ) => setValue(field, event.target.value),
            onBlur: () =>
              setTouched((current) => ({ ...current, [field]: true })),
            "aria-invalid": Boolean(showError),
            "aria-describedby": showError ? `aeos-${field}-error` : undefined,
          };

          const fieldClassName = [
            styles.formField,
            fullWidth ? styles.formFieldFull : "",
            multiline ? styles.formFieldMessage : "",
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <div className={fieldClassName} key={field}>
              <label className={styles.srOnly} htmlFor={`aeos-${field}`}>
                {label}
              </label>
              {multiline ? (
                <textarea
                  {...common}
                  ref={(node) => {
                    refs.current[field] = node;
                  }}
                  rows={4}
                />
              ) : (
                <input
                  {...common}
                  ref={(node) => {
                    refs.current[field] = node;
                  }}
                  type={type ?? "text"}
                  autoComplete={autoComplete}
                />
              )}
              {showError && (
                <span id={`aeos-${field}-error`} className={styles.formError}>
                  {errors[field]}
                </span>
              )}
            </div>
          );
        },
      )}
      <button className={styles.submitButton} type="submit">
        <span>Submit Enquiry</span>
        <span aria-hidden="true">↗</span>
      </button>
    </form>
  );
}
