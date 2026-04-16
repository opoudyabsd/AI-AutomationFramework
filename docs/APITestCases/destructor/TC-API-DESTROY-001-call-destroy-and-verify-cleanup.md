# TC-API-DESTROY-001: Call destroy and verify cleanup

**Summary:** Verifies that `destroy()` unbinds listeners, frees resources, and causes later method calls to become no-ops.

**Priority:** 5 - Critical for preventing leaks in dynamic applications that mount and unmount calculators.

**Source:** docs/desmosAPI/Desmos-api-v1.11.md - GraphingCalculator.destroy()

**Related:** None

## Preconditions

- GraphingCalculator instance is initialized.
- A change observer is registered and the calculator contains at least one expression.

## Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Register a `change` observer and capture callback invocations. | Observer registration succeeds. |
| 2 | Add an expression through `setExpression()`. | At least one change callback is captured. |
| 3 | Call `destroy()`. | Calculator is destroyed without throwing. |
| 4 | Attempt to call `setExpression({ id: 'after-destroy', latex: 'y=x' })`. | Call has no effect and logs a warning to the console. |
| 5 | Verify no further change callbacks are captured. | Observer is no longer active after destruction. |

## Notes for Automation

- **API surface:** `destroy`, `observeEvent`, `setExpression`.
- **Setup strategy:** Capture console output and event counts in page context before and after destruction.
- **Assertion strategy:** Confirm no new expression is added after destruction and no observer fires again.
- **Data considerations:** Test both a method call and an observer side effect after `destroy()`.
- **Cleanup:** None beyond the `destroy()` call being tested.