---
allowed-tools:
  - Read
  - Write
  - Glob
  - Bash
  - playwright-test/browser_navigate
  - playwright-test/browser_snapshot
  - playwright-test/browser_type
  - playwright-test/browser_click
  - playwright-test/browser_press_key
  - playwright-test/browser_hover
  - playwright-test/browser_drag
  - playwright-test/browser_evaluate
  - playwright-test/browser_wait_for
  - playwright-test/browser_verify_element_visible
  - playwright-test/browser_verify_text_visible
  - playwright-test/generator_setup_page
  - playwright-test/generator_read_log
  - playwright-test/generator_write_test
argument-hint: '[test-case-id, feature folder name, or ''all'']'
description: |
  Generates production-ready Playwright TypeScript test scripts from existing test case .md files in docs/testCases/. Use this skill whenever the user asks to "create test scripts", "generate Playwright tests", "implement test cases", "write automation code", "convert test cases to code", "generate spec files", or "write E2E tests". Also trigger when the user references a test case ID (e.g. TC-E1-01-001), a feature folder name (e.g. expression-entry), or asks to implement tests for a specific user story or feature area. Uses live Playwright MCP browser interaction to verify selectors before writing code. Always produces POM + fixture architecture. Trigger liberally.
name: playwright-testScript-creation
---

# Playwright Test Script Creation

Converts `docs/testCases/` markdown files into TypeScript using POM + fixture
architecture. Validates every selector against the live Desmos calculator before
writing code to avoid stale-selector bugs.

---

## Phase 1 — Research

1. Read `docs/projectContext.md`. It is the authoritative source for Desmos
   selectors and constraints. Do this before writing any code.
2. Glob `docs/testCases/**/*.md`. Group by feature folder (second path segment,
   e.g. `expression-entry`). Each feature folder maps to one spec, one POM, one
   fixture. Collect from all type subdirectories (`smoke/`, `regression/`, etc.).
3. Read each target `.md` file. Extract: ID, Summary, Priority, Preconditions,
   Test Steps (action + expected result), Notes for Automation.
4. Read existing files for this feature before modifying — POM, fixture, spec,
   `constants.ts`, `testData.ts`. Extending existing files prevents duplication.

---

## Phase 2 — Verify selectors

5. Navigate to `https://www.desmos.com/calculator` via `browser_navigate`. Call
   `browser_snapshot` to capture the full accessibility tree. Check the __DOM
   quick reference__ table below before searching — the most common stale
   selectors are already resolved there.
6. For every selector from test cases: confirm it exists in the snapshot. When a
   selector is missing, find the live value and mark it:
   `// corrected from test case: [original]`.
7. Choose locators using this priority order (stop at first viable option):

   1. `getByRole` / `getByLabel` / `getByText` / `getByPlaceholder` — semantic
   2. `data-*` attribute — when present and stable
   3. `.dcg-*` class scoped to a container — only when no semantic selector exists
   4. Generic scoped CSS chain — last resort

   Do not use XPath; it couples tests to internal DOM structure and breaks on
   any markup refactor. Do not use flat overly-specific chains like
   `div > div:nth-child(2)`.

---

## Phase 3 — Write code

8. **Classify all test data first**, before writing any spec, to keep specs
   free of literals:

   - Shared across tests → `src/testData/constants.ts` (selectors, timeouts,
      aria-labels, shortcuts)
   - Test-specific inputs / expected values → `src/testData/testData.ts`
      (expressions, coordinates, result strings)

9. **Write or update the POM** at `src/pages/[PageName].ts`:

   - All locators are `readonly` class properties set in the constructor.
   - Method names describe user intent: `typeExpression()` not `clickMathField()`.
   - `goto()` must call `waitForCalculatorLoad()` internally so callers need not
      repeat the wait.
   - Keep assertions out of the POM; they belong in specs only.

10. **Write or update the fixture** at `src/utils/fixtures/[kebab].fixture.ts`.
   Extend the `Fixtures` type — do not replace the file.
11. **Write or update the spec** at `src/tests/[feature].spec.ts`:

