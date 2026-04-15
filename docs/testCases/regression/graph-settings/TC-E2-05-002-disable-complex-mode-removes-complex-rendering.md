# TC-E2-05-002: Disabling Complex Mode removes complex number expression from the graph

**Summary:** TC-E2-05-002 [Graph Settings] [regression] — Verify that toggling Complex Mode off while a complex number expression is plotted causes that expression to show an error or be removed from the graph.

**Priority:** 3 — Ensures mode transitions are handled gracefully and do not leave stale renders on the canvas.

**Related:** docs/userstory/E2_GraphSettings-ViewportContol.md, TC-E2-05-001, TC-E2-E2E-004

## Preconditions

- The Desmos Graphing Calculator is open at https://www.desmos.com/calculator
- Complex Mode is enabled (set as part of this test, step 1)
- The expression `3+4i` is entered and plotted as a point

## Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Enable Complex Mode via Graph Settings and type `3+4i` | The complex number is plotted as a point at (3, 4); no error shown |
| 2 | Open Graph Settings | Panel opens; Complex Mode toggle shows enabled |
| 3 | Toggle Complex Mode off | The toggle reflects the disabled state |
| 4 | Close Graph Settings | The panel closes |
| 5 | Observe the expression item for `3+4i` | An inline error indicator is shown, or the expression content is cleared, indicating the complex expression is no longer valid |
| 6 | Observe the graph canvas | The point at (3, 4) is no longer present |

## Notes for Automation

- **Assertion strategy:** After disabling, assert `expressionError` (`getByRole('note')`) is visible on the `3+4i` expression item — this is the proxy for "complex expression invalidated"
- **Canvas assertion:** Cannot assert pixel removal. Use absence of trace tooltip at (3, 4) as secondary proxy if needed.
- **Wait strategy:** After closing settings, `await expect(expressionError).toBeVisible()` before proceeding
