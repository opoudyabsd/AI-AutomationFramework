# TC-E1-04-002: Click the Color Icon again to show a previously hidden item

**Summary:** TC-E1-04-002 [Expression Entry] [regression] — Verify that clicking the Color Icon a second time on a hidden expression makes the corresponding curve visible again on the graph canvas.

**Priority:** 3 — Completes the hide/show toggle cycle; must work in both directions.

**Related:** docs/userstory/E1_ExpressionEntry-GraphiRendering.md, TC-E1-04-001

## Preconditions

- The Desmos Graphing Calculator is open at https://www.desmos.com/calculator
- The expression list contains `y=x^2`
- The expression `y=x^2` is currently hidden (its Color Icon reflects the hidden state)

## Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Locate the Color Icon for the hidden `y=x^2` expression line | The Color Icon is visible and reflects the hidden state |
| 2 | Click the Color Icon | The parabola becomes visible again on the graph canvas |
| 3 | Observe the Color Icon after clicking | The Color Icon reflects the visible state (returns to normal colour, no strikethrough) |

## Notes for Automation

- **Selector:** `.dcg-expression-icon` for the Color Icon; `.dcg-expressionitem` for the expression row
- **Input method:** `await page.locator('.dcg-expressionitem').first().locator('.dcg-expression-icon').click()`
- **Assertion strategy:** After clicking, assert the Color Icon no longer has the hidden-state CSS class; use icon state as proxy for graph visibility — no pixel assertion on canvas
- **Wait strategy:** Use `await expect(page.locator('.dcg-expression-icon')).not.toHaveClass(/hidden/)` after clicking — verify exact class names in the live DOM before implementing
