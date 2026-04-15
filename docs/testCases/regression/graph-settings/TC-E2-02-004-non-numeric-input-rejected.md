# TC-E2-02-004: Non-numeric value in a domain field is rejected or reverted

**Summary:** TC-E2-02-004 [Graph Settings] [regression] — Verify that typing a non-numeric string (e.g. `abc`) into the x-axis minimum field either shows a validation error or reverts the field to its previous valid value, and does not update the viewport.

**Priority:** 3 — Input validation; ensures corrupted domain values cannot reach the renderer.

**Related:** docs/userstory/E2_GraphSettings-ViewportContol.md, TC-E2-02-003, TC-E2-02-005

## Preconditions

- The Desmos Graphing Calculator is open at https://www.desmos.com/calculator
- The Graph Settings panel is open

## Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Note the current x-axis minimum value | The field shows a valid numeric value (e.g. −10) |
| 2 | Clear the x-axis minimum field and type `abc` | Characters may be accepted or filtered as typed |
| 3 | Press `Tab` to move focus away from the field (trigger blur) | The field either reverts to the previous numeric value, shows an empty state, or displays an inline error |
| 4 | Observe the graph canvas | The viewport has not changed; x-axis range is unchanged |

## Notes for Automation

- **Input method:** `page.keyboard.type('abc')` after clicking and clearing the field
- **Assertion strategy:** After `Tab`, assert field value is either the previous numeric value (revert) or an inline error is visible — do not assert a specific behaviour, check which one Desmos implements in the live app first
- **Assertion for no-change:** Capture axis label text before and after; assert they are equal
