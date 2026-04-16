# TC-API-SEED-001: Set randomSeed via updateSettings

**Summary:** Verifies that setting `randomSeed` through `updateSettings()` produces deterministic random-expression behavior across equivalent calculator setups.

**Priority:** 3 - Important for reproducible automation around random-dependent expressions.

**Source:** docs/desmosAPI/Desmos-api-v1.11.md - Random Seeds

**Related:** None

## Preconditions

- GraphingCalculator instance is initialized.
- A test expression can observe or expose random-dependent output.

## Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Call `updateSettings({ randomSeed: 'test-seed-123' })`. | Setting is applied successfully. |
| 2 | Add a random-dependent expression such as one using `random()`. | Expression is created successfully. |
| 3 | Capture the resulting value through a helper expression or equivalent proxy. | A deterministic random output is recorded. |
| 4 | Reinitialize a fresh calculator and repeat the setup with the same seed. | Second calculator is configured identically. |
| 5 | Compare the random-dependent outputs from both calculators. | Values match, demonstrating deterministic behavior for the same seed. |

## Notes for Automation

- **API surface:** `updateSettings`, `randomSeed`, `HelperExpression` or equivalent readback helper.
- **Setup strategy:** Use two fresh calculator instances so seed behavior can be compared cleanly.
- **Assertion strategy:** Compare the observed random-dependent values after identical seeded setup.
- **Data considerations:** Use a fixed string seed and a simple readback path for the random expression result.
- **Cleanup:** Destroy all calculator instances used during the test.