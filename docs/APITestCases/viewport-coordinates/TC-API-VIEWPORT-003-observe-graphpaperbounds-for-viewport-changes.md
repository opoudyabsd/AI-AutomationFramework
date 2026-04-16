# TC-API-VIEWPORT-003: Observe graphpaperBounds for viewport changes

**Summary:** Verifies that `graphpaperBounds` observation callbacks fire when the viewport changes.

**Priority:** 4 - Important for integrations that synchronize external UI with calculator viewport state.

**Source:** docs/desmosAPI/Desmos-api-v1.11.md - GraphingCalculator.graphpaperBounds

**Related:** TC-API-VIEWPORT-001, TC-API-OBSERVE-001

## Preconditions

- GraphingCalculator instance is initialized.
- An observer is registered for `graphpaperBounds`.

## Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Register an observer on `graphpaperBounds`. | Observer registration succeeds. |
| 2 | Capture the initial callback count or baseline state. | Baseline is available for comparison. |
| 3 | Change the viewport through `setMathBounds()`. | Viewport changes successfully. |
| 4 | Inspect observer results. | Callback fires and captures updated graphpaper bounds. |
| 5 | Change the viewport again. | Observer fires again for the second update. |

## Notes for Automation

- **API surface:** `observe`, `graphpaperBounds`, `setMathBounds`.
- **Setup strategy:** Collect callback results in page context so the test can read them back deterministically.
- **Assertion strategy:** Verify callback count increased and the observed bounds match the new viewport.
- **Data considerations:** Use clearly different bounds in successive updates to avoid ambiguous equality checks.
- **Cleanup:** Unobserve and destroy the calculator after the test.