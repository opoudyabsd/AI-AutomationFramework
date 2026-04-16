# TC-API-CORE-004: Emit change event with API initiation flag

**Summary:** Verifies that `observeEvent('change')` emits for API-driven updates and marks `event.isUserInitiated` as `false`.

**Priority:** 4 - Critical for autosave logic that must distinguish programmatic updates from user edits.

**Source:** docs/desmosAPI/Desmos-api-v1.11.md - GraphingCalculator.observeEvent('change', ...); callback event object and isUserInitiated semantics

**Related:** TC-API-CORE-001

## Preconditions

- GraphingCalculator instance is initialized.
- A change-event observer is registered and records callback payloads.

## Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Register `calculator.observeEvent('change', handler)` that stores `eventName` and `event.isUserInitiated`. | Observer registration succeeds. |
| 2 | Trigger an API update using `calculator.setExpression({ id: 'api-change', latex: 'y=x^2' })`. | At least one `'change'` event is emitted. |
| 3 | Inspect the captured event payload associated with the API update. | `eventName` is `'change'` and `isUserInitiated` is `false`. |
| 4 | Call `calculator.unobserveEvent('change')` and trigger another API update. | No additional callbacks are captured after unobserve. |

## Notes for Automation

- **API surface:** `observeEvent`, `unobserveEvent`, `setExpression`.
- **Setup strategy:** Use in-page arrays/counters exposed to Playwright via `page.evaluate` for deterministic event capture.
- **Assertion strategy:** Assert event count increment, event name value, and boolean semantics for API-driven changes.
- **Data considerations:** Debounce timing may vary; wait for callback completion with bounded polling instead of fixed timeout.
- **Cleanup:** Always unobserve and destroy instance to avoid leaking observers.