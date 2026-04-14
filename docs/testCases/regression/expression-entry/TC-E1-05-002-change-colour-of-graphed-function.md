# TC-E1-05-002: Select a new colour in the Style menu and verify the graph curve updates

**Summary:** TC-E1-05-002 [Expression Entry] [regression] — Verify that selecting a different colour in the Style menu redraws the graph curve in the chosen colour and updates the Color Icon to reflect the new selection.

**Priority:** 3 — Core styling feature; used frequently when working with multiple expressions to distinguish curves.

**Related:** docs/userstory/E1_ExpressionEntry-GraphiRendering.md, TC-E1-05-001

## Preconditions

- The Desmos Graphing Calculator is open at https://www.desmos.com/calculator
- The expression list contains `y=x^2` with a graphed parabola
- The Style menu is open for the `y=x^2` expression line

## Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | In the Style menu, locate and click a different colour option (e.g., red) | The colour option is selected |
| 2 | Observe the graph canvas | The parabola curve is redrawn in the newly selected colour (red) |
| 3 | Observe the Color Icon for the expression line | The Color Icon now reflects the newly selected colour (red) |

## Notes for Automation

- **Selector:** Inspect the live DOM for colour option selectors within the Style menu; `.dcg-expression-icon` for the Color Icon after selection
- **Input method:** Click the colour swatch element within the Style menu — verify exact selector in the live app before automating
- **Assertion strategy:** Assert the Color Icon has a style or class reflecting the new colour; canvas pixel assertion is not used — the Color Icon state is the proxy for the colour change
- **Wait strategy:** Use `await expect(page.locator('.dcg-expression-icon')).toHaveAttribute(...)` or check CSS after clicking the colour — do not use `waitForTimeout`
