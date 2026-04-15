# TC-E2-03-003: Reset the graph viewport to the default view

**Summary:** TC-E2-03-003 [Graph Settings] [smoke] — Verify that clicking the Reset to Default View button restores the graph canvas to the standard x ∈ [−10, 10] viewport after it has been zoomed or panned.

**Priority:** 4 — Recovery action; users rely on this to return to a known state after exploration.

**Related:** docs/userstory/E2_GraphSettings-ViewportContol.md, TC-E2-03-001, TC-E2-03-002, TC-E2-E2E-003

## Preconditions

- The Desmos Graphing Calculator is open at https://www.desmos.com/calculator
- The viewport has been zoomed in (click Zoom In at least twice to establish a non-default state)

## Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click the Zoom In button twice to move away from the default view | The axis range decreases |
| 2 | Click the Reset to Default View button (`[aria-label="Reset to Default View"]`) | The graph canvas returns to the default x ∈ [−10, 10] view |
| 3 | Observe the axis scale labels | Labels reflect the default scale (−10 to 10 on x-axis) |

## Notes for Automation

- **Selector:** `[aria-label="Reset to Default View"]` — stable aria-label confirmed in projectContext.md
- **Assertion strategy:** Read axis label DOM text nodes after reset and assert they match default values; or compare screenshot to a known-default baseline
- **Wait strategy:** `await expect(resetButton).toBeVisible()` then click; assert axis labels synchronously update
