# TC-E2-01-002: Open Graph Settings using the Ctrl+Alt+G keyboard shortcut

**Summary:** TC-E2-01-002 [Graph Settings] [regression] — Verify that pressing Ctrl+Alt+G opens the Graph Settings panel without requiring a mouse click.

**Priority:** 3 — Keyboard access path; important for power users and accessibility.

**Related:** docs/userstory/E2_GraphSettings-ViewportContol.md, TC-E2-01-001, TC-E2-01-004

## Preconditions

- The Desmos Graphing Calculator is open at https://www.desmos.com/calculator
- The Graph Settings panel is closed
- Focus is anywhere on the page (no modal or overlay open)

## Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Press `Ctrl+Alt+G` | The Graph Settings panel opens |
| 2 | Observe the settings panel | Domain, range, angle unit, and Complex Mode controls are visible |

## Notes for Automation

- **Input method:** `await page.keyboard.press('Control+Alt+g')` — shortcut unverified; confirm against live app before committing
- **Assertion strategy:** Assert the settings panel container `toBeVisible()` after key press
- **Wait strategy:** `await expect(panel).toBeVisible()` with default timeout — no manual wait needed
