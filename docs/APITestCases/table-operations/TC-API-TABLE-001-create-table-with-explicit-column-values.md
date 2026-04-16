# TC-API-TABLE-001: Create table with explicit column values

**Summary:** Verifies that a table expression with explicit column values is created successfully and returned through calculator state APIs.

**Priority:** 4 - Core table functionality for programmatic data plotting.

**Source:** docs/desmosAPI/Desmos-api-v1.11.md - GraphingCalculator.setExpression(expression_state), Tables

**Related:** TC-API-EXPR-001

## Preconditions

- GraphingCalculator instance is initialized.

## Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Call `setExpression({ id: 'table1', type: 'table', columns: [{ latex: 'x_1', values: ['1', '2', '3'] }, { latex: 'y_1', values: ['2', '4', '6'] }] })`. | Table expression is created successfully. |
| 2 | Call `getExpressions()` and locate the expression with ID `table1`. | A table expression with matching ID is returned. |
| 3 | Inspect the returned `columns` array. | Column headers and row values match the input payload. |
| 4 | Observe graph output or table UI state. | Points corresponding to `(1,2)`, `(2,4)`, and `(3,6)` are present. |

## Notes for Automation

- **API surface:** `setExpression`, `getExpressions`.
- **Setup strategy:** Create the table directly through the calculator fixture and inspect state via `getExpressions()`.
- **Assertion strategy:** Deep-compare the returned table structure and, when useful, verify rendered proxy signals.
- **Data considerations:** Use simple integer values to avoid numeric ambiguity.
- **Cleanup:** Destroy the calculator after the test.