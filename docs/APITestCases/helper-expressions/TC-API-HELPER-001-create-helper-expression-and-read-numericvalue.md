# TC-API-HELPER-001: Create helper expression and read numericValue

**Summary:** Verifies that a `HelperExpression` can read the current numeric value of a calculator variable and reflect later updates.

**Priority:** 4 - Important for integrations that monitor calculator state without exposing additional expressions to the user.

**Source:** docs/desmosAPI/Desmos-api-v1.11.md - Helper Expressions, HelperExpression.numericValue

**Related:** None

## Preconditions

- GraphingCalculator instance is initialized.
- A slider-style variable expression can be created in the graph.

## Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Add `setExpression({ id: 'slider', latex: 'a=5' })`. | Variable `a` is defined with value 5. |
| 2 | Create `calculator.HelperExpression({ latex: 'a' })`. | Helper expression instance is created successfully. |
| 3 | Read `helper.numericValue`. | Returned value is `5`. |
| 4 | Update the source expression to `a=10`. | Variable value changes successfully. |
| 5 | Read `helper.numericValue` again. | Returned value updates to `10`. |

## Notes for Automation

- **API surface:** `HelperExpression`, `numericValue`, `setExpression`.
- **Setup strategy:** Create the helper after the source expression exists, then mutate the source expression in place.
- **Assertion strategy:** Compare numeric helper values before and after the source expression update.
- **Data considerations:** Add a negative follow-up later for undefined variables where `numericValue` may become `NaN`.
- **Cleanup:** Destroy the calculator after the test.