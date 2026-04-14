# TC-E1-01-003: Type a numeric expression and verify the evaluated result is shown with no curve drawn

**Summary:** TC-E1-01-003 [Expression Entry] [regression] — Verify that typing a pure arithmetic expression (e.g., `2+2`) displays the evaluated result below the input and does not draw any curve on the graph canvas.

**Priority:** 3 — Secondary behavior; confirms the calculator correctly distinguishes equations from numeric expressions.

**Related:** docs/userstory/E1_ExpressionEntry-GraphiRendering.md, TC-E1-01-001

## Preconditions

- The Desmos Graphing Calculator is open at https://www.desmos.com/calculator
- The calculator is in a fresh state with no expressions entered
- The expression list contains one empty expression line

## Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click on the first empty expression line in the expression list | The expression input field becomes focused |
| 2 | Type `2+2` using the keyboard | The input field displays `2+2` in MathQuill notation |
| 3 | Observe the expression line below the input field | The evaluated result `4` is displayed below the input within the expression item |
| 4 | Observe the graph canvas | No curve or plotted point is drawn on the graph canvas |

## Notes for Automation

- **Selector:** `.dcg-mq-editable-field` for expression input; `.dcg-expressionitem` for the expression row
- **Input method:** Click `.dcg-mq-editable-field`, then use `page.keyboard.type('2+2')` — do NOT use `locator.fill()`
- **Assertion strategy:** Assert the expression item contains a text node showing `4`; assert `.dcg-expressionitem .dcg-error` is NOT present; no pixel assertion on the canvas
- **Wait strategy:** Use `await expect(page.locator('.dcg-expressionitem')).toBeVisible()` after typing before asserting the result text
