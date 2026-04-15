# TC-E2-02-001: Set a custom x-axis domain and verify the viewport updates

**Summary:** TC-E2-02-001 [Graph Settings] [regression] — Verify that entering custom x-axis minimum and maximum values in Graph Settings updates the visible graph domain accordingly.

**Priority:** 4 — Core settings flow; domain control is the primary reason users open Graph Settings.

**Related:** docs/userstory/E2_GraphSettings-ViewportContol.md, TC-E2-02-002, TC-E2-E2E-001

## Preconditions

- The Desmos Graphing Calculator is open at https://www.desmos.com/calculator
- The Graph Settings panel is open
- The viewport is in the default state (x ∈ [−10, 10])

## Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Locate the x-axis minimum input field in the Graph Settings panel | The field is visible and shows the current value (e.g. −10) |
| 2 | Clear the x-axis minimum field and type `-5` | The field displays −5 |
| 3 | Locate the x-axis maximum input field | The field is visible and shows the current value (e.g. 10) |
| 4 | Clear the x-axis maximum field and type `5` | The field displays 5 |
| 5 | Close the Graph Settings panel (click outside or press Escape) | The panel closes |
| 6 | Observe the x-axis scale labels on the graph canvas | The leftmost x-axis label shows −5 and the rightmost shows 5 |

## Notes for Automation

- **Selector:** Input fields are likely accessible via `getByLabel('x minimum')` or similar — verify exact label text against live DOM
- **Input method:** Click the field, `Ctrl+A` to select all existing content, then `page.keyboard.type('-5')` — use keyboard input, not `fill()`, as Desmos inputs may be custom
- **Assertion strategy:** Read axis label DOM text nodes after closing settings and assert they match the entered values; or compare the URL query parameter if Desmos encodes viewport in the URL
- **Wait strategy:** `await expect(panel).not.toBeVisible()` after close, then assert axis labels
