# TC-API-COLOR-001: Use default Desmos.Colors constants

**Summary:** Verifies that the documented `Desmos.Colors` constants are available and can be used in expression styling.

**Priority:** 3 - Useful for stable expression styling and custom graph generation.

**Source:** docs/desmosAPI/Desmos-api-v1.11.md - Colors

**Related:** None

## Preconditions

- Desmos API is loaded in page context.
- GraphingCalculator instance is initialized.

## Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Read a documented color constant such as `Desmos.Colors.RED`. | Constant is available and resolves to the documented hex color. |
| 2 | Create an expression using `color: Desmos.Colors.RED`. | Expression is created successfully. |
| 3 | Read the expression state with `getExpressions()`. | The expression color reflects the selected Desmos constant. |
| 4 | Observe the rendered graph line or object. | The visual output matches the assigned color. |

## Notes for Automation

- **API surface:** `Desmos.Colors`, `setExpression`, `getExpressions`.
- **Setup strategy:** Pick one default constant first, then expand later to the full palette if needed.
- **Assertion strategy:** Verify both the stored color value and one rendered proxy.
- **Data considerations:** Start with a documented constant such as RED or BLUE to avoid ambiguity.
- **Cleanup:** Destroy the calculator after the test.