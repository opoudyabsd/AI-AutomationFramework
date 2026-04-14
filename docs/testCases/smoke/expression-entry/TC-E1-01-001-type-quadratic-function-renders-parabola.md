# TC-E1-01-001: Type a quadratic function and verify the parabola is rendered on the graph

**Summary:** TC-E1-01-001 [Expression Entry] [smoke] — Verify that typing a valid quadratic equation renders the correct curve on the graph canvas and the expression displays in formatted MathQuill notation within 2 seconds.

**Priority:** 5 — Core feature; if this fails the calculator's primary purpose is broken and the test script must be implemented immediately.

**Related:** docs/userstory/E1_ExpressionEntry-GraphiRendering.md, TC-E1-01-002, TC-E1-02-001

## Preconditions

- The Desmos Graphing Calculator is open at https://www.desmos.com/calculator
- The calculator is in a fresh state with no expressions entered
- The expression list contains one empty expression line

## Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click on the first empty expression line in the expression list | The expression input field becomes focused and a cursor appears inside it |
| 2 | Type `y=x^2` using the keyboard | The input field displays `y=x²` in formatted MathQuill notation as each character is typed |
| 3 | Observe the graph canvas | A parabola curve is rendered on the graph canvas |
| 4 | Note the time from the last keystroke to the graph update | The graph update completes within 2 seconds of the last keystroke |

## Notes for Automation

- **Selector:** `.dcg-mq-editable-field` for the expression input; `.dcg-expressionitem` for the expression row; `.dcg-graph-outer canvas` for the graph canvas
- **Input method:** Click `.dcg-mq-editable-field` first, then use `page.keyboard.type('y=x^2')` — do NOT use `locator.fill()` as MathQuill does not support native fill
- **Assertion strategy:** Assert `.dcg-expressionitem` is visible and does NOT contain `.dcg-error`; canvas rendering cannot be pixel-asserted — use absence of error as the proxy for successful rendering
- **Wait strategy:** After typing, use `await expect(page.locator('.dcg-expressionitem')).toBeVisible()` before asserting absence of `.dcg-error` — do not use `waitForTimeout`