- Import `test` and `expect` from the fixture only, not from `@playwright/test`
   directly (the fixture re-exports `expect` and ensures correct context).
- One `test.describe()` per spec; `test.beforeEach()` for navigation.
- Test names: `'should <verb> <what>'`. Arrange / Act / Assert structure.
- Use Playwright's auto-retry matchers (`toBeVisible`, `toContainText`,
   `toHaveCount`, etc.) instead of `expect(await locator.isVisible()).toBe(true)`.
- `waitForTimeout()` only for MathQuill's async render; import the constant.

---

## Phase 4 — Validate

12. Replay complex interactions live using `browser_type`, `browser_press_key`, or
   `browser_click` for MathQuill input, keyboard shortcuts, canvas clicks, and
   style menus. Confirm the expected DOM change before committing the code.
13. Before saving, verify:

- [ ] No direct `@playwright/test` imports in spec files
- [ ] No `locator.fill()` on MathQuill fields
- [ ] No canvas pixel assertions
- [ ] No `test.only()` or `page.pause()`
- [ ] No XPath selectors
- [ ] No inline data literals in specs — every value imported from `testData.ts`
- [ ] `goto()` calls `waitForCalculatorLoad()` internally
- [ ] Multi-element locators are scoped or filtered

---

## Output structure

```html
src/
  testData/
    constants.ts          # selectors, timeouts, aria-labels, shortcuts
    testData.ts           # expressions, expected values, graph coordinates
  pages/[PageName].ts     # POM: readonly locators + user-action methods
  tests/regressionOrSmokeOrE2E/[feature].spec.ts # test.describe > test.beforeEach + test()
  utils/fixtures/[feature].fixture.ts  # base.extend<Fixtures>({ … })
```

**POM constructor skeleton:**

```typescript
constructor(page: Page) {
  this.page = page;
  // Semantic selectors first
  this.addItemButton = page.getByRole('button', { name: ARIA.ADD_ITEM });
  // .dcg-* only when no role/label is available; always scoped + filtered
  this.expressionList  = page.locator(SELECTORS.EXPRESSION_LIST);
  this.expressionItems = this.expressionList.locator(SELECTORS.EXPRESSION_ITEM);
  this.expressionItem  = this.expressionItems.first();
  this.mathInputField  = page.locator(SELECTORS.MATH_INPUT).first();
  // Errors render as role="note" — more stable than .dcg-error (absent when no error)
  this.expressionError = this.expressionItem.getByRole('note');
}
```

**Fixture skeleton:**

```typescript
export const test = base.extend<{ calculatorPage: CalculatorPage }>({
  calculatorPage: async ({ page }, use) => {
    await use(new CalculatorPage(page));
  },
});
export { expect } from '@playwright/test';
```

**Spec skeleton:**

```typescript
import { test, expect } from '../utils/fixtures/calculator.fixture';
import { expressionEntryData, graphCoordinates } from '../testData/testData';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ calculatorPage }) => { await calculatorPage.goto(); });

  // TC-E1-01-001 | Priority 2
  test('should <verb> <what>', async ({ calculatorPage }) => {
    // Arrange / Act / Assert — all data from testData imports
    await calculatorPage.typeExpression(expressionEntryData.quadraticExpression);
    await expect(calculatorPage.expressionItem).toBeVisible();
    await expect(calculatorPage.expressionError).not.toBeVisible();
  });
});
```

---

## Feature → file mapping

| Feature folder | Page Object | Fixture | Spec |
|---|---|---|---|
| `expression-entry` | `CalculatorPage.ts` | `calculator.fixture.ts` | `expression-entry.spec.ts` |
| `graph-settings` | `GraphSettingsPage.ts` | `graph-settings.fixture.ts` | `graph-settings.spec.ts` |
| `sliders-animations` | `SlidersPage.ts` | `sliders.fixture.ts` | `sliders-animations.spec.ts` |
| `save-load-share` | `SharePage.ts` | `share.fixture.ts` | `save-load-share.spec.ts` |

New feature folders: derive `[PascalCase]Page.ts`, `[kebab].fixture.ts`, `[kebab].spec.ts`.

