import { forwardRef, type ReactNode } from 'react';

import { Button, type ButtonProps } from '../Button/Button';
import { classNames } from '../../utils/classNames';
import styles from './IconButton.module.css';

export interface IconButtonProps extends Omit<
  ButtonProps,
  'aria-label' | 'children' | 'leadingIcon' | 'trailingIcon'
> {
  'aria-label': string;
  icon: ReactNode;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(
    { 'aria-label': accessibleLabel, icon, className, ...buttonProps },
    ref,
  ) {
    return (
      <Button
        {...buttonProps}
        ref={ref}
        aria-label={accessibleLabel}
        className={classNames(styles.root, className)}
      >
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      </Button>
    );
  },
);

IconButton.displayName = 'IconButton';
