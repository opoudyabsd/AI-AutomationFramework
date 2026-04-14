# TC-E1-04-001: Click the Color Icon to hide a graphed item and verify it disappears from the graph

**Summary:** TC-E1-04-001 [Expression Entry] [regression] — Verify that clicking the Color Icon for an expression hides the corresponding curve from the graph canvas and the Color Icon reflects the hidden state.

**Priority:** 4 — Frequently used feature; allows users to toggle graph visibility without deleting expressions.

**Related:** docs/userstory/E1_ExpressionEntry-GraphiRendering.md, TC-E1-04-002, TC-E1-04-003

## Preconditions

- The Desmos Graphing Calculator is open at https://www.desmos.com/calculator
- The expression list contains `y=x^2` and a parabola is visible on the graph canvas

## Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Locate the Color Icon (coloured dot) on the left side of the `y=x^2` expression line | The Color Icon is visible and reflects the expression's current colour |
| 2 | Click the Color Icon | The parabola is hidden from the graph canvas |
| 3 | Observe the Color Icon after clicking | The Color Icon reflects the hidden state (e.g., appears greyed out or shows a strikethrough indicator) |

## Notes for Automation

- **Selector:** `.dcg-expression-icon` for the Color Icon / eye toggle; `.dcg-expressionitem` for the expression row
- **Input method:** `await page.locator('.dcg-expressionitem').first().locator('.dcg-expression-icon').click()`
- **Assertion strategy:** After clicking, assert the Color Icon has a CSS class or attribute indicating the hidden state; canvas cannot be pixel-asserted — use the icon state as the proxy for graph visibility change
- **Wait strategy:** Use `await expect(page.locator('.dcg-expression-icon')).toHaveClass(/hidden/)` or equivalent after clicking — inspect live DOM for the exact hidden-state class name before implementing
