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

This skill reads structured test case `.md` files from `docs/testCases/`, uses
Playwright MCP to navigate the live Desmos Graphing Calculator to validate
selectors and interaction flows in real-time, then generates production-ready
TypeScript files following the project's Page Object Model (POM) + fixture
architecture. It groups test cases by feature area to produce one spec file,
one Page Object class, and one fixture per logical UI component — keeping
the codebase organised and avoiding duplication.

---

## Workflow

Follow these steps in order:

1. **Load reference context** — Read `docs/projectContext.md` to ground all
   selector choices, input strategies, and assertion patterns in the actual
   application before writing any code. This file is the authoritative source
   for Desmos selectors, known challenges, and testing constraints.
2. **Discover and group test cases** — Use Glob to list all `.md` files under
   `docs/testCases/`. Organise by `[feature-folder]` (second-level directory,
   e.g. `expression-entry`). Each feature folder maps to exactly one spec file,
   one Page Object class, and one fixture file. Collect test cases from all
   test-type subdirectories (`smoke/`, `regression/`, `e2e/`, `performance/`)
   that share the same feature folder.
3. **Read each target test case file** — Parse every relevant `.md` file and
   extract: Test Case ID, Summary, Priority, Preconditions, Test Steps table
   (action + expected result per row), and Notes for Automation (selector,
   input method, assertion strategy, wait strategy).
4. __Validate selectors against the live app__ — Use `browser_navigate` to open
   `https://www.desmos.com/calculator`. For each unique CSS class or aria-label
   referenced in test cases, use `browser_snapshot` to capture the accessibility
   tree and confirm the selector is present. If a selector does not match the
   live DOM, find the correct one from the snapshot and use it. Note corrections
   as inline comments in the generated code.
5. **Identify required Page Object methods** — From the Test Steps, extract the
   distinct user-level actions (e.g. "type an expression", "click color icon",
   "press Enter"). Map each to a POM method using verb-first naming
   (`typeExpression`, `hideExpression`, `openStyleMenu`). Check if a Page Object
   for this feature already exists at `src/pages/` — if so, read it first to
   avoid duplicating or overwriting existing methods.
6. **Create or update the Page Object class** — Write the POM file to
   `src/pages/[PageName].ts` using the class template in the Output format
   section. Group locators by UI region with comment headers. Methods must
   represent user-level actions, not raw clicks. Never add assertions inside
   the POM. Apply the selector priority order (see Output format).
7. **Create or update the fixture** — Write or update
   `src/utils/fixtures/[kebab-name].fixture.ts` to expose the Page Object via a
   typed Playwright fixture. Read the existing fixture first if it exists — add
   the new Page Object type rather than replacing the file.
8. **Generate the test spec file** — Write `src/tests/[feature-name].spec.ts`.
   Use one top-level `test.describe('[Feature Name]')`. Use `test.beforeEach()`
   for navigation (call `goto()` on the fixture). Each test case becomes one
   `test('should [verb] [what]', ...)` — derive the title from the TC Summary.
   Arrange, Act, Assert pattern. Import `test` and `expect` from the fixture
   file only — never from `@playwright/test` directly. Read the existing spec
   file first if it exists and append within the correct `test.describe()`.
9. __Verify complex interactions with MCP__ — For test cases involving MathQuill
   input, keyboard shortcuts, canvas clicks, drag operations, or style menus,
   replay the interaction live using `browser_type`, `browser_press_key`,
   `browser_click`, or `browser_evaluate`. Confirm the expected DOM change
   occurs and adjust generated code if the live run reveals a different approach
   is needed.
10. **Final file validation** — After writing all files, confirm:

   - All files live under paths matching CLAUDE.md sections 2 and 3
   - No `import` from `@playwright/test` directly in test spec files
   - No `locator.fill()` on MathQuill fields — `keyboard.type()` only
   - No canvas pixel assertions — DOM proxy signals only
   - No `test.only()` or `page.pause()` in any committed file
   - `goto()` always calls `waitForCalculatorLoad()` internally

---

## Output format

### Page Object class — `src/pages/[PageName].ts`

