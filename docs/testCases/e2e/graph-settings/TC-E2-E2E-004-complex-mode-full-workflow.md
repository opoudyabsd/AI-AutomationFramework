# TC-E2-E2E-004: Enable Complex Mode, enter a complex expression, then disable it and verify rollback

**Summary:** TC-E2-E2E-004 [Graph Settings] [e2e] — Full Complex Mode round-trip: enable Complex Mode, enter a complex number expression, verify it is plotted, disable Complex Mode, and verify the expression is invalidated. Tests the full lifecycle of the Complex Mode toggle and its effect on a live expression.

**Priority:** 3 — E2E coverage of Complex Mode; ensures the enable→use→disable lifecycle is handled without leaving the calculator in a broken state.

**Related:** docs/userstory/E2_GraphSettings-ViewportContol.md, TC-E2-05-001, TC-E2-05-002

## Preconditions

- The Desmos Graphing Calculator is open at https://www.desmos.com/calculator
- Complex Mode is off (default)
- Expression list is empty

## Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open Graph Settings and enable Complex Mode | Toggle shows enabled state; angle unit reverts to Radians-only (Degrees option becomes unavailable) |
| 2 | Close Graph Settings | Panel closes |
| 3 | Type `3+4i` in the first expression line | A point is plotted at (3, 4) on the graph canvas; expression item shows no error |
| 4 | Click the graph canvas near (3, 4) | Trace tooltip appears; coordinates show approximately (3, 4) |
| 5 | Add a second expression line and type `(1+2i)^2` | Result is plotted (should evaluate to −3+4i, placing a point at (−3, 4)); no error shown |
| 6 | Open Graph Settings and disable Complex Mode | Toggle shows disabled state |
| 7 | Close Graph Settings | Panel closes |
| 8 | Observe both expression items | Both expressions show an inline error indicator; neither `3+4i` nor `(1+2i)^2` is a valid real expression |
| 9 | Observe the graph canvas | Neither complex point is rendered on the graph |
| 10 | Open Graph Settings and re-enable Complex Mode | Toggle shows enabled state |
| 11 | Close Graph Settings | Panel closes |
| 12 | Observe both expression items | Errors clear; both expressions are re-evaluated and their points are plotted again |

## Notes for Automation

- **Assertion strategy:**
  - Step 3: `expressionError` not visible for the `3+4i` expression item
  - Step 4: `traceCoordinates` visible and `toContainText('3')` and `toContainText('4')`
  - Step 8: `expressionError` visible for each complex expression item
  - Step 12: `expressionError` not visible for either item (recovery confirmed)
- **Input method:** All expression inputs via `page.keyboard.type()` after clicking MathQuill field
- **Automation note:** Steps 8–12 test recovery from the disable action — this is the most important assertion in this E2E as it validates no zombie state is left
- **Known challenge:** `(1+2i)^2` in MathQuill requires the caret `^` to open a superscript and `)` to close it. The typed sequence `(1+2i)^2` may not produce the intended expression. Verify in the live app and adjust the key sequence if needed.
