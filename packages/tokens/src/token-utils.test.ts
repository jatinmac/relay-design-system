import { describe, expect, it } from 'vitest';

import {
  collectTokens,
  contractSignature,
  cssVariableName,
} from '../scripts/lib.mjs';

describe('token utilities', () => {
  it('inherits a DTCG group type', () => {
    const tokens = collectTokens({
      color: {
        $type: 'color',
        text: {
          primary: {
            $description: 'Primary text',
            $value: {
              colorSpace: 'srgb',
              components: [0, 0, 0],
            },
          },
        },
      },
    });

    expect(tokens.get('color.text.primary')).toMatchObject({
      description: 'Primary text',
      type: 'color',
    });
  });

  it('creates deterministic CSS variable names', () => {
    expect(cssVariableName('color.action.primary.background.default')).toBe(
      '--ds-color-action-primary-background-default',
    );
    expect(cssVariableName('font.lineHeight.body')).toBe(
      '--ds-font-line-height-body',
    );
  });

  it('compares contracts by path and type rather than value', () => {
    const first = collectTokens({
      radius: {
        control: {
          $type: 'dimension',
          $value: { value: 4, unit: 'px' },
        },
      },
    });
    const second = collectTokens({
      radius: {
        control: {
          $type: 'dimension',
          $value: { value: 12, unit: 'px' },
        },
      },
    });

    expect(contractSignature(first)).toEqual(contractSignature(second));
  });
});
