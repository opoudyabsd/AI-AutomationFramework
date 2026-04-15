# TC-E2-02-005: Setting x-axis min greater than max displays an inline error

**Summary:** TC-E2-02-005 [Graph Settings] [regression] — Verify that entering an x-axis minimum value greater than the maximum triggers an inline validation error and leaves the viewport unchanged.

**Priority:** 3 — Edge case; a reversed domain would invert the axis and produce confusing output.

**Related:** docs/userstory/E2_GraphSettings-ViewportContol.md, TC-E2-02-003, TC-E2-02-004

## Preconditions

- The Desmos Graphing Calculator is open at https://www.desmos.com/calculator
- The Graph Settings panel is open
- Default viewport is active (x ∈ [−10, 10])

## Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Set the x-axis minimum field to `10` | The field displays 10 |
| 2 | Set the x-axis maximum field to `-10` | The field displays −10 |
| 3 | Press `Tab` or click another field to trigger validation | An inline error is displayed indicating that minimum must be less than maximum |
| 4 | Observe the graph canvas | The viewport has not changed; x-axis still shows the original range |

## Notes for Automation

- **Assertion strategy:** Assert an error element is visible (role="alert" or equivalent inline error node); verify exact selector in live DOM
- **Assertion for no-change:** Read axis label text before step 1 and after step 3; assert equality
- **Wait strategy:** Trigger blur between each field entry (`Tab` press) to ensure Desmos validates incrementally if needed
