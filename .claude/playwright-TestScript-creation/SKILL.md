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
   e.g. `expression-entry`). The first path segment is the test type
   (`smoke`, `regression`, `e2e`, `performance`) — use it to determine which
   `src/tests/{type}/` subdirectory the spec belongs in.

3. Read each target `.md` file. Extract: ID, Summary, Priority, Preconditions,
   Test Steps (action + expected result), Notes for Automation.

4. Read existing files for this feature before modifying — POM, fixture, spec,
   `constants.ts`, `testData.ts`, `cssConstant.ts`. Extending existing files
   prevents duplication.

---

## Phase 2 — Verify selectors

5. Navigate to `https://www.desmos.com/calculator` via `browser_navigate`. Call
   `browser_snapshot` to capture the full accessibility tree. Check the **DOM
   quick reference** table below before searching — the most common stale
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
     (expressions, coordinates, result strings, regex patterns)
   - HTML / ARIA attribute names and boolean string values →
     `src/testData/cssConstant.ts` (e.g. `'aria-label'`, `'aria-checked'`,
     `'true'` / `'false'`)

9. **Write or update the POM** at `src/pages/[PageName].ts`:
   - All locators are `readonly` class properties set in the constructor.
   - Method names describe user intent: `typeExpression()` not `clickMathField()`.
   - `goto()` must call `waitForCalculatorLoad()` internally so callers need not
     repeat the wait.
   - Keep assertions out of the POM; they belong in specs only.

10. **Write or update the fixture** at `src/utils/fixtures/[kebab].fixture.ts`.
    Extend the `Fixtures` type — do not replace the file.

11. **Write or update the spec** at `src/tests/{type}/{feature}.spec.ts`,
    where `{type}` is `smoke`, `regression`, `e2e`, or `performance` — matching
    the `docs/testCases/` source subfolder for those test cases.

    - **One spec file per type per feature.** Never mix smoke and regression (or
      any other types) inside the same file. If a feature has test cases across
      multiple types, create one file per type.
    - Import `test` and `expect` from the fixture only, never from
      `@playwright/test` directly.
    - Apply **both a type tag and a feature tag** on `test.describe()`:
      ```typescript
      test.describe('Feature Name', { tag: ['@{type}', '@{feature}'] }, () => { … })
      ```
      Type tag values: `@smoke` | `@regression` | `@e2e` | `@performance`.
      Feature tag values: `@expression-entry` | `@graph-settings` |
      `@sliders-animations` | `@save-load-share` (kebab-case, prefixed with `@`).
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
          or `cssConstant.ts`
    - [ ] `goto()` calls `waitForCalculatorLoad()` internally
    - [ ] Multi-element locators are scoped or filtered
    - [ ] Spec file is in the correct `src/tests/{type}/` subdirectory
    - [ ] `test.describe()` carries both `@{type}` tag and `@{feature}` tag
    - [ ] No mixing of test types inside a single spec file

---

## Output structure

```
src/
  testData/
    constants.ts            # selectors, timeouts, aria-labels, shortcuts
    testData.ts             # expressions, expected values, graph coordinates, patterns
    cssConstant.ts          # ARIA attribute names and boolean string values
  pages/
    [PageName].ts           # POM: readonly locators + user-action methods
  tests/
    smoke/
      [feature].spec.ts     # @smoke + @[feature] — critical path only
    regression/
      [feature].spec.ts     # @regression + @[feature] — full feature coverage
    e2e/
      [feature].spec.ts     # @e2e + @[feature] — cross-feature workflows
    performance/
      [feature].spec.ts     # @performance + @[feature] — load / timing
  utils/
    fixtures/
      [feature].fixture.ts  # base.extend<Fixtures>({ … })
```

Playwright's `testDir: './src/tests'` picks up all subdirectories automatically.
Use CLI flags or tags to scope runs:

```bash
npx playwright test src/tests/smoke/          # all smoke tests
npx playwright test src/tests/regression/     # all regression tests
npx playwright test --grep @graph-settings    # all types for one feature
npx playwright test --grep "@smoke.*@expression-entry"  # smoke for one feature
```

---

## Skeletons

**POM constructor:**
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

**Fixture:**
```typescript
export const test = base.extend<{ calculatorPage: CalculatorPage }>({
  calculatorPage: async ({ page }, use) => {
    await use(new CalculatorPage(page));
  },
});
export { expect } from '@playwright/test';
```

**Spec — smoke example (`src/tests/smoke/expression-entry.spec.ts`):**
```typescript
import { test, expect } from '../../utils/fixtures/calculator.fixture';
import { expressionEntryData } from '../../testData/testData';

test.describe('Expression Entry', { tag: ['@smoke', '@expression-entry'] }, () => {
  test.beforeEach(async ({ calculatorPage }) => { await calculatorPage.goto(); });

  // TC-E1-01-001 | Priority 5
  test('should render a parabola when a quadratic function is typed', async ({ calculatorPage }) => {
    // Act
    await calculatorPage.typeExpression(expressionEntryData.quadraticExpression);
    // Assert — absence of error is the proxy for successful canvas render
    await expect(calculatorPage.expressionItem).toBeVisible();
    await expect(calculatorPage.expressionError).not.toBeVisible();
  });
});
```

