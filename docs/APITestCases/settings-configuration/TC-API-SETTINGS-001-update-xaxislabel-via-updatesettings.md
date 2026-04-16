# TC-API-SETTINGS-001: Update xAxisLabel via updateSettings

**Summary:** Verifies that `updateSettings()` changes the x-axis label in calculator settings and the rendered graph UI.

**Priority:** 4 - Core settings mutation for graph customization.

**Source:** docs/desmosAPI/Desmos-api-v1.11.md - GraphingCalculator.updateSettings(settings)

**Related:** TC-API-CORE-002

## Preconditions

- GraphingCalculator instance is initialized with default settings.

## Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Read `calculator.settings.xAxisLabel`. | Baseline value is empty or default. |
| 2 | Call `updateSettings({ xAxisLabel: 'Time (seconds)' })`. | Method completes without error. |
| 3 | Read `calculator.settings.xAxisLabel` again. | Value is `Time (seconds)`. |
| 4 | Inspect the rendered graph UI. | The x-axis label reflects the updated value. |

## Notes for Automation

- **API surface:** `updateSettings`, `settings`.
- **Setup strategy:** Apply the setting directly through the API, then read it back from the settings object.
- **Assertion strategy:** Verify the settings value first, then use a DOM or visual proxy if the rendered label is also required.
- **Data considerations:** Use text with spaces or punctuation to catch encoding and formatting issues.
- **Cleanup:** Destroy the calculator after the test.