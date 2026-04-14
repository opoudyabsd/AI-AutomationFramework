# TC-E1-02-002: Clear all content from an expression line and verify the graph is removed

**Summary:** TC-E1-02-002 [Expression Entry] [regression] — Verify that deleting all content from an expression line removes the corresponding curve from the graph canvas and leaves the line blank with no error shown.

**Priority:** 3 — Important edge case; ensures the graph stays in sync when an expression is fully deleted.

**Related:** docs/userstory/E1_ExpressionEntry-GraphiRendering.md, TC-E1-02-001, TC-E1-01-005

## Preconditions

- The Desmos Graphing Calculator is open at https://www.desmos.com/calculator
- The expression list contains `y=x^2` and a parabola is currently rendered on the graph canvas

## Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click on the expression line containing `y=x^2` | The expression input field becomes focused |
| 2 | Select all content in the expression field using `Ctrl+A` | All text in the field is selected |
| 3 | Press `Backspace` or `Delete` to remove all selected content | The expression input field is now empty |
| 4 | Observe the graph canvas | The parabola is removed from the graph canvas |
| 5 | Observe the expression line | The expression line is blank and no error indicator is displayed |

## Notes for Automation

- **Selector:** `.dcg-mq-editable-field` for expression input; `.dcg-expressionitem` for the expression row; `.dcg-expressionitem .dcg-error` for the error indicator
- **Input method:** Click `.dcg-mq-editable-field`, press `Control+A`, then press `Backspace` — do NOT use `locator.fill('')` or `locator.clear()`
- **Assertion strategy:** Assert `.dcg-expressionitem` is visible; assert `.dcg-expressionitem .dcg-error` is NOT present; the empty state is the same as the initial page load state from TC-E1-01-005
- **Wait strategy:** Use `await expect(page.locator('.dcg-expressionitem .dcg-error')).not.toBeVisible()` after clearing — do not use `waitForTimeout`
