# TC-API-CORE-001: Initialize GraphingCalculator with default options

**Summary:** Verifies that creating a GraphingCalculator with only a valid container element succeeds and exposes a usable calculator instance for subsequent API calls.

**Priority:** 5 - Constructor availability is a gateway behavior for all downstream API automation.

**Source:** docs/desmosAPI/Desmos-api-v1.11.md - Graphing Calculator, constructor GraphingCalculator(element, [options])

**Related:** None

## Preconditions

- A test page is loaded with `<script src="https://www.desmos.com/api/v1.11/calculator.js?apiKey=[VALID_API_KEY]"></script>`.
- A container element exists in DOM, e.g. `<div id="calculator" style="width: 600px; height: 400px;"></div>`.
- The API key has GraphingCalculator feature enabled.

## Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Resolve container with `document.getElementById('calculator')`. | A non-null DOM element is returned. |
| 2 | Call `const calculator = Desmos.GraphingCalculator(elt)`. | A calculator object is returned without thrown error. |
| 3 | Call `calculator.setExpression({ id: 'line', latex: 'y=x' })`. | API call completes successfully and expression state updates. |
| 4 | Call `calculator.getExpressions()`. | Returned array contains an item with `id: 'line'` and expression content. |

## Notes for Automation

- **API surface:** `Desmos.GraphingCalculator`, `setExpression`, `getExpressions`.
- **Setup strategy:** Use Playwright to open a lightweight harness page that injects Desmos script and a fixed-size calculator container.
- **Assertion strategy:** Assert no constructor error, object existence, and successful round-trip via `getExpressions()` as primary proxy signal.
- **Data considerations:** Use simple deterministic latex (`y=x`) to avoid asynchronous analysis ambiguity.
- **Cleanup:** Call `calculator.destroy()` after each test to avoid event/listener leakage between cases.