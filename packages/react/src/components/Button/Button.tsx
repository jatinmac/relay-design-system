import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

import { classNames } from '../../utils/classNames';
import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'critical' | 'quiet';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'color' | 'disabled'
> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled = false,
      leadingIcon,
      trailingIcon,
      type = 'button',
      className,
      children,
      ...buttonProps
    },
    ref,
  ) {
    const unavailable = disabled || loading;

    return (
      <button
        {...buttonProps}
        ref={ref}
        type={type}
        className={classNames(
          styles.root,
          styles[variant],
          styles[size],
          className,
        )}
        disabled={unavailable}
        aria-busy={loading || undefined}
        data-loading={loading || undefined}
      >
        {loading ? (
          <span className={styles.spinner} aria-hidden="true" />
        ) : null}
        {!loading && leadingIcon ? (
          <span className={styles.icon} aria-hidden="true">
            {leadingIcon}
          </span>
        ) : null}
        <span className={styles.content}>{children}</span>
        {!loading && trailingIcon ? (
          <span className={styles.icon} aria-hidden="true">
            {trailingIcon}
          </span>
        ) : null}
      </button>
    );
  },
);

Button.displayName = 'Button';
