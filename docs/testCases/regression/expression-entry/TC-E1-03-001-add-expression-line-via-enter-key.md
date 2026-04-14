# TC-E1-03-001: Press Enter in a focused expression line and verify a new blank line is added

**Summary:** TC-E1-03-001 [Expression Entry] [regression] — Verify that pressing Enter while an expression line is focused adds a new blank expression line directly below it and moves keyboard focus to the new line.

**Priority:** 4 — Primary keyboard workflow for adding expressions; heavily used by all users.

**Related:** docs/userstory/E1_ExpressionEntry-GraphiRendering.md, TC-E1-03-002, TC-E1-03-003, TC-E1-03-004

## Preconditions

- The Desmos Graphing Calculator is open at https://www.desmos.com/calculator
- The calculator is in a fresh state with no expressions entered
- The first expression line is focused (click it to focus)

## Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click on the first expression line to place focus in it | The expression input field is focused |
| 2 | Press the `Enter` key | A new blank expression line appears below the current one in the expression list |
| 3 | Observe the keyboard focus | Keyboard focus has moved to the new blank expression line |

## Notes for Automation

- **Selector:** `.dcg-expressionlist .dcg-expressionitem` for expression rows; count items before and after to verify a new one was added
- **Input method:** `await page.keyboard.press('Enter')` while focus is on `.dcg-mq-editable-field`
- **Assertion strategy:** Assert the count of `.dcg-expressionitem` elements increased by 1; assert the last `.dcg-mq-editable-field` in the list has focus
- **Wait strategy:** Use `await expect(page.locator('.dcg-expressionitem').nth(1)).toBeVisible()` after pressing Enter — do not use `waitForTimeout`
