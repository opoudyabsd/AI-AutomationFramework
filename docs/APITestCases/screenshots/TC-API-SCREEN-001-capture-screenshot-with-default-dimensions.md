# TC-API-SCREEN-001: Capture screenshot with default dimensions

**Summary:** Verifies that `screenshot()` returns a valid PNG data URI for the current graphpaper using default dimensions.

**Priority:** 3 - Useful for export and visual workflows built on the API.

**Source:** docs/desmosAPI/Desmos-api-v1.11.md - GraphingCalculator.screenshot([opts])

**Related:** None

## Preconditions

- GraphingCalculator instance is initialized.
- At least one visible expression exists on the graph.

## Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Add a visible expression such as `y=x^2`. | Graphpaper contains rendered content. |
| 2 | Call `screenshot()` with no options. | Method returns immediately with a string. |
| 3 | Inspect the return value. | String begins with `data:image/png;base64,`. |
| 4 | Decode or validate the payload header. | Returned data is consistent with a PNG image payload. |

## Notes for Automation

- **API surface:** `screenshot`, `setExpression`.
- **Setup strategy:** Render a simple visible graph before capturing the screenshot.
- **Assertion strategy:** Validate the URI prefix and optionally inspect the decoded PNG signature.
- **Data considerations:** Avoid blank graphpaper to reduce ambiguity around screenshot output validity.
- **Cleanup:** Destroy the calculator after the test.