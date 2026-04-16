# TC-API-BASIC-001: Initialize FourFunctionCalculator

**Summary:** Verifies that `Desmos.FourFunctionCalculator` initializes successfully and exposes the documented basic-calculator lifecycle methods.

**Priority:** 3 - Important for baseline coverage of non-graphing calculator variants.

**Source:** docs/desmosAPI/Desmos-api-v1.11.md - Basic Calculators

**Related:** TC-API-CORE-001

## Preconditions

- Desmos API is loaded in page context.
- A valid DOM container element exists.

## Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Resolve the target container element from the DOM. | A non-null container element is available. |
| 2 | Call `Desmos.FourFunctionCalculator(element)`. | A calculator instance is returned without throwing. |
| 3 | Inspect the instance for documented lifecycle methods such as `getState`, `setState`, and `destroy`. | Required methods are present. |
| 4 | Observe the rendered UI. | The basic four-function calculator interface is shown instead of graphing UI. |
| 5 | Call `destroy()`. | Cleanup succeeds without error. |

## Notes for Automation

- **API surface:** `Desmos.FourFunctionCalculator`, `getState`, `setState`, `destroy`.
- **Setup strategy:** Reuse the same lightweight HTML harness pattern used for graphing-calculator API tests.
- **Assertion strategy:** Validate successful construction, method availability, and a basic UI proxy for calculator type.
- **Data considerations:** Keep constructor options minimal for the first variant-coverage case.
- **Cleanup:** Always call `destroy()` before removing the container.