---

## Desmos DOM quick reference

Live-verified corrections — these override `projectContext.md`. Load
`.claude/playwright-TestScript-creation/dom-gotchas.md` for full details and
code examples.

| Area | Documented assumption | Live DOM truth |
|---|---|---|
| Color picker | `.dcg-color-option` | `.dcg-color-tile` (`role="option"`, labels "red"/"blue"/…) |
| Expression icon | `.dcg-expression-icon` | `.dcg-expression-icon-container` |
| Expression error | `.dcg-error` (absent when no error) | `getByRole('note')` |
| Trace coordinates | `.dcg-trace-coordinates` (removed) | Export-button anchor: `getByRole('button', { name: 'Export point…' }).first().locator('xpath=../..') ` |
| Style menu | `.dcg-options-menu` (never existed) | Button name `/Options for Expression/` when open |
| Graph canvas | `.dcg-graph-outer` (2 elements) | `.dcg-graph-outer[role="img"]` |
| Canvas click | `locator.click()` (blocked by overlay) | `page.mouse.move(x, y, { steps: 5 })` → `page.mouse.click(x, y)` |
| MathQuill select-all | `Ctrl+A` (does nothing) | `End` → `Shift+Home` |

**Trace tooltip rules (summary):**

- Tooltips only appear at POIs (intercepts, vertex, min/max) — not arbitrary curve points.
- Multiple POIs lock simultaneously; Escape does not dismiss them.
- DOM orders locked labels by ascending x-coordinate; use `.first()` consistently.
- Coordinate text omits parentheses (aria-only); assert numeric part only: `'2, 0'`.
- Negative coordinates use Unicode minus `−` (U+2212), not ASCII `-`:
   `leftInterceptCoords: '\u22122, 0'`.

---

## Edge cases

- **Test case file not found** — list available feature folders and ask the user.
- __Selector missing from live DOM__ — check the table above, then `browser_snapshot`.
   If still unresolved, mark `// selector unverified — confirm against live DOM`.
- **Selector matches multiple elements** — scope to a container and use `.filter()`.
   Use `.first()` only when DOM ordering is deterministic by design (e.g. POI labels
   sorted by x-coordinate).
- **Existing POM / fixture / spec** — read before writing; extend, do not replace.
- **Existing `constants.ts` / `testData.ts`** — read before writing; add exports,
   do not overwrite existing ones.
- **MathQuill input** — `keyboard.type()` only; `locator.fill()` silently fails
   because MathQuill intercepts the input event before the native field receives it.
- **Canvas assertions** — DOM proxy signals only (error absence, slider, trace label).
   POI coordinates must be numeric-only strings with Unicode minus for negatives.
- **Multiple POIs in one test** — click in ascending x-order; use `.first()` on the
   Export button; Escape does not clear locked POIs (see `dom-gotchas.md`).
- **No MCP connection** — fall back to `docs/projectContext.md` selectors; mark each
   `// selector unverified — confirm against live DOM before committing`.
- **Test requires Desmos account** — skip and notify the user; out of scope.
- **`testData.json` next to a test case** — read it and export its values to `testData.ts`.
- **Style panel stays open after color selection** — assert `.dcg-expression-icon-container`
   or `styleMenu` instead of `expressionToggleButton` right after a color click.

---

## Reference files

| File | Load when |
|---|---|
| `docs/projectContext.md` | Always — load at Phase 1 before writing any code |
| `.claude/playwright-TestScript-creation/dom-gotchas.md` | Any selector or interaction fails or behaves unexpectedly |
| `docs/testCases/[type]/[feature]/[TC-ID].md` | Load the specific test cases being implemented |
| `src/pages/[PageName].ts` | Always before creating or modifying a Page Object |
| `src/utils/fixtures/[name].fixture.ts` | Always before creating or modifying a fixture |
| `src/tests/[feature].spec.ts` | Always before creating or modifying a spec file |
| `src/testData/constants.ts` | Always before writing any selector, timeout, or aria-label |
| `src/testData/testData.ts` | Always before writing any input value or expected assertion value |
