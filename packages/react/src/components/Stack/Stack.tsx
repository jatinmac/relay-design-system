import {
  createElement,
  type ComponentPropsWithoutRef,
  type ElementType,
  type ReactNode,
} from 'react';

import { classNames } from '../../utils/classNames';
import styles from './Stack.module.css';

export type StackDirection = 'row' | 'column';
export type StackGap = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type StackAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type StackJustify =
  'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';

interface StackOwnProps<TElement extends ElementType> {
  as?: TElement;
  direction?: StackDirection;
  gap?: StackGap;
  align?: StackAlign;
  justify?: StackJustify;
  wrap?: boolean;
  children?: ReactNode;
}

export type StackProps<TElement extends ElementType = 'div'> =
  StackOwnProps<TElement> &
    Omit<
      ComponentPropsWithoutRef<TElement>,
      keyof StackOwnProps<TElement> | 'className' | 'color'
    > & {
      className?: string;
    };

export function Stack<TElement extends ElementType = 'div'>({
  as,
  direction = 'column',
  gap = 'md',
  align = 'stretch',
  justify = 'start',
  wrap = false,
  className,
  children,
  ...elementProps
}: StackProps<TElement>) {
  const element = as ?? 'div';

  return createElement(
    element,
    {
      ...elementProps,
      className: classNames(
        styles.root,
        styles[direction],
        styles[`gap-${gap}`],
        styles[`align-${align}`],
        styles[`justify-${justify}`],
        wrap && styles.wrap,
        className,
      ),
    },
    children,
  );
}

Stack.displayName = 'Stack';
