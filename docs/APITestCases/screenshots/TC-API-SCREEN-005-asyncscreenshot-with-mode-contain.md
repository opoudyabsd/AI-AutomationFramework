# TC-API-SCREEN-005: asyncScreenshot with mode contain

**Summary:** Verifies that `asyncScreenshot()` with `mode: 'contain'` returns image data after computing a contained viewport that preserves mathematical aspect ratio.

**Priority:** 3 - Important for precise screenshot generation in export flows.

**Source:** docs/desmosAPI/Desmos-api-v1.11.md - GraphingCalculator.asyncScreenshot([opts], callback)

**Related:** TC-API-SCREEN-001

## Preconditions

- GraphingCalculator instance is initialized.
- The graph contains at least one expression that makes the viewport meaningful.

## Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Add a visible expression to the graph. | Graphpaper contains rendered content. |
| 2 | Call `asyncScreenshot({ mode: 'contain', mathBounds: { left: -5, right: 5, bottom: -2, top: 10 }, width: 400, height: 300 }, callback)`. | Method accepts the request successfully. |
| 3 | Wait for the callback to execute. | Callback is invoked with image data. |
| 4 | Inspect the callback argument. | Returned value is a valid image payload or SVG string, depending on options. |

## Notes for Automation

- **API surface:** `asyncScreenshot`, `setExpression`.
- **Setup strategy:** Wrap the callback in a promise so the Playwright test can await it deterministically.
- **Assertion strategy:** Verify callback invocation, returned data shape, and requested output dimensions when observable.
- **Data considerations:** Use non-square bounds and dimensions so the contain-mode behavior matters.
- **Cleanup:** Destroy the calculator after the test.