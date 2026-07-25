import {
  forwardRef,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';

import { classNames } from '../../utils/classNames';
import styles from './Checkbox.module.css';

export interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'children' | 'color' | 'onChange' | 'readOnly' | 'type'
> {
  label: ReactNode;
  description?: ReactNode;
  indeterminate?: boolean;
  readOnly?: boolean;
  visuallyHiddenLabel?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox(
    {
      id,
      label,
      description,
      indeterminate = false,
      readOnly = false,
      visuallyHiddenLabel = false,
      disabled = false,
      required = false,
      onCheckedChange,
      className,
      ...inputProps
    },
    forwardedRef,
  ) {
    const generatedId = useId();
    const inputId = id ?? `checkbox-${generatedId}`;
    const descriptionId = description ? `${inputId}-description` : undefined;
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(
      forwardedRef,
      () => inputRef.current as HTMLInputElement,
    );

    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    return (
      <div
        className={classNames(styles.root, className)}
        data-disabled={disabled || undefined}
        data-read-only={readOnly || undefined}
        data-indeterminate={indeterminate || undefined}
      >
        <span className={styles.controlWrapper}>
          <input
            {...inputProps}
            ref={inputRef}
            id={inputId}
            className={styles.input}
            type="checkbox"
            disabled={disabled}
            required={required}
            aria-checked={indeterminate ? 'mixed' : undefined}
            aria-describedby={descriptionId}
            aria-readonly={readOnly || undefined}
            onClick={(event) => {
              if (readOnly) {
                event.preventDefault();
              }
            }}
            onChange={(event) => {
              if (!readOnly) {
                onCheckedChange?.(event.currentTarget.checked);
              }
            }}
          />
          <span className={styles.control} aria-hidden="true">
            <svg className={styles.checkmark} viewBox="0 0 16 16">
              <path d="m3 8 3 3 7-7" />
            </svg>
            <svg className={styles.mixed} viewBox="0 0 16 16">
              <path d="M3 8h10" />
            </svg>
          </span>
        </span>
        <span
          className={classNames(
            styles.copy,
            visuallyHiddenLabel && styles.visuallyHiddenCopy,
          )}
        >
          <label className={styles.label} htmlFor={inputId}>
            {label}
          </label>
          {description ? (
            <span className={styles.description} id={descriptionId}>
              {description}
            </span>
          ) : null}
        </span>
      </div>
    );
  },
);

Checkbox.displayName = 'Checkbox';
