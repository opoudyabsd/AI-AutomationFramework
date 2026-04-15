# TC-E2-E2E-001: Set a custom domain, graph a function, and verify it renders within the adjusted viewport

**Summary:** TC-E2-E2E-001 [Graph Settings] [e2e] — Full workflow: open Graph Settings, set a narrow custom x-domain, close settings, type a function, and verify the curve renders correctly within the restricted viewport without errors. Tests the interaction between the settings panel and the live graph renderer.

**Priority:** 4 — Core E2E path; combines the two most-used features (expression entry + viewport configuration).

**Related:** docs/userstory/E2_GraphSettings-ViewportContol.md, TC-E2-01-001, TC-E2-02-001, TC-E2-02-002

## Preconditions

- The Desmos Graphing Calculator is open at https://www.desmos.com/calculator
- Default viewport is active (x ∈ [−10, 10])
- Expression list is empty

## Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click the Graph Settings icon | The Graph Settings panel opens |
| 2 | Set x-axis minimum to `0` and maximum to `4` | Fields display 0 and 4 respectively |
| 3 | Set y-axis minimum to `-1` and maximum to `5` | Fields display −1 and 5 respectively |
| 4 | Close Graph Settings (Escape or click outside) | Panel closes; x-axis now shows 0 to 4, y-axis shows −1 to 5 |
| 5 | Click the first expression line and type `y=x^2` | The expression displays in formatted notation |
| 6 | Observe the graph canvas | A parabola is rendered; within x ∈ [0, 4] the visible portion of y=x² runs from (0, 0) to (4, 16) — only the portion with y ≤ 5 (i.e. x ≤ ~2.24) is visible in the viewport |
| 7 | Observe the expression item | No error indicator is shown; expression renders without error |
| 8 | Open Graph Settings and reset x min to `-10`, x max to `10`, y min to `-10`, y max to `10` | Default values restored |
| 9 | Close Graph Settings | Full parabola including vertex at (0, 0) is visible again |

## Notes for Automation

- **Input method:** Use `page.keyboard.type()` for domain fields (no `fill()`) and for expression input (MathQuill)
- **Assertion strategy:**
  - After step 4: assert axis label text nodes match entered values
  - After step 6: assert `expressionItem` is visible and `expressionError` is not visible
  - After step 9: assert axis labels revert to ±10 defaults
- **Wait strategy:** `await expect(panel).not.toBeVisible()` after each close; `await page.waitForTimeout(MATHQUILL_RENDER_DELAY)` after typing expression
- **Automation note:** This test exercises settings→expression rendering integration — if either subsystem is broken, this test will fail and point to the interaction boundary
