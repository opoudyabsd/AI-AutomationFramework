# TC-API-TABLE-002: Create table with computed column

**Summary:** Verifies that a table can include a computed column whose values derive from another column expression.

**Priority:** 4 - Important for dynamic table workflows and regression-ready data views.

**Source:** docs/desmosAPI/Desmos-api-v1.11.md - Table Columns

**Related:** TC-API-TABLE-001

## Preconditions

- GraphingCalculator instance is initialized.

## Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Create a table with one explicit column `x_1` and one computed column such as `x_1^2`. | Table expression is created successfully. |
| 2 | Read the table state back through `getExpressions()`. | Returned state includes both the explicit and computed columns. |
| 3 | Inspect the computed column definition. | Column latex matches the computed formula provided at creation time. |
| 4 | Observe rendered graph output or derived values. | Computed row values reflect the expression applied to the explicit column. |

## Notes for Automation

- **API surface:** `setExpression`, `getExpressions`.
- **Setup strategy:** Use simple integer input rows so the expected computed values are obvious.
- **Assertion strategy:** Validate table structure first, then verify one or more computed outcomes through a graph or state proxy.
- **Data considerations:** Prefer formulas with deterministic integer results such as squaring.
- **Cleanup:** Destroy the calculator after the test.