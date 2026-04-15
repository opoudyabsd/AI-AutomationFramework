# TC-E2-02-003: Entering equal min and max values displays a validation error

**Summary:** TC-E2-02-003 [Graph Settings] [regression] — Verify that setting x-axis minimum and maximum to the same value triggers a validation error and does not update the viewport.

**Priority:** 3 — Edge case; a zero-width domain would produce an undefined or collapsed viewport.

**Related:** docs/userstory/E2_GraphSettings-ViewportContol.md, TC-E2-02-004, TC-E2-02-005

## Preconditions

- The Desmos Graphing Calculator is open at https://www.desmos.com/calculator
- The Graph Settings panel is open
- The viewport is in the default state (x ∈ [−10, 10])

## Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Set the x-axis minimum field to `5` | The field displays 5 |
| 2 | Set the x-axis maximum field to `5` | The field displays 5 |
| 3 | Observe the settings panel | An inline error or warning appears indicating that min and max must differ |
| 4 | Observe the graph canvas (without closing the panel) | The graph viewport has not changed; x-axis still shows the previous range |

## Notes for Automation

- **Assertion strategy:** Assert that an error element becomes visible within the settings panel (look for `role="alert"`, `role="note"`, or a visible error text node — verify in live DOM)
- **Assertion for no-change:** Capture viewport axis label text before entering equal values; assert it is unchanged after
- **Wait strategy:** Validation may fire on blur or on change — `await mathInputField.press('Tab')` after entering value to trigger blur before asserting
