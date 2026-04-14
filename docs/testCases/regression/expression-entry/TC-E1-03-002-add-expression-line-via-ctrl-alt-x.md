# TC-E1-03-002: Press Ctrl+Alt+X and verify a new blank expression line is added

**Summary:** TC-E1-03-002 [Expression Entry] [regression] — Verify that pressing the `Ctrl+Alt+X` keyboard shortcut adds a new blank expression line to the expression list and places keyboard focus in it.

**Priority:** 2 — Secondary keyboard shortcut; less commonly used than Enter but important for keyboard accessibility.

**Related:** docs/userstory/E1_ExpressionEntry-GraphiRendering.md, TC-E1-03-001, TC-E1-03-003

## Preconditions

- The Desmos Graphing Calculator is open at https://www.desmos.com/calculator
- The calculator is in a fresh state with no expressions entered

## Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Press `Ctrl+Alt+X` on the keyboard | A new blank expression line is added to the expression list |
| 2 | Observe the keyboard focus | Keyboard focus is placed in the new blank expression line |

## Notes for Automation

- **Selector:** `.dcg-expressionlist .dcg-expressionitem` for expression rows
- **Input method:** `await page.keyboard.press('Control+Alt+x')` — verify the exact key combination in the live app before automating, as shortcuts may differ by OS
- **Assertion strategy:** Assert the count of `.dcg-expressionitem` elements increased by 1; assert the focused element is a `.dcg-mq-editable-field` within the new item
- **Wait strategy:** Use `await expect(page.locator('.dcg-expressionitem').nth(1)).toBeVisible()` after pressing the shortcut
