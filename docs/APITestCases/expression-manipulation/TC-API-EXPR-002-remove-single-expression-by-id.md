# TC-API-EXPR-002: Remove single expression by ID

**Summary:** Verifies that `removeExpression()` removes only the targeted expression from calculator state.

**Priority:** 4 - Core expression list manipulation for dynamic graph updates.

**Source:** docs/desmosAPI/Desmos-api-v1.11.md - GraphingCalculator.removeExpression(expression_state)

**Related:** TC-API-EXPR-001

## Preconditions

- GraphingCalculator instance is initialized.
- Multiple expressions exist in the calculator state.

## Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Add three expressions with IDs `line`, `para`, and `cubic`. | All three expressions are present. |
| 2 | Call `getExpressions()` and verify the array length is 3. | Baseline count is correct. |
| 3 | Call `removeExpression({ id: 'para' })`. | The method completes successfully. |
| 4 | Call `getExpressions()` again. | The array length is 2 and ID `para` is absent. |
| 5 | Verify IDs `line` and `cubic` still exist. | Non-target expressions remain unchanged. |

## Notes for Automation

- **API surface:** `removeExpression`, `setExpression`, `getExpressions`.
- **Setup strategy:** Build a small multi-expression state and remove one item from the middle.
- **Assertion strategy:** Check expression count and membership before and after removal.
- **Data considerations:** Repeat with first and last positions if deeper regression coverage is needed.
- **Cleanup:** Destroy the calculator after the test.