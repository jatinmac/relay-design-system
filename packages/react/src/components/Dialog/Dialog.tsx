import { useId, type ReactNode } from 'react';
import {
  Dialog as AriaDialog,
  Heading,
  Modal,
  ModalOverlay,
} from 'react-aria-components';

import { IconButton } from '../IconButton/IconButton';
import { usePortalContainer } from '../../provider/PortalContainerContext';
import { classNames } from '../../utils/classNames';
import styles from './Dialog.module.css';

export type DialogSize = 'sm' | 'md' | 'lg';

export interface DialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  size?: DialogSize;
  dismissible?: boolean;
  closeLabel?: string;
  role?: 'dialog' | 'alertdialog';
  className?: string;
}

export function Dialog({
  isOpen,
  onOpenChange,
  title,
  description,
  children,
  footer,
  size = 'md',
  dismissible = true,
  closeLabel = 'Close dialog',
  role = 'dialog',
  className,
}: DialogProps) {
  const descriptionId = useId();
  const portalContainer = usePortalContainer();

  return (
    <ModalOverlay
      {...(portalContainer
        ? { UNSTABLE_portalContainer: portalContainer }
        : {})}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable={dismissible}
      isKeyboardDismissDisabled={!dismissible}
      className={classNames(styles.overlay)}
    >
      <Modal className={classNames(styles.modal, styles[size])}>
        <AriaDialog
          {...(description ? { 'aria-describedby': descriptionId } : {})}
          role={role}
          className={classNames(styles.dialog, className)}
        >
          {({ close }) => (
            <>
              <header className={styles.header}>
                <div className={styles.headingGroup}>
                  <Heading slot="title" className={classNames(styles.title)}>
                    {title}
                  </Heading>
                  {description ? (
                    <p className={styles.description} id={descriptionId}>
                      {description}
                    </p>
                  ) : null}
                </div>
                {dismissible ? (
                  <IconButton
                    autoFocus
                    variant="quiet"
                    size="sm"
                    aria-label={closeLabel}
                    icon={<span aria-hidden="true">×</span>}
                    onClick={close}
                  />
                ) : null}
              </header>
              <div className={styles.body}>{children}</div>
              {footer ? (
                <footer className={styles.footer}>{footer}</footer>
              ) : null}
            </>
          )}
        </AriaDialog>
      </Modal>
    </ModalOverlay>
  );
}

Dialog.displayName = 'Dialog';
