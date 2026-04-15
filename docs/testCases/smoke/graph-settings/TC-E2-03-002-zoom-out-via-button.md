# TC-E2-03-002: Zoom out on the graph using the Zoom Out button

**Summary:** TC-E2-03-002 [Graph Settings] [smoke] — Verify that clicking the Zoom Out toolbar button increases the visible axis range, making the graph appear zoomed out.

**Priority:** 5 — Core viewport control; symmetrical with Zoom In.

**Related:** docs/userstory/E2_GraphSettings-ViewportContol.md, TC-E2-03-001, TC-E2-03-003

## Preconditions

- The Desmos Graphing Calculator is open at https://www.desmos.com/calculator
- The calculator is in the default view (x ∈ [−10, 10])

## Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Observe the axis scale labels on the graph canvas before zooming | Default scale is visible (x-axis shows −10 to 10) |
| 2 | Click the Zoom Out button (`[aria-label="Zoom Out"]`) | The visible axis range widens (e.g. x-axis now shows a larger range such as −20 to 20) |
| 3 | Observe the graph canvas | The grid lines are spaced closer together, indicating the view has zoomed out |

## Notes for Automation

- **Selector:** `[aria-label="Zoom Out"]` — stable aria-label confirmed in projectContext.md
- **Assertion strategy:** Same DOM-proxy approach as TC-E2-03-001 — read axis label text values before and after and assert they increased; or screenshot comparison
- **Wait strategy:** `await expect(zoomOutButton).toBeEnabled()` before click
