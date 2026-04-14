# TC-E1-04-004: Trigger the visibility toggle via keyboard and verify the screen reader announces the new state

**Summary:** TC-E1-04-004 [Expression Entry] [regression] — Verify that hiding or showing an expression via keyboard triggers a screen reader announcement that correctly states whether the item is now hidden or visible.

**Priority:** 3 — Accessibility requirement; users relying on screen readers must know the result of visibility toggle actions.

**Related:** docs/userstory/E1_ExpressionEntry-GraphiRendering.md, TC-E1-04-003, TC-E1-03-004

## Preconditions

- The Desmos Graphing Calculator is open at https://www.desmos.com/calculator
- The expression list contains `y=x^2` and the expression line is focused

## Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click on the `y=x^2` expression line to focus it | The expression input field is focused |
| 2 | Press `Ctrl+Shift+O` then `Enter` to trigger the hide action via keyboard | The visibility state of the expression toggles (hidden or visible) |
| 3 | Observe the ARIA live region or screen reader output | The screen reader announces whether the item is now hidden or visible |

## Notes for Automation

- **Selector:** ARIA live region (`role="status"`, `role="alert"`, or `aria-live` attributes) for the announcement; `.dcg-expression-icon` for the icon state
- **Input method:** Focus `.dcg-mq-editable-field`, then `await page.keyboard.press('Control+Shift+O')` followed by `await page.keyboard.press('Enter')`
- **Assertion strategy:** Assert that an ARIA live region contains text indicating the hidden or visible state change — inspect the live DOM for the exact ARIA live region selector and expected text before implementing
- **Wait strategy:** Use `await expect(page.locator('[aria-live]')).toContainText(...)` after the key sequence — do not use `waitForTimeout`