```typescript
import { Page, Locator } from '@playwright/test';

export class [PageName]Page {
  readonly page: Page;

  // [UI Region — e.g. Expression List]
  readonly [locatorName]: Locator;
  readonly [locatorName]: Locator;

  // [UI Region — e.g. Toolbar]
  readonly [locatorName]: Locator;

  constructor(page: Page) {
    this.page = page;
    // Selector priority: aria-label > role > .dcg-* class > generic CSS
    this.[locatorName] = page.locator('[aria-label="..."]');
    this.[locatorName] = page.locator('.dcg-...');
  }

  async goto() {
    await this.page.goto('/');
    await this.waitForCalculatorLoad();
  }

  private async waitForCalculatorLoad() {
    await this.page.locator('.dcg-expressionlist').waitFor({ state: 'visible' });
  }

  // User-level actions — one method per distinct user intention
  async [userActionMethod](arg?: string): Promise<void> {
    // keyboard.type() for MathQuill; never locator.fill()
    // no assertions inside methods
  }
}
```

**Selector priority order (CLAUDE.md §5 — strictly enforced):**

1. `[aria-label="..."]` — preferred
2. `page.getByRole('button', { name: '...' })` — for interactive elements
3. `.dcg-[class]` — Desmos-specific CSS classes
4. Generic CSS — only when no stable alternative exists
5. XPath — never

### Fixture file — `src/utils/fixtures/[name].fixture.ts`

```typescript
import { test as base } from '@playwright/test';
import { [PageName]Page } from '../../pages/[PageName]';

type Fixtures = {
  [camelCaseName]: [PageName]Page;
};

export const test = base.extend<Fixtures>({
  [camelCaseName]: async ({ page }, use) => {
    const [camelCaseName] = new [PageName]Page(page);
    await use([camelCaseName]);
  },
});

export { expect } from '@playwright/test';
```

### Test spec file — `src/tests/[feature-name].spec.ts`

```typescript
import { test, expect } from '../utils/fixtures/[name].fixture';

test.describe('[Feature Name]', () => {
  test.beforeEach(async ({ [camelCaseName] }) => {
    await [camelCaseName].goto();
  });

  // TC-[ID] | Priority [N]
  test('should [verb] [what]', async ({ [camelCaseName] }) => {
    // Arrange — any setup not covered by beforeEach

    // Act
    await [camelCaseName].[actionMethod]();

    // Assert — prefer locator-based matchers; never canvas pixel assertions
    await expect([camelCaseName].[locator]).toBeVisible();
  });
});
```

### MathQuill input — always use this pattern (never `locator.fill()`)

```typescript
await expressionField.click();
await page.keyboard.type('y=x^2');
await page.waitForTimeout(300); // MathQuill needs time to process
```

### Canvas assertion — DOM proxy signals only (never pixel data)

```typescript
// No error after valid expression
await expect(page.locator('.dcg-expressionitem .dcg-error')).not.toBeVisible();

// Slider appears after undefined variable in expression
await expect(page.locator('.dcg-slider-play-btn')).toBeVisible();

// POI tooltip contains expected coordinate text
await expect(page.locator('.dcg-trace-coordinates')).toContainText('(2, 0)');

// Visibility state changed on expression icon
await expect(expressionIcon).toHaveClass(/hidden/);
```

---

## Feature → file mapping reference

| Feature folder (`docs/testCases/`) | Page Object | Fixture file | Spec file |
|---|---|---|---|
| `expression-entry` | `CalculatorPage.ts` | `calculator.fixture.ts` | `expression-entry.spec.ts` |
| `graph-settings` | `GraphSettingsPage.ts` | `graph-settings.fixture.ts` | `graph-settings.spec.ts` |
| `sliders-animations` | `SlidersPage.ts` | `sliders.fixture.ts` | `sliders-animations.spec.ts` |
| `save-load-share` | `SharePage.ts` | `share.fixture.ts` | `save-load-share.spec.ts` |

When a new feature folder appears that is not listed here, derive the Page
Object name as `[PascalCaseFeature]Page`, fixture as `[kebab-case].fixture.ts`,
and spec as `[kebab-case].spec.ts`.

