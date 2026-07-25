import { useId, type ReactNode } from 'react';

import styles from './FormField.module.css';

export interface FormFieldControlProps {
  id: string;
  'aria-describedby'?: string | undefined;
  'aria-invalid'?: true | undefined;
  'aria-required'?: true | undefined;
}

export interface FormFieldProps {
  id?: string | undefined;
  label: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  children: (controlProps: FormFieldControlProps) => ReactNode;
}

export function FormField({
  id,
  label,
  hint,
  error,
  required = false,
  children,
}: FormFieldProps) {
  const generatedId = useId();
  const controlId = id ?? `field-${generatedId}`;
  const hintId = hint ? `${controlId}-hint` : undefined;
  const errorId = error ? `${controlId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={styles.root}>
      <label className={styles.label} htmlFor={controlId}>
        {label}
        {required ? (
          <span className={styles.required} aria-hidden="true">
            *
          </span>
        ) : null}
      </label>
      {children({
        id: controlId,
        'aria-describedby': describedBy,
        'aria-invalid': error ? true : undefined,
        'aria-required': required ? true : undefined,
      })}
      {hint ? (
        <div className={styles.hint} id={hintId}>
          {hint}
        </div>
      ) : null}
      {error ? (
        <div className={styles.error} id={errorId} role="alert">
          {error}
        </div>
      ) : null}
    </div>
  );
}

FormField.displayName = 'FormField';
