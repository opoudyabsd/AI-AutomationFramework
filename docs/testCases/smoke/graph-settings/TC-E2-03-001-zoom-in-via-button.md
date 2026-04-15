# TC-E2-03-001: Zoom in on the graph using the Zoom In button

**Summary:** TC-E2-03-001 [Graph Settings] [smoke] — Verify that clicking the Zoom In toolbar button decreases the visible axis range, making the graph appear zoomed in.

**Priority:** 5 — Viewport navigation is a fundamental interaction; failure blocks all zoom-dependent test scenarios.

**Related:** docs/userstory/E2_GraphSettings-ViewportContol.md, TC-E2-03-002, TC-E2-03-003

## Preconditions

- The Desmos Graphing Calculator is open at https://www.desmos.com/calculator
- The calculator is in the default view (x ∈ [−10, 10])

## Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Observe the axis scale labels on the graph canvas before zooming | Default scale is visible (e.g. x-axis shows −10 to 10) |
| 2 | Click the Zoom In button (`[aria-label="Zoom In"]`) | The visible axis range narrows (e.g. x-axis now shows a smaller range such as −5 to 5) |
| 3 | Observe the graph canvas | The grid lines are spaced further apart, indicating the view has zoomed in |

## Notes for Automation

- **Selector:** `[aria-label="Zoom In"]` — stable aria-label confirmed in projectContext.md
- **Assertion strategy:** Canvas pixel assertions are not possible. Use DOM proxy: read axis label text nodes before and after click and assert the value decreased. Alternatively use screenshot comparison with tolerance.
- **Wait strategy:** `await expect(zoomInButton).toBeEnabled()` before click; assert axis label change or use `page.waitForFunction` to detect scale change in DOM
- **Known challenge:** Axis label values are rendered inside canvas or DOM text nodes whose selector must be verified against live DOM
