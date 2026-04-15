// HTML / ARIA attribute names used in Playwright toHaveAttribute() assertions.
export const ATTRS = {
  ARIA_LABEL:   'aria-label',
  ARIA_CHECKED: 'aria-checked',
} as const;

// String representations of boolean ARIA attribute values.
// ARIA specifies these as the literal strings "true" / "false", not JS booleans.
export const ATTR_VALUES = {
  TRUE:  'true',
  FALSE: 'false',
} as const;
