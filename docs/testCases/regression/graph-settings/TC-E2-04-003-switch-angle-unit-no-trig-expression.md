# TC-E2-04-003: Switching angle unit with no trigonometric expression causes no error

**Summary:** TC-E2-04-003 [Graph Settings] [regression] — Verify that switching the angle unit when the expression list contains no trigonometric functions completes without error and the graph canvas is unaffected.

**Priority:** 3 — Edge case; ensures the setting change does not break the app when it has no visible effect.

**Related:** docs/userstory/E2_GraphSettings-ViewportContol.md, TC-E2-04-001, TC-E2-04-002

## Preconditions

- The Desmos Graphing Calculator is open at https://www.desmos.com/calculator
- The expression `y=x^2` is entered and graphed (non-trigonometric)
- Angle unit is set to Radians (default)

## Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Confirm `y=x^2` is graphed without errors | Expression item is visible; no `.dcg-error` present |
| 2 | Open Graph Settings and switch angle unit to Degrees | Setting changes to Degrees |
| 3 | Close Graph Settings | Panel closes |
| 4 | Observe the expression item and graph canvas | No error indicator appears; the parabola is still rendered; graph canvas is unchanged |

## Notes for Automation

- **Assertion strategy:** Assert `expressionError` (`getByRole('note')`) is not visible; assert `expressionItem` is still visible
- **Wait strategy:** `await expect(expressionItem).toBeVisible()` after closing settings
