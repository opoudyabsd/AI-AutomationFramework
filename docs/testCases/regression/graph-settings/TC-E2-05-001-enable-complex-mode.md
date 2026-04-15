# TC-E2-05-001: Enable Complex Mode from Graph Settings

**Summary:** TC-E2-05-001 [Graph Settings] [regression] — Verify that enabling Complex Mode in Graph Settings allows complex number expressions (e.g. `3+4i`) to be entered and rendered as a point on the graph.

**Priority:** 3 — Feature-level toggle; required to access Desmos complex number functionality.

**Related:** docs/userstory/E2_GraphSettings-ViewportContol.md, TC-E2-05-002, TC-E2-E2E-004

## Preconditions

- The Desmos Graphing Calculator is open at https://www.desmos.com/calculator
- Complex Mode is off (default)
- Expression list is empty

## Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open Graph Settings panel | The panel is visible; Complex Mode toggle shows the off/disabled state |
| 2 | Toggle Complex Mode on | The toggle reflects the enabled state |
| 3 | Observe the angle unit control | In Complex Mode, the angle unit is locked to Radians only (Degrees option is hidden or disabled) |
| 4 | Close Graph Settings | The panel closes |
| 5 | Type `3+4i` in the expression list | The expression is accepted; a point is plotted at (3, 4) on the graph canvas |
| 6 | Observe the expression item | No error indicator is shown |

## Notes for Automation

- **Selector:** Complex Mode toggle — use `getByRole('switch', { name: /Complex/i })` or `getByRole('checkbox', { name: /Complex/i })` — verify in live DOM
- **Assertion strategy:** After enabling, assert Degrees option `not.toBeVisible()` or `toBeDisabled()`; after entering `3+4i`, assert expression item `toBeVisible()` and `expressionError` `not.toBeVisible()`
- **Input method:** `page.keyboard.type('3+4i')` in MathQuill field after clicking it
