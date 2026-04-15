# TC-E2-02-002: Set a custom y-axis range and verify the viewport updates

**Summary:** TC-E2-02-002 [Graph Settings] [regression] — Verify that entering custom y-axis minimum and maximum values in Graph Settings updates the visible graph range accordingly.

**Priority:** 3 — Symmetrical with x-axis domain control; important for focused analysis of specific y-value ranges.

**Related:** docs/userstory/E2_GraphSettings-ViewportContol.md, TC-E2-02-001, TC-E2-E2E-001

## Preconditions

- The Desmos Graphing Calculator is open at https://www.desmos.com/calculator
- The Graph Settings panel is open
- The viewport is in the default state

## Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Locate the y-axis minimum input field in the Graph Settings panel | The field is visible and shows the current value |
| 2 | Clear the field and type `-2` | The field displays −2 |
| 3 | Locate the y-axis maximum input field | The field is visible |
| 4 | Clear the field and type `2` | The field displays 2 |
| 5 | Close the Graph Settings panel | The panel closes |
| 6 | Observe the y-axis scale labels on the graph canvas | The bottommost y-axis label shows −2 and the topmost shows 2 |

## Notes for Automation

- **Selector:** `getByLabel('y minimum')` and `getByLabel('y maximum')` — verify label text against live DOM
- **Input method:** Click field, select-all, then `page.keyboard.type()` — do not use `fill()`
- **Assertion strategy:** Assert y-axis label DOM text nodes match entered values after settings close; or screenshot comparison
