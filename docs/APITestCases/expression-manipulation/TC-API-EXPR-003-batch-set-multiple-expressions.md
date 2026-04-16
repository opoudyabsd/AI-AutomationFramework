# TC-API-EXPR-003: Batch set multiple expressions

**Summary:** Verifies that `setExpressions()` accepts an array and adds all supplied expressions in one operation.

**Priority:** 4 - Important for efficient state setup and bulk updates.

**Source:** docs/desmosAPI/Desmos-api-v1.11.md - GraphingCalculator.setExpressions(expression_states)

**Related:** TC-API-EXPR-001

## Preconditions

- GraphingCalculator instance is initialized.

## Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Prepare an array with three expression states using IDs `e1`, `e2`, and `e3`. | The payload is ready for batch insertion. |
| 2 | Call `setExpressions(payload)`. | The method completes without error. |
| 3 | Call `getExpressions()`. | Returned state includes all three inserted expressions. |
| 4 | Verify each inserted ID is present and mapped to the correct latex. | Batch insertion preserves the input mapping. |

## Notes for Automation

- **API surface:** `setExpressions`, `getExpressions`.
- **Setup strategy:** Use deterministic IDs and latex values so the result can be asserted directly.
- **Assertion strategy:** Verify count growth and per-ID membership in the returned expressions array.
- **Data considerations:** Add at least one styled expression to confirm non-latex fields also survive batch insertion.
- **Cleanup:** Destroy the calculator after the test.