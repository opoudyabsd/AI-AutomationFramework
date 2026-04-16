# TC-API-VIEWPORT-001: Set viewport with setMathBounds

**Summary:** Verifies that `setMathBounds()` updates the graph viewport to the requested math-coordinate bounds.

**Priority:** 4 - Core viewport control needed for graph setup and automation stability.

**Source:** docs/desmosAPI/Desmos-api-v1.11.md - GraphingCalculator.setMathBounds(bounds)

**Related:** TC-API-CORE-003

## Preconditions

- GraphingCalculator instance is initialized and stable.

## Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Read the initial viewport from `graphpaperBounds.mathCoordinates`. | Baseline bounds are captured. |
| 2 | Call `setMathBounds({ left: -20, right: 20, bottom: -5, top: 5 })`. | Method completes without error. |
| 3 | Read `graphpaperBounds.mathCoordinates` again. | Bounds update to `left=-20`, `right=20`, `bottom=-5`, `top=5`. |
| 4 | Observe the graph or dependent calculations. | The viewport reflects the new bounds consistently. |

## Notes for Automation

- **API surface:** `setMathBounds`, `graphpaperBounds`.
- **Setup strategy:** Capture the initial bounds, apply the viewport change, then re-read the observable bounds.
- **Assertion strategy:** Compare all four math-coordinate edges against the requested values.
- **Data considerations:** Use non-default bounds that clearly differ from the initial viewport.
- **Cleanup:** Destroy the calculator after the test.