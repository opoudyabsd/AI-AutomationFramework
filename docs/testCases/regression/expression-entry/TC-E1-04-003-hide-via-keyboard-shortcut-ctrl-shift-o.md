# TC-E1-04-003: Use Ctrl+Shift+O then Enter to hide a graphed item via keyboard

**Summary:** TC-E1-04-003 [Expression Entry] [regression] — Verify that pressing `Ctrl+Shift+O` followed by `Enter` while an expression line is focused hides the corresponding curve from the graph canvas.

**Priority:** 3 — Keyboard accessibility path for hiding expressions; important for users who navigate without a mouse.

__Related:__ docs/userstory/E1_ExpressionEntry-GraphiRendering.md, TC-E1-04-001, TC-E1-04-004

## Preconditions

- The Desmos Graphing Calculator is open at https://www.desmos.com/calculator
- The expression list contains `y=x^2` and a parabola is visible on the graph canvas
- The expression line `y=x^2` is focused

## Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click on the `y=x^2` expression line to focus it | The expression input field is focused |
| 2 | Press `Ctrl+Shift+O` on the keyboard | The Style menu or a toggle control opens for that expression line |
| 3 | Press `Enter` to confirm the hide action | The parabola is hidden from the graph canvas |
| 4 | Observe the Color Icon or expression row state | The Color Icon or expression row reflects the hidden state |

## Notes for Automation

- **Selector:** `.dcg-mq-editable-field` for expression focus; the expression toggle button accessible name changes between `Hide Expression N` and `Show Expression N`
- **Input method:** Focus the expression row, then `await page.keyboard.press('Control+Shift+O')` followed by `await page.keyboard.press('Enter')` — verify this key combination opens the correct control in the live app
- **Assertion strategy:** Assert the toggle button accessible name changes to `Show Expression N` after the key sequence; Desmos does not expose a stable hidden-state CSS class for the visual icon
- **Wait strategy:** Use `await expect(expressionToggleButton).toHaveAccessibleName(/Show Expression/)` after the key sequence — do not use `waitForTimeout`
