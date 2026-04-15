# TC-E2-01-003: Close the Graph Settings panel by pressing Escape

**Summary:** TC-E2-01-003 [Graph Settings] [regression] — Verify that pressing Escape while the Graph Settings panel is open closes it and returns keyboard focus to the graph area.

**Priority:** 3 — Standard modal dismissal pattern; expected by keyboard users.

**Related:** docs/userstory/E2_GraphSettings-ViewportContol.md, TC-E2-01-001, TC-E2-01-004

## Preconditions

- The Desmos Graphing Calculator is open at https://www.desmos.com/calculator
- The Graph Settings panel is open (opened via icon click or keyboard shortcut)

## Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Confirm the Graph Settings panel is visible | Panel container is visible and settings fields are accessible |
| 2 | Press `Escape` | The Graph Settings panel closes |
| 3 | Observe the page | The panel is no longer visible; keyboard focus returns to the main calculator area |

## Notes for Automation

- **Input method:** `await page.keyboard.press('Escape')`
- **Assertion strategy:** Assert panel `not.toBeVisible()` after Escape; assert focus moved back (e.g. expression list or toolbar button is focused)
- **Wait strategy:** `await expect(panel).not.toBeVisible()` — panel should close synchronously
