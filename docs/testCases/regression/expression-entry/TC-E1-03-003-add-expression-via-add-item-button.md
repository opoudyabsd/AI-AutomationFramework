# TC-E1-03-003: Click the Add Item button and select Expression to add a new expression line

**Summary:** TC-E1-03-003 [Expression Entry] [regression] — Verify that clicking the "Add Item" button and selecting "Expression" from the menu adds a new blank expression line to the expression list.

**Priority:** 3 — Important UI-based alternative to keyboard entry; primary path for mouse users and touch devices.

**Related:** docs/userstory/E1_ExpressionEntry-GraphiRendering.md, TC-E1-03-001, TC-E1-03-002

## Preconditions

- The Desmos Graphing Calculator is open at https://www.desmos.com/calculator
- The calculator is in a fresh state with no expressions entered

## Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click the "Add Item" button at the bottom of the expression list | A dropdown menu appears with item type options (Expression, Table, Note, Image, Folder) |
| 2 | Click "Expression" in the dropdown menu | The dropdown closes |
| 3 | Observe the expression list | A new blank expression line appears in the expression list |

## Notes for Automation

- **Selector:** `[aria-label="Add Item"]` for the Add Item button; `.dcg-expressionitem` for expression rows
- **Input method:** `await page.locator('[aria-label="Add Item"]').click()` then click the "Expression" menu option
- **Assertion strategy:** Assert the count of `.dcg-expressionitem` elements increased by 1 after selecting Expression
- **Wait strategy:** Use `await expect(page.locator('.dcg-expressionitem').last()).toBeVisible()` after the selection — do not use `waitForTimeout`
