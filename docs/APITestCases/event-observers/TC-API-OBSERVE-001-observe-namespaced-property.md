# TC-API-OBSERVE-001: Observe namespaced property

**Summary:** Verifies that observers can be bound to a namespaced property and triggered when that property changes.

**Priority:** 4 - Important for reactive integrations that manage observer lifecycles precisely.

**Source:** docs/desmosAPI/Desmos-api-v1.11.md - Managing Observers

**Related:** TC-API-CORE-004

## Preconditions

- GraphingCalculator instance is initialized.
- A mutable settings property such as `xAxisLabel` is available for observation.

## Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Register `calculator.settings.observe('xAxisLabel.test', callback)`. | Namespaced observer registration succeeds. |
| 2 | Call `updateSettings({ xAxisLabel: 'Time' })`. | Setting updates successfully. |
| 3 | Inspect callback capture data. | Callback fires and reflects the updated property value. |
| 4 | Update the same property again to a new value. | Callback fires again for the second change. |

## Notes for Automation

- **API surface:** `settings.observe`, `updateSettings`.
- **Setup strategy:** Capture observer invocations inside page context and expose them through a helper readback path.
- **Assertion strategy:** Verify invocation count and the resulting observed value after each update.
- **Data considerations:** Use a namespaced key so later tests can selectively unobserve without affecting unrelated listeners.
- **Cleanup:** Call `settings.unobserve('xAxisLabel.test')` and destroy the calculator.