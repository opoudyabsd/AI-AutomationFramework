# TC-E2-01-004: Navigate Graph Settings panel fields using Tab and Shift+Tab

**Summary:** TC-E2-01-004 [Graph Settings] [regression] — Verify that all controls inside the Graph Settings panel are reachable via Tab/Shift+Tab keyboard navigation and each has an accessible label readable by screen readers.

**Priority:** 3 — Accessibility requirement; users relying on keyboard or AT must be able to reach every setting.

**Related:** docs/userstory/E2_GraphSettings-ViewportContol.md, TC-E2-01-001

## Preconditions

- The Desmos Graphing Calculator is open at https://www.desmos.com/calculator
- The Graph Settings panel is open

## Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open Graph Settings panel | Panel is visible with all controls |
| 2 | Press `Tab` repeatedly to cycle through all interactive fields | Focus moves sequentially through: x-axis min, x-axis max, y-axis min, y-axis max, angle unit controls, Complex Mode toggle, and the close/dismiss control |
| 3 | For each focused element, check its accessible name | Each control exposes a non-empty accessible name (visible or aria label) |
| 4 | Press `Shift+Tab` from the last focusable element | Focus moves backwards through the same sequence |
| 5 | Observe that no control is unreachable by keyboard | Every interactive element in the panel receives focus |

## Notes for Automation

- **Assertion strategy:** Use `expect(page.locator(':focus')).toHaveAccessibleName(/.+/)` after each `Tab` press to confirm each focused element has an accessible name
- **Input method:** `await page.keyboard.press('Tab')` in a loop; count focused elements and compare to expected field count
- **Known limitation:** The exact number of Tab stops depends on the live Desmos DOM — verify field count in the browser before hardcoding the loop count
