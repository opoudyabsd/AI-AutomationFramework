# TC-E1-02-001: Edit an existing expression and verify the graph updates to reflect the change

**Summary:** TC-E1-02-001 [Expression Entry] [regression] — Verify that editing an existing expression replaces the previously rendered curve with the new one and the graph updates within 2 seconds.

**Priority:** 4 — Core editing flow; failure means users cannot iterate on expressions.

**Related:** docs/userstory/E1_ExpressionEntry-GraphiRendering.md, TC-E1-01-001, TC-E1-02-002

## Preconditions

- The Desmos Graphing Calculator is open at https://www.desmos.com/calculator
- The expression line contains `y=x^2` and a parabola is currently rendered on the graph canvas

## Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click on the expression line containing `y=x^2` | The expression input field becomes focused and the existing content is editable |
| 2 | Select all content in the expression field using `Ctrl+A` | All text in the field is selected |
| 3 | Type `y=x^3` using the keyboard | The input field displays `y=x³` in MathQuill formatted notation, replacing the previous content |
| 4 | Observe the graph canvas | The parabola is replaced by a cubic curve on the graph canvas |
| 5 | Note the time from the last keystroke to the graph update | The graph update completes within 2 seconds of the last keystroke |

## Notes for Automation

- **Selector:** `.dcg-mq-editable-field` for expression input; `.dcg-expressionitem` for the expression row
- **Input method:** Click `.dcg-mq-editable-field`, press `Control+A` to select all, then use `page.keyboard.type('y=x^3')` — do NOT use `locator.fill()`
- **Assertion strategy:** Assert `.dcg-expressionitem` is visible and does NOT contain `.dcg-error` after editing; use absence of error as proxy that the new curve rendered
- **Wait strategy:** Use `await expect(page.locator('.dcg-expressionitem')).not.toContainText('error')` or check for absence of `.dcg-error` — do not use `waitForTimeout`