**Spec — regression example (`src/tests/regression/graph-settings.spec.ts`):**
```typescript
import { test, expect } from '../../utils/fixtures/graph-settings.fixture';
import { graphSettingsData } from '../../testData/testData';
import { ATTRS, ATTR_VALUES } from '../../testData/cssConstant';

test.describe('Graph Settings', { tag: ['@regression', '@graph-settings'] }, () => {
  test.beforeEach(async ({ graphSettingsPage }) => { await graphSettingsPage.goto(); });

  // TC-E2-01-002 | Priority 3
  test('should default to Radians as the selected angle unit', async ({ graphSettingsPage }) => {
    // Act
    await graphSettingsPage.openSettings();
    // Assert
    await expect(graphSettingsPage.radiansOption).toHaveAttribute(ATTRS.ARIA_CHECKED, ATTR_VALUES.TRUE);
    await expect(graphSettingsPage.degreesOption).toHaveAttribute(ATTRS.ARIA_CHECKED, ATTR_VALUES.FALSE);
  });
});
```

---

## Feature → file mapping

POM and fixture are shared across all test types for a given feature.
Spec files are split per type into `src/tests/{type}/`.

| Feature | Page Object | Fixture | Spec files |
|---|---|---|---|
| `expression-entry` | `CalculatorPage.ts` | `calculator.fixture.ts` | `smoke/expression-entry.spec.ts`<br>`regression/expression-entry.spec.ts` |
| `graph-settings` | `GraphSettingsPage.ts` | `graph-settings.fixture.ts` | `smoke/graph-settings.spec.ts`<br>`regression/graph-settings.spec.ts`<br>`e2e/graph-settings.spec.ts` |
| `sliders-animations` | `SlidersPage.ts` | `sliders.fixture.ts` | `smoke/sliders-animations.spec.ts`<br>`regression/sliders-animations.spec.ts` |
| `save-load-share` | `SharePage.ts` | `share.fixture.ts` | `smoke/save-load-share.spec.ts`<br>`regression/save-load-share.spec.ts` |

New feature folders: derive `[PascalCase]Page.ts`, `[kebab].fixture.ts`, and one
`[kebab].spec.ts` per required test type.

**Import path note:** specs inside `src/tests/{type}/` are one level deeper than
before. Fixture imports must use `../../utils/fixtures/` (two levels up) and data
imports must use `../../testData/` (two levels up).

---

## Desmos DOM quick reference

Live-verified corrections — these override `projectContext.md`. Load
`.claude/playwright-testScript-creation/dom-gotchas.md` for full details and
code examples.

| Area | Documented assumption | Live DOM truth |
|---|---|---|
| Color picker | `.dcg-color-option` | `.dcg-color-tile` (`role="option"`, labels "red"/"blue"/…) |
| Expression icon | `.dcg-expression-icon` | `.dcg-expression-icon-container` |
| Expression error | `.dcg-error` (absent when no error) | `getByRole('note')` |
| Trace coordinates | `.dcg-trace-coordinates` (removed) | Export-button anchor: `getByRole('button', { name: 'Export point…' }).first().locator('..').locator('..')` |
| Style menu | `.dcg-options-menu` (never existed) | Button name `/Options for Expression/` when open |
| Graph canvas | `.dcg-graph-outer` (2 elements) | `.dcg-graph-outer[role="img"]` |
| Canvas click | `locator.click()` (blocked by overlay) | `page.mouse.move(x, y, { steps: 5 })` → `page.mouse.click(x, y)` |
| MathQuill select-all | `Ctrl+A` (does nothing) | `End` → `Shift+Home` |
| Reset view button | aria-label `"Reset to Default View"` (wrong) | aria-label `"Default Viewport"` — only in DOM after a zoom action |
| Settings panel | no stable class | `getByRole('region', { name: ARIA.GRAPH_SETTINGS, exact: true })` — `exact: true` required, toolbar region shares partial name |
| Axis tick numbers | DOM text nodes | Canvas-only — no DOM text. Use `graphCanvas.getAttribute('aria-label')` as viewport proxy |

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
- **Selector missing from live DOM** — check the table above, then `browser_snapshot`.
  If still unresolved, mark `// selector unverified — confirm against live DOM`.
- **Selector matches multiple elements** — scope to a container and use `.filter()`.
  Use `.first()` only when DOM ordering is deterministic by design (e.g. POI labels
  sorted by x-coordinate).
- **Existing POM / fixture / spec** — read before writing; extend, do not replace.
- **Existing `constants.ts` / `testData.ts` / `cssConstant.ts`** — read before
  writing; add exports, do not overwrite existing ones.
- **Mixed-type test case set for one feature** — create one spec file per type in
  the matching `src/tests/{type}/` folder. Never merge smoke + regression or
  regression + e2e into a single file.
- **Migrating an old flat spec** — if a spec exists at `src/tests/[feature].spec.ts`,
  classify each test by its source `docs/testCases/{type}/` folder and move it
  to `src/tests/{type}/{feature}.spec.ts`. Delete the old flat file after migration.
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
| `.claude/playwright-testScript-creation/dom-gotchas.md` | Any selector or interaction fails or behaves unexpectedly |
| `docs/testCases/{type}/{feature}/[TC-ID].md` | Load the specific test cases being implemented |
| `src/pages/[PageName].ts` | Always before creating or modifying a Page Object |
| `src/utils/fixtures/[name].fixture.ts` | Always before creating or modifying a fixture |
| `src/tests/{type}/{feature}.spec.ts` | Always before creating or modifying a spec file |
| `src/testData/constants.ts` | Always before writing any selector, timeout, or aria-label |
| `src/testData/testData.ts` | Always before writing any input value or expected assertion value |
| `src/testData/cssConstant.ts` | Always before writing any `toHaveAttribute()` call |
