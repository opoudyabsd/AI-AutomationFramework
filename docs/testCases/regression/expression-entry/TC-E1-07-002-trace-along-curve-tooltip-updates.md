# TC-E1-07-002: Move the mouse along a curve and verify the coordinate tooltip updates continuously

**Summary:** TC-E1-07-002 [Expression Entry] [regression] — Verify that moving the mouse cursor along a graphed curve continuously updates the coordinate tooltip to reflect the current cursor position on the curve.

**Priority:** 3 — Important interactive exploration feature; used to read values at multiple points without clicking each one individually.

**Related:** docs/userstory/E1_ExpressionEntry-GraphiRendering.md, TC-E1-07-001

## Preconditions

- The Desmos Graphing Calculator is open at https://www.desmos.com/calculator
- The expression `y=sin(x)` is entered and a sine wave is rendered on the graph canvas

## Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Move the mouse cursor over the sine wave curve on the graph canvas | A coordinate tooltip appears near the cursor showing the x and y values |
| 2 | Slowly move the mouse cursor along the sine wave to a different position | The coordinate tooltip updates continuously to reflect the new cursor position on the curve |
| 3 | Observe the tooltip values at two distinct positions along the curve | The x and y values in the tooltip differ between the two positions, confirming live updates |

## Notes for Automation

- **Selector:** `.dcg-graph-outer canvas` for the graph canvas; inspect the live DOM for the tooltip element that appears during hover
- **Input method:** Use `page.mouse.move(x1, y1)` then `page.mouse.move(x2, y2)` with canvas-relative coordinates along the curve path — calculate positions from the graph viewport scale
- **Assertion strategy:** Capture the tooltip text at position 1, then move to position 2 and assert the tooltip text has changed — do NOT assert canvas pixel content
- **Wait strategy:** Use `await expect(tooltipLocator).toBeVisible()` after the first move; then compare text content between the two positions
