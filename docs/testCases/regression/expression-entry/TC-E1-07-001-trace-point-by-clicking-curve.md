# TC-E1-07-001: Click a point on a graphed curve and verify the coordinate tooltip is displayed

**Summary:** TC-E1-07-001 [Expression Entry] [regression] — Verify that clicking on a point on a graphed curve displays a coordinate tooltip showing the exact x and y values at that point.

**Priority:** 4 — Core graph interaction feature; used by students and educators to read precise values from curves.

**Related:** docs/userstory/E1_ExpressionEntry-GraphiRendering.md, TC-E1-07-002, TC-E1-07-003

## Preconditions

- The Desmos Graphing Calculator is open at https://www.desmos.com/calculator
- The expression `y=x^2` is entered and a parabola is rendered on the graph canvas

## Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Move the mouse cursor over the graph canvas towards the rendered parabola | The cursor changes to indicate the curve is interactive |
| 2 | Click on a visible point on the parabola | A coordinate tooltip appears near the clicked point |
| 3 | Observe the tooltip content | The tooltip displays the x and y coordinate values at the clicked point |

## Notes for Automation

- **Selector:** `.dcg-graph-outer canvas` for the graph canvas; inspect the live DOM for the tooltip element (e.g., a label element that appears after clicking a curve point)
- **Input method:** Use `page.locator('.dcg-graph-outer canvas').click({ position: { x: ..., y: ... } })` with coordinates mapped to a point on the curve — calculate canvas coordinates from the graph's viewport scale
- **Assertion strategy:** Assert the tooltip/label element becomes visible in the DOM after the click; assert it contains numeric text in the format of coordinate values (e.g., `(1, 1)`) — do NOT assert canvas pixel content
- **Wait strategy:** Use `await expect(tooltipLocator).toBeVisible()` after clicking — do not use `waitForTimeout`
