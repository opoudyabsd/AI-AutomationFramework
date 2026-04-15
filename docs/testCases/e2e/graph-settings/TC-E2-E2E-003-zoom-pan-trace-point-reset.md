# TC-E2-E2E-003: Zoom in, pan to a specific region, trace a point of interest, then reset the viewport

**Summary:** TC-E2-E2E-003 [Graph Settings] [e2e] — Full viewport interaction workflow: graph `y=x^2-4`, zoom in, pan to the right intercept region, click the intercept to pin the trace tooltip, verify the coordinates, then reset the view and confirm the default viewport is restored. Tests the interaction between zoom, pan, trace, and reset.

**Priority:** 3 — Cross-feature E2E; exercises four viewport controls in a realistic user workflow.

**Related:** docs/userstory/E2_GraphSettings-ViewportContol.md, TC-E2-03-001, TC-E2-03-003, TC-E2-03-005, TC-E1-07-003

## Preconditions

- The Desmos Graphing Calculator is open at https://www.desmos.com/calculator
- Default viewport is active

## Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Type `y=x^2-4` in the first expression line | A parabola intersecting the x-axis at (−2, 0) and (2, 0) is rendered |
| 2 | Click the Zoom In button three times | Viewport narrows; the graph is now zoomed in around the origin |
| 3 | Click and drag the canvas 50 px to the left | Viewport pans right; the right intercept region (x ≈ 2) is now more centred |
| 4 | Click on the graph canvas near (2, 0) — the right intercept | The trace point is pinned; a coordinate tooltip appears |
| 5 | Observe the coordinate tooltip | Tooltip shows exact coordinates (2, 0) |
| 6 | Click the Reset to Default View button (`[aria-label="Reset to Default View"]`) | The viewport resets to x ∈ [−10, 10] |
| 7 | Observe the axis labels | Labels confirm the default scale has been restored |
| 8 | Observe the expression item | No error; parabola is still graphed after reset |

## Notes for Automation

- **Input methods:**
  - Zoom: `zoomInButton.click()` three times
  - Pan: `page.mouse.down()` → `page.mouse.move(cx - 50, cy, { steps: 10 })` → `page.mouse.up()`
  - Click intercept: `page.mouse.move()` + `page.mouse.click()` at the (2, 0) canvas pixel — calculate pixel position from bounding box and post-zoom scale (canvas coordinate mapping changes after zoom; this requires dynamic bounding box re-read)
- **Assertion strategy:**
  - Step 5: `expect(traceCoordinates).toContainText('2, 0')`
  - Step 7: assert axis labels match default values
  - Step 8: assert `expressionError` is not visible
- **Known challenge:** After zoom and pan, the graph coordinate → canvas pixel mapping changes. The `graphCoordToCanvasPixel` helper assumes a ±10 default range. For this test, either use the Zoom In → Reset approach only (skip zoomed-state trace) or implement a dynamic scale reader from the DOM axis labels.
