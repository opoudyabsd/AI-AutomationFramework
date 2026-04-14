# TC-E1-01-004: Type a malformed expression and verify an inline error indicator appears

**Summary:** TC-E1-01-004 [Expression Entry] [regression] — Verify that typing a syntactically invalid expression (e.g., `y=x^^2`) displays an inline error indicator on the expression line, prevents any curve from being drawn, and announces the error to screen readers.

**Priority:** 4 — High importance; error handling is critical for usability and accessibility compliance.

**Related:** docs/userstory/E1_ExpressionEntry-GraphiRendering.md, TC-E1-01-001, TC-E1-01-005

## Preconditions

- The Desmos Graphing Calculator is open at https://www.desmos.com/calculator
- The calculator is in a fresh state with no expressions entered
- The expression list contains one empty expression line

## Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click on the first empty expression line in the expression list | The expression input field becomes focused |
| 2 | Type `y=x^^2` using the keyboard | The characters appear in the MathQuill input field as typed |
| 3 | Observe the expression line | An inline error indicator is displayed on the expression line (e.g., a red icon or error styling) |
| 4 | Observe the graph canvas | No curve is drawn on the graph canvas |
| 5 | Observe the screen reader output or ARIA live region | The error is announced as an error message by the screen reader |

## Notes for Automation

- **Selector:** `.dcg-mq-editable-field` for input; `.dcg-expressionitem .dcg-error` for the inline error indicator
- **Input method:** Click `.dcg-mq-editable-field`, then use `page.keyboard.type('y=x^^2')` — the `^` character is typed as a regular key; do NOT use `locator.fill()`
- **Assertion strategy:** Assert `page.locator('.dcg-expressionitem .dcg-error')` is visible in the DOM; assert no new curve-bearing expression item is created in `.dcg-expressionlist`
- **Wait strategy:** Use `await expect(page.locator('.dcg-expressionitem .dcg-error')).toBeVisible()` after typing — do not use `waitForTimeout`
