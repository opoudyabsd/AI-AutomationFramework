# TC-API-IMAGE-001: Set image expression with URL dataURI

**Summary:** Verifies that an image expression using a data URI can be added and rendered on the graph.

**Priority:** 3 - Useful for graph annotation and visual composition workflows.

**Source:** docs/desmosAPI/Desmos-api-v1.11.md - Image Uploads

**Related:** None

## Preconditions

- GraphingCalculator instance is initialized.
- A valid image data URI is available for test use.

## Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Prepare a valid image data URI payload. | Image source is available for insertion. |
| 2 | Call `setExpression()` with an image expression that references the data URI and includes position or size fields. | Image expression is accepted successfully. |
| 3 | Read the expression list through `getExpressions()`. | The image expression is present in calculator state. |
| 4 | Observe graph output. | The image renders at the expected graph location with the expected dimensions. |

## Notes for Automation

- **API surface:** `setExpression`, `getExpressions`.
- **Setup strategy:** Use a tiny deterministic image fixture so payload size stays manageable.
- **Assertion strategy:** Verify state insertion first, then use a visual or DOM proxy for rendered presence.
- **Data considerations:** Prefer a local data URI over a remote image URL to avoid network flakiness.
- **Cleanup:** Destroy the calculator after the test.