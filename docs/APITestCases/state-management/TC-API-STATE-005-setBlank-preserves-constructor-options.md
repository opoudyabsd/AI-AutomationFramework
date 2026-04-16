# TC-API-STATE-005: setBlank preserves constructor options

**Summary:** Verifies that `setBlank()` clears graph state while preserving constructor-level configuration options.

**Priority:** 5 - Critical because the docs distinguish constructor options from graph settings and reset behavior depends on that distinction.

**Source:** docs/desmosAPI/Desmos-api-v1.11.md - Configuration Options vs Graph Settings; GraphingCalculator.setBlank([options])

**Related:** TC-API-CORE-002

## Preconditions

- GraphingCalculator instance is initialized with constructor options such as `{ expressions: false, lockViewport: true }`.
- The calculator contains expressions and at least one modified graph setting.

## Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Initialize the calculator with constructor options that visibly affect UI behavior. | Constructor options are active. |
| 2 | Add expression content and update a graph setting such as `degreeMode`. | The calculator now differs from its blank state. |
| 3 | Call `setBlank()`. | The calculator resets successfully. |
| 4 | Check the constructor-driven behaviors again. | Constructor options still remain in effect after reset. |
| 5 | Check the graph setting modified in step 2. | Graph setting resets with the blank state instead of persisting like the constructor options. |

## Notes for Automation

- **API surface:** Constructor options, `setBlank`, `updateSettings`, `settings`.
- **Setup strategy:** Use one constructor option with clear UI impact and one graph setting with clear state impact.
- **Assertion strategy:** Distinguish persistence of configuration options from reset of graph settings after `setBlank()`.
- **Data considerations:** Favor options and settings that can be observed through state or simple UI proxies.
- **Cleanup:** Destroy the calculator after the test.