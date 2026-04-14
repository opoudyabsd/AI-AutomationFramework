# TC-E1-01-002: Type an implicit function without a "y=" prefix and verify it is graphed

**Summary:** TC-E1-01-002 [Expression Entry] [regression] — Verify that typing a function without an explicit `y=` prefix (e.g., `sin(x)`) is correctly interpreted and its curve is rendered on the graph canvas.

**Priority:** 3 — Important alternative input flow; users commonly omit the `y=` prefix.

**Related:** docs/userstory/E1_ExpressionEntry-GraphiRendering.md, TC-E1-01-001

## Preconditions

- The Desmos Graphing Calculator is open at https://www.desmos.com/calculator
- The calculator is in a fresh state with no expressions entered
- The expression list contains one empty expression line

## Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click on the first empty expression line in the expression list | The expression input field becomes focused |
| 2 | Type `sin(x)` using the keyboard | The input field displays `sin(x)` in MathQuill formatted notation |
| 3 | Observe the graph canvas | A sine wave curve is rendered on the graph canvas |

## Notes for Automation

- **Selector:** `.dcg-mq-editable-field` for the expression input; `.dcg-expressionitem` for the expression row
- **Input method:** Click `.dcg-mq-editable-field`, then use `page.keyboard.type('sin(x)')` — do NOT use `locator.fill()`
- **Assertion strategy:** Assert `.dcg-expressionitem` is visible and does NOT contain `.dcg-error`; absence of error is the proxy for successful graph rendering
- **Wait strategy:** Use `await expect(page.locator('.dcg-expressionitem')).toBeVisible()` after typing before asserting