---

## Examples

**Example 1 — single test case by ID:**

Input: *"Generate a Playwright test script for TC-E1-01-001"*

Expected result:

- Reads `docs/testCases/smoke/expression-entry/TC-E1-01-001-*.md`
- Navigates live app, confirms `.dcg-mq-editable-field` exists in DOM
- Creates `src/pages/CalculatorPage.ts` with `expressionField` locator and
   `typeExpression(text: string)` method using `page.keyboard.type()`
- Creates `src/utils/fixtures/calculator.fixture.ts` exposing `calculatorPage`
- Creates `src/tests/expression-entry.spec.ts` with:
   `test('should render a parabola when y=x^2 is typed', ...)`
- Test asserts `.dcg-expressionitem .dcg-error` is NOT visible; no pixel assert

**Example 2 — all test cases for a feature:**

Input: *"Create Playwright tests for all expression-entry test cases"*

Expected result:

- Globs all `.md` files from `smoke/expression-entry/` and
   `regression/expression-entry/` — finds 21 test cases
- Single MCP pass validates all unique selectors in live DOM
- Produces one `CalculatorPage.ts` with all locators and methods
- Produces one `calculator.fixture.ts`
- Produces one `expression-entry.spec.ts` with 21 `test()` blocks inside
   `test.describe('Expression Entry')`, grouped by sub-feature with nested
   `test.describe()` blocks (entry, edit, add line, visibility, style, trace)

**Example 3 — implicit feature reference:**

Input: *"Automate the hide and show expression tests"*

Expected result:

- Identifies TC-E1-04-001 through TC-E1-04-004 in
   `docs/testCases/regression/expression-entry/`
- Reads existing `CalculatorPage.ts`, adds `hideExpression()`,
   `showExpression()`, `toggleVisibilityViaKeyboard()` methods
- Appends 4 tests to `expression-entry.spec.ts` inside a nested
   `test.describe('Visibility toggle')`
- Verifies `.dcg-expression-icon` selector in live browser before writing

---

## Edge cases

- **Test case file not found**: List available feature folders under
   `docs/testCases/` and ask the user to confirm. Never invent test cases.
- __Selector missing from live DOM__: Use `browser_snapshot` to find the correct
   selector. Use the live-verified value and add comment
   `// corrected from test case: [original selector]`.
- **Page Object already exists**: Read it first. Add new locators and methods
   without renaming or removing existing ones.
- **Fixture already exists**: Read it first. Extend the `Fixtures` type with
   the new entry rather than overwriting the file.
- **Spec file already exists**: Read it first. Append within the matching
   `test.describe()`. Never delete existing tests.
- **MathQuill field targeted**: Always `keyboard.type()`. Add
   `page.waitForTimeout(300)` after typing. Never `locator.fill()`.
- **Canvas interaction required**: Assert via DOM proxy signals only. Document
   what the canvas should show in a comment, then verify via the DOM equivalent.
- **Test requires Desmos account login**: Skip and inform the user. Auth-
   dependent tests are out of scope unless explicitly requested.
- **testData.json present next to a test case**: Read it and write the values
   to `src/testData/testData.ts` as named exports for use in the spec.
- **No MCP browser connection available**: Fall back to selectors from
   `docs/projectContext.md`. Mark each unverified selector:
   `// selector unverified — confirm against live DOM before committing`.
- **Multiple feature folders requested**: Process one feature folder at a time
   in alphabetical order. Complete all three files per feature before moving on.

---

## Reference files

Load only when relevant to the current task:

| File | Load when |
|------|-----------|
| `docs/projectContext.md` | Always — load at Step 1 before writing any code |
| `docs/testCases/[type]/[feature]/[TC-ID].md` | Load the specific test case files being implemented |
| `src/pages/[PageName].ts` | Always before creating or modifying a Page Object |
| `src/utils/fixtures/[name].fixture.ts` | Always before creating or modifying a fixture |
| `src/tests/[feature].spec.ts` | Always before creating or modifying a spec file |
| `src/testData/testData.ts` | When test cases reference external data values from testData.json |
