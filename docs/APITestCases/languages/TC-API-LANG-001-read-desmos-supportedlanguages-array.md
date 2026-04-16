# TC-API-LANG-001: Read Desmos.supportedLanguages array

**Summary:** Verifies that `Desmos.supportedLanguages` exposes the language codes available in the loaded API bundle.

**Priority:** 2 - Discovery-level internationalization coverage for future language-dependent tests.

**Source:** docs/desmosAPI/Desmos-api-v1.11.md - Languages

**Related:** None

## Preconditions

- Desmos API is loaded in page context.
- At least the default English language bundle is available.

## Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Read `Desmos.supportedLanguages`. | An array is returned. |
| 2 | Verify the array contains at least `en`. | English is available in the current bundle. |
| 3 | If the API was loaded with additional `lang` values, compare against the expected set. | Returned values include the requested languages. |
| 4 | Validate element types. | All entries are string language codes. |

## Notes for Automation

- **API surface:** `Desmos.supportedLanguages`.
- **Setup strategy:** Load the API with explicit `lang` parameters when broader language coverage is needed.
- **Assertion strategy:** Check array type, membership, and expected language codes.
- **Data considerations:** Keep the baseline assertion minimal when only the default bundle is loaded.
- **Cleanup:** None beyond standard page teardown.