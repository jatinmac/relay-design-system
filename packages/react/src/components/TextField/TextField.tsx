import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';

import { FormField } from '../FormField/FormField';
import { classNames } from '../../utils/classNames';
import styles from './TextField.module.css';

export interface TextFieldProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'children' | 'color' | 'size'
> {
  label: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField(
    {
      id,
      label,
      hint,
      error,
      required = false,
      disabled = false,
      readOnly = false,
      type = 'text',
      className,
      'aria-describedby': externalDescription,
      ...inputProps
    },
    ref,
  ) {
    return (
      <FormField
        id={id}
        label={label}
        hint={hint}
        error={error}
        required={required}
      >
        {(controlProps) => {
          const describedBy = [
            controlProps['aria-describedby'],
            externalDescription,
          ]
            .filter(Boolean)
            .join(' ');

          return (
            <input
              {...inputProps}
              {...controlProps}
              ref={ref}
              type={type}
              className={classNames(styles.input, className)}
              disabled={disabled}
              readOnly={readOnly}
              required={required}
              aria-describedby={describedBy || undefined}
            />
          );
        }}
      </FormField>
    );
  },
);

TextField.displayName = 'TextField';
