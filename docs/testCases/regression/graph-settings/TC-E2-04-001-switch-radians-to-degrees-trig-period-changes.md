# TC-E2-04-001: Switch angle unit from radians to degrees and verify the sine curve period changes

**Summary:** TC-E2-04-001 [Graph Settings] [regression] — Verify that switching the angle unit to degrees causes a graphed `sin(x)` curve to reflect a period of 360 instead of 2π.

**Priority:** 3 — Important setting for educational contexts where degrees are the expected unit.

**Related:** docs/userstory/E2_GraphSettings-ViewportContol.md, TC-E2-04-002, TC-E2-04-003, TC-E2-E2E-002

## Preconditions

- The Desmos Graphing Calculator is open at https://www.desmos.com/calculator
- The expression `y=sin(x)` is entered and graphed
- Angle unit is set to Radians (default)

## Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Type `y=sin(x)` in the expression list | A sine wave is rendered with period 2π (≈ 6.28); a peak is visible near x = 1.57 |
| 2 | Open the Graph Settings panel | The panel opens showing angle unit set to Radians |
| 3 | Select the Degrees option for the angle unit | The Degrees control is activated |
| 4 | Close the Graph Settings panel | The panel closes |
| 5 | Observe the graph canvas | The sine wave now has a period of 360; the first peak is near x = 90 instead of x ≈ 1.57 |

## Notes for Automation

- **Selector:** Angle unit control is likely a pair of radio buttons or toggle buttons labelled "Radians" and "Degrees" — use `getByRole('radio', { name: 'Degrees' })` or `getByRole('button', { name: 'Degrees' })` — verify in live DOM
- **Assertion strategy:** Canvas pixel assertions are not possible. Use DOM proxy: after switching to degrees, hover near x = 90 on the canvas and assert the trace tooltip shows y ≈ 1 (confirming the peak moved to 90); or verify the absence of an error — the curve is still rendered without `.dcg-error`
- **Wait strategy:** After closing settings, `await expect(expressionItem).not.toContainText('error')` to confirm expression still renders
