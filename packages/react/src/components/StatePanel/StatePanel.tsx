import type { HTMLAttributes, ReactNode } from 'react';

import { classNames } from '../../utils/classNames';
import styles from './StatePanel.module.css';

export type StatePanelStatus =
  'loading' | 'empty' | 'no-results' | 'error' | 'no-access';

export interface StatePanelProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'color' | 'title'
> {
  status: StatePanelStatus;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  icon?: ReactNode;
}

export function StatePanel({
  status,
  title,
  description,
  action,
  icon,
  className,
  ...panelProps
}: StatePanelProps) {
  const isLoading = status === 'loading';
  const isError = status === 'error';

  return (
    <div
      {...panelProps}
      className={classNames(styles.root, styles[status], className)}
      role={isError ? undefined : 'status'}
      aria-busy={isLoading || undefined}
      aria-live={isError ? undefined : 'polite'}
    >
      {isLoading ? (
        <span className={styles.spinner} aria-hidden="true" />
      ) : icon ? (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <div
        className={styles.copy}
        role={isError ? 'alert' : undefined}
        aria-live={isError ? 'assertive' : undefined}
      >
        <div className={styles.title}>{title}</div>
        {description ? (
          <div className={styles.description}>{description}</div>
        ) : null}
      </div>
      {action ? <div className={styles.action}>{action}</div> : null}
    </div>
  );
}

StatePanel.displayName = 'StatePanel';
