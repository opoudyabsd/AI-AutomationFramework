# TC-E2-04-002: Switch angle unit from degrees back to radians and verify sine curve period reverts

**Summary:** TC-E2-04-002 [Graph Settings] [regression] — Verify that switching the angle unit back to radians after it was set to degrees restores the sine curve to a period of 2π.

**Priority:** 3 — Ensures the setting is reversible without page reload.

**Related:** docs/userstory/E2_GraphSettings-ViewportContol.md, TC-E2-04-001, TC-E2-E2E-002

## Preconditions

- The Desmos Graphing Calculator is open at https://www.desmos.com/calculator
- The expression `y=sin(x)` is entered and graphed
- Angle unit is currently set to Degrees (set as part of this test, step 1)

## Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open Graph Settings and switch angle unit to Degrees | Sine curve reflects period of 360 |
| 2 | Open Graph Settings again | Panel opens; Degrees is selected |
| 3 | Select Radians | The Radians control is activated |
| 4 | Close the Graph Settings panel | The panel closes |
| 5 | Observe the graph canvas | The sine wave reverts to period 2π; first peak is near x ≈ 1.57 |

## Notes for Automation

- **Selector:** `getByRole('radio', { name: 'Radians' })` or equivalent — verify in live DOM
- **Assertion strategy:** Same proxy as TC-E2-04-001 in reverse — hover near x = 1.57 and assert trace tooltip shows y ≈ 1; or assert no error and expression item is visible
