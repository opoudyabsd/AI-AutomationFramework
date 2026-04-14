# TC-E1-05-003: Press Ctrl+Shift+O on a focused expression line to open the Style menu via keyboard

**Summary:** TC-E1-05-003 [Expression Entry] [regression] — Verify that pressing `Ctrl+Shift+O` while an expression line is focused opens the Style menu and makes it keyboard-navigable with focus placed on the first option.

**Priority:** 3 — Keyboard accessibility path for expression styling; required for users who navigate without a mouse.

**Related:** docs/userstory/E1_ExpressionEntry-GraphiRendering.md, TC-E1-05-001, TC-E1-04-003

## Preconditions

- The Desmos Graphing Calculator is open at https://www.desmos.com/calculator
- The expression list contains at least one expression with a graphed function (e.g., `y=x^2`)
- The expression line is focused

## Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click on the expression line containing `y=x^2` to focus it | The expression input field is focused |
| 2 | Press `Ctrl+Shift+O` on the keyboard | The Style menu opens |
| 3 | Observe whether the Style menu can be navigated with the keyboard | The Style menu is keyboard-navigable (arrow keys move between options) |
| 4 | Observe keyboard focus | The first option in the Style menu receives focus |

## Notes for Automation

- **Selector:** `.dcg-mq-editable-field` for expression focus; inspect the live DOM for the Style menu container and its focusable first option
- **Input method:** Focus `.dcg-mq-editable-field`, then `await page.keyboard.press('Control+Shift+O')`
- **Assertion strategy:** Assert the Style menu container is visible in the DOM; assert the first interactive option within the menu has focus (`document.activeElement` check or `toHaveAttribute('tabindex', '0')`)
- **Wait strategy:** Use `await expect(styleMenuLocator).toBeVisible()` after pressing the shortcut — do not use `waitForTimeout`
