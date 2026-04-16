# TC-E1-03-004: Press Enter to add a new expression line and verify the screen reader announces it

**Summary:** TC-E1-03-004 [Expression Entry] [regression] — Verify that pressing Enter to add a new expression line triggers a screen reader announcement confirming the addition and places focus on the new line.

**Priority:** 3 — Accessibility requirement; ensures keyboard-only and assistive technology users are informed of state changes.

__Related:__ docs/userstory/E1_ExpressionEntry-GraphiRendering.md, TC-E1-03-001

## Preconditions

- The Desmos Graphing Calculator is open at https://www.desmos.com/calculator
- The calculator is in a fresh state with no expressions entered
- The first expression line is focused

## Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click on the first expression line to place focus in it | The expression input field is focused |
| 2 | Press the `Enter` key | A new blank expression line is added below the current one |
| 3 | Observe the ARIA live region or screen reader output | The screen reader announces that a new expression line has been added |
| 4 | Observe the keyboard focus | Focus is placed on the new blank expression line |

## Notes for Automation

- **Selector:** `.dcg-expressionitem` for expression rows; the new MathQuill textbox remains screen-reader accessible via its labelled hidden textarea
- **Input method:** `await page.keyboard.press('Enter')` while focus is on `.dcg-mq-editable-field`
- **Assertion strategy:** Assert `.dcg-expressionitem` count increased by 1, the new textbox has an accessible name like `Expression N:`, and keyboard focus moves to that new textbox; use these as the stable automation proxy when no persistent live announcement text is exposed
- **Wait strategy:** Use `await expect(expressionItems).toHaveCount(...)` and `await expect(newItem.getByRole('textbox')).toBeFocused()` — avoid `waitForTimeout`
