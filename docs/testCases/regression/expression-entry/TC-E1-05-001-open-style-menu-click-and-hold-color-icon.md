# TC-E1-05-001: Click and hold the Color Icon to open the Style menu for an expression

**Summary:** TC-E1-05-001 [Expression Entry] [regression] — Verify that clicking and holding the Color Icon for an expression opens the Style menu and presents options for colour and size.

**Priority:** 3 — Required entry point for all expression styling; without this the style menu is inaccessible via mouse.

**Related:** docs/userstory/E1_ExpressionEntry-GraphiRendering.md, TC-E1-05-002, TC-E1-05-003

## Preconditions

- The Desmos Graphing Calculator is open at https://www.desmos.com/calculator
- The expression list contains at least one expression with a graphed function (e.g., `y=x^2`)

## Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Locate the Color Icon (coloured dot) on the left side of the expression line | The Color Icon is visible |
| 2 | Click and hold the Color Icon (press and hold the mouse button without releasing) | The Style menu opens as an overlay or popover |
| 3 | Observe the options presented in the Style menu | Options for colour and line size are displayed |

## Notes for Automation

- **Selector:** `.dcg-expression-icon` for the Color Icon; inspect the live DOM for the Style menu container selector
- **Input method:** Use `page.locator('.dcg-expression-icon').dispatchEvent('mousedown')` and hold — alternatively use `page.mouse.down()` after hovering; verify the exact interaction in the live app
- **Assertion strategy:** Assert the Style menu container becomes visible in the DOM after the click-and-hold gesture
- **Wait strategy:** Use `await expect(styleMenuLocator).toBeVisible()` after triggering the gesture — do not use `waitForTimeout`
