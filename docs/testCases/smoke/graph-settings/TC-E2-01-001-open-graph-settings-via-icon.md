# TC-E2-01-001: Open Graph Settings menu by clicking the settings icon

**Summary:** TC-E2-01-001 [Graph Settings] [smoke] — Verify that clicking the Graph Settings icon opens the settings panel and exposes core controls for domain, range, grid, angle unit, and Complex Mode.

**Priority:** 5 — Core entry point for all graph configuration; if the panel does not open, all downstream settings tests are blocked.

**Related:** docs/userstory/E2_GraphSettings-ViewportContol.md, TC-E2-01-002, TC-E2-02-001

## Preconditions

- The Desmos Graphing Calculator is open at https://www.desmos.com/calculator
- The calculator is in a fresh state with no expressions entered

## Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Locate the Graph Settings icon in the toolbar (wrench/gear icon) | The icon is visible and has an accessible label (e.g. `aria-label="Graph Settings"`) |
| 2 | Click the Graph Settings icon | The Graph Settings panel opens |
| 3 | Observe the settings panel | Fields for x-axis min/max, y-axis min/max, angle unit (Radians / Degrees), and Complex Mode toggle are visible |
| 4 | Observe the graph canvas while the panel is open | The graph canvas remains visible behind the panel |

## Notes for Automation

- **Selector:** `[aria-label="Graph Settings"]` for the toolbar button — verify exact label against live DOM before committing
- **Panel selector:** inspect for a dialog or container element that becomes visible on click; no stable `.dcg-*` class is confirmed — use role-based selector (e.g. `getByRole('dialog')` or `getByRole('region')`)
- **Assertion strategy:** assert the panel container `toBeVisible()`; assert at least one labelled input (e.g. x-axis minimum) `toBeVisible()` as a proxy for full panel render
- **Wait strategy:** `await expect(panel).toBeVisible()` — panel opens synchronously on click; no additional wait needed
