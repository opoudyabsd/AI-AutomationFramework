# TC-API-EXPR-001: Set and update expression with partial parameters

**Summary:** Verifies that calling `setExpression` with an existing ID updates only provided parameters while preserving unprovided parameters.

**Priority:** 5 - Critical for incremental expression updates without full re-specification.

**Source:** docs/desmosAPI/Desmos-api-v1.11.md - GraphingCalculator.setExpression(expression_state)

**Related:** TC-API-CORE-001

## Preconditions

- GraphingCalculator instance is initialized and stable.
- An expression with ID `test-expr` exists with initial parameters `latex: 'y=x'`, `color: '#ff0000'`, and `lineStyle: 'SOLID'`.

## Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Call `setExpression({ id: 'test-expr', latex: 'y=x', color: '#ff0000', lineStyle: 'SOLID' })`. | Expression is created with all specified parameters. |
| 2 | Call `getExpressions()` and capture the full expression state. | Returned state includes `latex`, `color`, and `lineStyle`. |
| 3 | Call `setExpression({ id: 'test-expr', latex: 'y=x^2' })`. | Expression updates successfully. |
| 4 | Read the expression state again through `getExpressions()`. | `latex` becomes `y=x^2`, while `color` and `lineStyle` remain unchanged. |

## Notes for Automation

- **API surface:** `setExpression`, `getExpressions`.
- **Setup strategy:** Use a calculator fixture to initialize the graph and seed the baseline expression.
- **Assertion strategy:** Compare the expression state before and after the partial update and verify that only the provided field changed.
- **Data considerations:** Reuse a deterministic expression ID and test at least one style property and one math property.
- **Cleanup:** Destroy the calculator after the test.