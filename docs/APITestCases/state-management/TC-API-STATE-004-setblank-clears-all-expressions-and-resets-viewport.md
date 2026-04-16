# TC-API-STATE-004: setBlank clears all expressions and resets viewport

**Summary:** Verifies that `setBlank()` removes expression content and returns the calculator to a blank graph state.

**Priority:** 4 - Core reset behavior used by embedding flows and authoring tools.

**Source:** docs/desmosAPI/Desmos-api-v1.11.md - GraphingCalculator.setBlank([options])

**Related:** TC-API-STATE-005

## Preconditions

- GraphingCalculator instance is initialized.
- The calculator contains multiple expressions and a non-default viewport.

## Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Add multiple expressions and move the viewport away from its default bounds. | Calculator is in a non-blank state. |
| 2 | Confirm `getExpressions()` returns a non-empty array. | Baseline content exists. |
| 3 | Call `setBlank()`. | Reset completes without error. |
| 4 | Call `getExpressions()` again. | User-created expressions are no longer present. |
| 5 | Read `graphpaperBounds.mathCoordinates`. | Viewport returns to the default blank-state bounds. |

## Notes for Automation

- **API surface:** `setBlank`, `getExpressions`, `graphpaperBounds`.
- **Setup strategy:** Seed several expressions, then shift the viewport before invoking `setBlank()`.
- **Assertion strategy:** Compare expression count and viewport values before and after reset.
- **Data considerations:** Treat any internal system expressions carefully and focus assertions on user-created entries.
- **Cleanup:** Destroy the calculator after the test.