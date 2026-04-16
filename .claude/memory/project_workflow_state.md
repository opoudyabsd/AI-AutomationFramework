---
name: project_workflow_state
description: Current state of the Desmos E2E automation project — workflow chain, key corrections, known gaps
type: project
---

Tests are organized in `src/tests/{smoke|regression|e2e}/` subdirectories (not flat). Import paths from specs to fixtures/testData require `../../` (two levels up).

**Why:** Specs moved to type subdirectories after initial setup. All skills and CLAUDE.md were updated on 2026-04-16 to reflect this.
**How to apply:** Always use `../../utils/fixtures/` and `../../testData/` in spec import paths.

Live-verified DOM corrections (override projectContext.md):
- Expression error: `getByRole('note')` — `.dcg-error` does not exist in live DOM
- Eye toggle: `.dcg-expression-icon-container` — `.dcg-expression-icon` is visual-only
- Reset View ARIA: `'Default Viewport'` — NOT `'Reset to Default View'`
- Graph canvas: `.dcg-graph-outer[role="img"]` — two elements exist, only one has role="img"
- Canvas click: `mouse.move(steps:15)` + 300ms dwell + `mouse.click()` — `locator.click()` blocked by overlay
- MathQuill select-all: `End` → `Shift+Home` — `Ctrl+A` does nothing in MathQuill
- POI coordinates: Export-button grandparent `getByRole('button', {name:'Export point…'}).locator('../..')` — `.dcg-trace-coordinates` removed

Known coverage gaps as of 2026-04-16:
- No `src/tests/smoke/expression-entry.spec.ts` (TC-E1-01-001 unautomated)
- `src/tests/regression/graph-settings.spec.ts` has only 1 of 10 regression cases
- TC-E1-07-004 has no corresponding test case .md file (K2 violation)
- TC-E1-04-004 (screen reader visibility toggle) has no automated test
- TC-E2-E2E-004 (complex mode full workflow) has no automated test
