# TC-API-STATE-001: Serialize and deserialize state with JSON.stringify

**Summary:** Verifies that `getState()` output can roundtrip through `JSON.stringify` and `JSON.parse`, then be restored with `setState()`.

**Priority:** 5 - Fundamental requirement for save/load workflows.

**Source:** docs/desmosAPI/Desmos-api-v1.11.md - GraphingCalculator.getState(), GraphingCalculator.setState(obj, [options])

**Related:** TC-API-CORE-002

## Preconditions

- GraphingCalculator instance is initialized.
- The calculator contains at least one expression and a non-default viewport.

## Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Add expression `y=x^2` and set viewport bounds to `{ left: -5, right: 5, bottom: -2, top: 10 }`. | Calculator reflects the configured state. |
| 2 | Call `getState()` and capture the returned object. | A serializable state object is returned. |
| 3 | Call `JSON.stringify(state)` and store the resulting string. | Serialization succeeds without error. |
| 4 | Call `JSON.parse(serializedState)` to rebuild the object. | The state object is reconstructed successfully. |
| 5 | Load the parsed state into a fresh calculator instance using `setState(parsedState)`. | The second calculator loads the state without error. |
| 6 | Compare expressions and viewport between the original and restored calculators. | Expression content and viewport match the original state. |

## Notes for Automation

- **API surface:** `getState`, `setState`, `setExpression`, `setMathBounds`, `graphpaperBounds`.
- **Setup strategy:** Use two calculator instances or destroy and recreate one instance after serialization.
- **Assertion strategy:** Compare the restored expressions and viewport coordinates against the original state.
- **Data considerations:** Use API-generated state only; do not hand-author the serialized object because the docs treat states as opaque.
- **Cleanup:** Destroy all calculator instances used in the test.