# TC-E1-01-005: Leave an expression line empty and verify no curve and no error are shown

**Summary:** TC-E1-01-005 [Expression Entry] [regression] — Verify that an empty expression line on page load does not cause any curve to be drawn and does not display an error indicator.

**Priority:** 2 — Low-priority edge case; validates the default initial state of the calculator.

**Related:** docs/userstory/E1_ExpressionEntry-GraphiRendering.md, TC-E1-01-004

## Preconditions

- The Desmos Graphing Calculator is open at https://www.desmos.com/calculator
- The calculator is in a fresh state with no expressions entered
- The expression list contains one empty expression line

## Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Observe the expression list immediately after page load without interacting with any input | The expression list contains one empty expression line with no content |
| 2 | Observe the expression line for any error indicators | No error indicator is displayed on the empty expression line |
| 3 | Observe the graph canvas | No curve or plotted point is drawn on the graph canvas |

## Notes for Automation

- **Selector:** `.dcg-expressionlist` for the list container; `.dcg-expressionitem` for the expression row; `.dcg-expressionitem .dcg-error` for the error indicator
- **Input method:** No input required — this test verifies the default state on page load
- **Assertion strategy:** Assert `.dcg-expressionitem .dcg-error` is NOT present in the DOM; assert `.dcg-expressionitem` is visible (confirms the list rendered); no pixel assertion on canvas
- **Wait strategy:** After page navigation, use `await expect(page.locator('.dcg-expressionitem')).toBeVisible()` to confirm the list has rendered before asserting absence of errors
