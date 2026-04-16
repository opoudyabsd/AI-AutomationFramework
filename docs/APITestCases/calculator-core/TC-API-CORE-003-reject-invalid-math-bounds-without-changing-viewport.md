# TC-API-CORE-003: Reject invalid math bounds without changing viewport

**Summary:** Verifies that `setMathBounds()` ignores invalid bounds and keeps existing viewport unchanged.

**Priority:** 4 - Prevents silent viewport corruption when malformed bounds are passed.

**Source:** docs/desmosAPI/Desmos-api-v1.11.md - GraphingCalculator.setMathBounds(bounds); GraphingCalculator.graphpaperBounds

**Related:** None

## Preconditions

- GraphingCalculator instance is initialized and stable.
- Current valid bounds are known and recorded from `calculator.graphpaperBounds.mathCoordinates`.

## Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Capture initial `mathCoordinates` from `graphpaperBounds`. | Initial bounds snapshot is available for comparison. |
| 2 | Call `setMathBounds({ left: 5, right: 5, bottom: -10, top: 10 })`. | No crash; invalid bounds are rejected because `right <= left`. |
| 3 | Read `graphpaperBounds.mathCoordinates` again. | Bounds remain equal to initial snapshot. |
| 4 | Call `setMathBounds({ left: -10, right: 10, bottom: 3, top: 3 })`. | No crash; invalid bounds are rejected because `top <= bottom`. |
| 5 | Read `graphpaperBounds.mathCoordinates` once more. | Bounds still unchanged from initial snapshot. |

## Notes for Automation

- **API surface:** `setMathBounds`, `graphpaperBounds` observable.
- **Setup strategy:** Attach observer or polling read for `graphpaperBounds` and persist baseline values before negative inputs.
- **Assertion strategy:** Deep-compare `mathCoordinates` snapshots before and after invalid calls.
- **Data considerations:** Cover both invalid conditions documented: `right <= left` and `top <= bottom`.
- **Cleanup:** None beyond calculator destruction.