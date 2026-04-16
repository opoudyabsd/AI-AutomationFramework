# TC-API-STATE-002: setState with allowUndo false option

**Summary:** Verifies that `setState(state, { allowUndo: false })` restores calculator state without adding that operation to the undo stack.

**Priority:** 4 - Important for programmatic state sync flows that should not pollute user undo history.

**Source:** docs/desmosAPI/Desmos-api-v1.11.md - GraphingCalculator.setState(obj, [options])

**Related:** TC-API-STATE-001

## Preconditions

- GraphingCalculator instance is initialized.
- The calculator has an existing undo history created through prior changes.

## Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Create an initial expression state and capture it with `getState()`. | Baseline state is available. |
| 2 | Make a second visible change to the calculator so undo history exists. | Calculator state differs from the baseline. |
| 3 | Call `setState(baselineState, { allowUndo: false })`. | Baseline state is restored successfully. |
| 4 | Trigger undo through the supported UI flow. | Undo skips the programmatic `setState` operation and targets the prior user-visible history entry. |

## Notes for Automation

- **API surface:** `getState`, `setState`.
- **Setup strategy:** Build a small undo history through stateful changes before restoring a prior state with `allowUndo: false`.
- **Assertion strategy:** Validate the visible calculator state before and after the undo action to confirm stack behavior.
- **Data considerations:** Document any ambiguity if the public API does not expose undo directly and UI-driven verification is required.
- **Cleanup:** Destroy the calculator after the test.