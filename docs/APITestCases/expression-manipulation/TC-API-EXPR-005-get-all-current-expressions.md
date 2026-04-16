# TC-API-EXPR-005: Get all current expressions

**Summary:** Verifies that `getExpressions()` returns the full expression list in a form suitable for later reuse with `setExpression()`.

**Priority:** 5 - Core read path for synchronization, persistence helpers, and state inspection.

**Source:** docs/desmosAPI/Desmos-api-v1.11.md - GraphingCalculator.getExpressions()

**Related:** TC-API-CORE-001

## Preconditions

- GraphingCalculator instance is initialized.
- At least one standard expression, one text item, and one table item exist in the expression list.

## Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Add a function expression, a text item, and a table item using distinct IDs. | All three items are created successfully. |
| 2 | Call `getExpressions()`. | An array representing the current expression list is returned. |
| 3 | Verify the array contains the expected IDs and item types. | Function, text, and table items are all present. |
| 4 | Inspect the returned objects for reusable expression-state fields. | Returned objects are suitable for passing back into `setExpression()`. |

## Notes for Automation

- **API surface:** `getExpressions`, `setExpression`.
- **Setup strategy:** Seed mixed item types in one calculator instance before reading the full list.
- **Assertion strategy:** Validate array membership, per-item type, and minimal structural fields such as `id`.
- **Data considerations:** Use intentionally different item types to avoid a false pass on a homogeneous list.
- **Cleanup:** Destroy the calculator after the test.