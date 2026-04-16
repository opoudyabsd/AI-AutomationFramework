# TC-API-FONT-001: Update fontSize to Desmos.FontSizes.LARGE

**Summary:** Verifies that the calculator accepts a predefined `FontSizes` constant and reflects it through settings and UI scale.

**Priority:** 2 - Lower-risk customization feature, but still useful for accessibility and presentation testing.

**Source:** docs/desmosAPI/Desmos-api-v1.11.md - Font Sizes

**Related:** None

## Preconditions

- GraphingCalculator instance is initialized with default font size.

## Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Read `Desmos.FontSizes.LARGE`. | Constant matches the documented large-size value. |
| 2 | Call `updateSettings({ fontSize: Desmos.FontSizes.LARGE })`. | Setting is applied successfully. |
| 3 | Read the calculator settings back. | `fontSize` reflects the large-size value. |
| 4 | Inspect expression list or graph UI text rendering. | Text appears larger than the default size. |

## Notes for Automation

- **API surface:** `Desmos.FontSizes`, `updateSettings`, `settings`.
- **Setup strategy:** Apply the setting and read it back before relying on any visual assertion.
- **Assertion strategy:** Verify settings first, then use a UI proxy if required by the test objective.
- **Data considerations:** Predefined constants are safer than arbitrary numbers for baseline coverage.
- **Cleanup:** Destroy the calculator after the test.