# TC-E2-03-004: Zoom the graph using the mouse scroll wheel

**Summary:** TC-E2-03-004 [Graph Settings] [regression] — Verify that scrolling up over the graph canvas zooms in and scrolling down zooms out, matching the button-based zoom behaviour.

**Priority:** 3 — Alternative zoom input; common user interaction pattern on desktop.

**Related:** docs/userstory/E2_GraphSettings-ViewportContol.md, TC-E2-03-001, TC-E2-03-002, TC-E2-03-003

## Preconditions

- The Desmos Graphing Calculator is open at https://www.desmos.com/calculator
- Default viewport is active (x ∈ [−10, 10])
- Mouse pointer is over the graph canvas

## Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Move the mouse to the centre of the graph canvas | Cursor is over the canvas area |
| 2 | Scroll the mouse wheel upward (3 ticks) | The visible axis range narrows — the graph appears zoomed in centred on the cursor position |
| 3 | Observe the axis scale | Scale labels reflect a smaller range than the default |
| 4 | Scroll the mouse wheel downward (3 ticks) | The visible axis range widens — the graph zooms back out |
| 5 | Observe the axis scale | Scale labels reflect a larger range |

## Notes for Automation

- **Input method:** `await page.mouse.move(cx, cy)` to the canvas centre, then `await page.mouse.wheel(0, -300)` (negative deltaY = scroll up = zoom in); verify scroll direction convention against live app
- **Assertion strategy:** Capture axis label text before and after scroll; assert the numeric range changed in the expected direction
- **Known challenge:** `page.mouse.wheel()` dispatches a native wheel event; Desmos must have its wheel handler registered on the canvas element — verify this works before automating
