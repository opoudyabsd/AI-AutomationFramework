# TC-E2-E2E-002: Graph a trig function, switch angle unit, verify period change, then switch back

**Summary:** TC-E2-E2E-002 [Graph Settings] [e2e] — Full round-trip workflow: graph `sin(x)`, verify the default radian period, switch to degrees, verify the period changes to 360, then switch back to radians and verify the period reverts. Tests angle unit setting persistence and its effect on a live graphed curve.

**Priority:** 3 — E2E coverage of the angle unit toggle and its live effect on the graph renderer.

**Related:** docs/userstory/E2_GraphSettings-ViewportContol.md, TC-E2-04-001, TC-E2-04-002

## Preconditions

- The Desmos Graphing Calculator is open at https://www.desmos.com/calculator
- Angle unit is Radians (default)
- Expression list is empty

## Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Type `y=sin(x)` in the first expression line | Sine wave is rendered; no error shown |
| 2 | Hover near x = 1.57 on the graph canvas | Trace tooltip appears showing y ≈ 1 (confirming radian period: first peak near π/2 ≈ 1.57) |
| 3 | Open Graph Settings | Panel opens; angle unit is Radians |
| 4 | Switch angle unit to Degrees | Degrees option is selected |
| 5 | Close Graph Settings | Panel closes |
| 6 | Observe the graph canvas — the sine curve period has changed | The first peak has shifted far to the right (near x = 90) since the period is now 360 |
| 7 | Hover near x = 90 on the graph canvas | Trace tooltip shows y ≈ 1 (confirming the peak is now at 90°) |
| 8 | Open Graph Settings | Panel opens; Degrees is selected |
| 9 | Switch angle unit back to Radians | Radians option is selected |
| 10 | Close Graph Settings | Panel closes |
| 11 | Hover near x = 1.57 on the graph canvas | Trace tooltip shows y ≈ 1 again (period reverted to 2π) |

## Notes for Automation

- **Hover input:** Use `page.mouse.move()` with the graph coordinate converter (same pattern as `hoverGraphAtGraphCoord` in `CalculatorPage.ts`) to hover at graph unit positions
- **Assertion strategy:**
  - Steps 2, 7, 11: assert `traceCoordinates` tooltip is visible and `toContainText` the expected y value
  - All expression steps: assert `expressionError` is not visible
- **Data note:** x = 90 in graph units corresponds to a canvas pixel that must be calculated from the canvas bounding box at runtime — use the same `graphCoordToCanvasPixel` helper used for intercept tests
- **Known challenge:** After switching to degrees the default viewport (x ∈ [−10, 10]) does not reach x = 90, so the step-6 period verification relies on the absence of a visible peak within [−10, 10] as an indirect proxy, unless the viewport is also widened
