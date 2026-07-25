import type { HTMLAttributes, ReactNode } from 'react';

import { classNames } from '../../utils/classNames';
import styles from './Badge.module.css';

export type BadgeTone = 'neutral' | 'info' | 'success' | 'warning' | 'critical';

export interface BadgeProps extends Omit<
  HTMLAttributes<HTMLSpanElement>,
  'color'
> {
  tone?: BadgeTone;
  icon?: ReactNode;
}

export function Badge({
  tone = 'neutral',
  icon,
  className,
  children,
  ...spanProps
}: BadgeProps) {
  return (
    <span
      {...spanProps}
      className={classNames(styles.root, styles[tone], className)}
    >
      {icon ? (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <span className={styles.content}>{children}</span>
    </span>
  );
}

Badge.displayName = 'Badge';
