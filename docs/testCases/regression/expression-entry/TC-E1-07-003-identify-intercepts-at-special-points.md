# TC-E1-07-003: Click near x-axis intercepts of a curve and verify exact intercept coordinates are displayed

**Summary:** TC-E1-07-003 [Expression Entry] [regression] — Verify that clicking near the x-axis intercepts of a graphed curve displays a tooltip with the exact intercept coordinates (e.g., (2, 0) and (-2, 0) for `y=x²-4`).

**Priority:** 3 — Important edge case for Points of Interest; students use intercepts to solve equations graphically.

**Related:** docs/userstory/E1_ExpressionEntry-GraphiRendering.md, TC-E1-07-001

## Preconditions

- The Desmos Graphing Calculator is open at https://www.desmos.com/calculator
- The expression `y=x^2-4` is entered and a parabola is rendered on the graph canvas with two visible x-axis intercepts at `(2, 0)` and `(-2, 0)`

## Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Move the mouse cursor near the right x-axis intercept of the parabola (approximately where `x=2`) | The cursor snaps to or highlights the intercept point |
| 2 | Click on the right x-axis intercept | A tooltip appears displaying the coordinates `(2, 0)` |
| 3 | Move the mouse cursor near the left x-axis intercept (approximately where `x=-2`) | The cursor snaps to or highlights the left intercept point |
| 4 | Click on the left x-axis intercept | A tooltip appears displaying the coordinates `(-2, 0)` |

## Notes for Automation

- **Selector:** `.dcg-graph-outer canvas` for the graph canvas; inspect the live DOM for the Points of Interest label elements that appear after clicking intercepts
- **Input method:** Use `page.locator('.dcg-graph-outer canvas').click({ position: { x: ..., y: ... } })` with canvas coordinates mapped to the intercept positions — requires calculating pixel positions from graph scale; alternatively check if POI labels appear in the SVG layer
- **Assertion strategy:** Assert that a Points of Interest label element appears in the DOM containing the text `(2, 0)` and `(-2, 0)` — do NOT assert canvas pixel content; POI labels are rendered as DOM/SVG elements
- **Wait strategy:** Use `await expect(poiLabelLocator).toBeVisible()` and `await expect(poiLabelLocator).toContainText('2, 0')` after each click — do not use `waitForTimeout`
