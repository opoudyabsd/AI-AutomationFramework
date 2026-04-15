# TC-E2-03-005: Pan the graph viewport by clicking and dragging the canvas

**Summary:** TC-E2-03-005 [Graph Settings] [regression] — Verify that clicking and dragging on the graph canvas pans the viewport, shifting the visible area of the graph.

**Priority:** 3 — Core navigation; panning is the primary way users explore graph regions outside the current view.

**Related:** docs/userstory/E2_GraphSettings-ViewportContol.md, TC-E2-03-001, TC-E2-03-003, TC-E2-E2E-003

## Preconditions

- The Desmos Graphing Calculator is open at https://www.desmos.com/calculator
- Default viewport is active
- An expression (e.g. `y=x^2`) is graphed so panning movement is visually obvious

## Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Type `y=x^2` in the expression list | A parabola is rendered centred at the origin |
| 2 | Note the axis label values (default x ∈ [−10, 10]) | Labels confirm default state |
| 3 | Press and hold the mouse button at the canvas centre | No graph change yet; drag is initiated |
| 4 | Drag the mouse 100 px to the right while holding the button | The viewport pans left — the curve shifts right relative to the canvas |
| 5 | Release the mouse button | Panning stops; the new viewport is maintained |
| 6 | Observe the x-axis minimum label | The minimum x value has decreased (e.g. from −10 to approximately −12) indicating the viewport shifted left |

## Notes for Automation

- **Input method:** `await page.mouse.move(cx, cy)`, `await page.mouse.down()`, `await page.mouse.move(cx + 100, cy, { steps: 10 })`, `await page.mouse.up()` — use steps to generate a sequence of mousemove events
- **Assertion strategy:** Read axis label text before and after drag; assert the x-minimum value decreased (viewport shifted left when dragged right)
- **Known challenge:** The canvas area has an overlay div that intercepts pointer events — use `page.mouse.*` raw methods, not `locator.drag()`
