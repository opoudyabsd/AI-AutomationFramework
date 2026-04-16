# TC-API-SETTINGS-004: Update degreeMode to toggle angle units

**Summary:** Verifies that toggling `degreeMode` changes how trigonometric expressions are interpreted and rendered.

**Priority:** 4 - Important for correctness in trigonometric and classroom workflows.

**Source:** docs/desmosAPI/Desmos-api-v1.11.md - GraphingCalculator.updateSettings(settings), degreeMode

**Related:** TC-API-SETTINGS-001

## Preconditions

- GraphingCalculator instance is initialized in the default radian mode.
- A trigonometric expression is available for observation.

## Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Confirm `calculator.settings.degreeMode` is initially `false`. | Calculator starts in radian mode. |
| 2 | Add a trigonometric expression such as `y=sin(x)`. | Expression renders successfully. |
| 3 | Call `updateSettings({ degreeMode: true })`. | Setting updates successfully. |
| 4 | Read `calculator.settings.degreeMode` again. | Value becomes `true`. |
| 5 | Observe a trig-dependent signal such as helper-expression output or graph periodicity. | Expression behavior now reflects degree interpretation. |

## Notes for Automation

- **API surface:** `updateSettings`, `settings`, `setExpression`.
- **Setup strategy:** Pair the settings change with a trig expression so the mode shift has an observable outcome.
- **Assertion strategy:** Verify the setting value directly and add one behavior-level proxy check for degree-mode interpretation.
- **Data considerations:** Use deterministic values like `sin(90)` through a helper expression if a direct graph proxy is ambiguous.
- **Cleanup:** Destroy the calculator after the test.