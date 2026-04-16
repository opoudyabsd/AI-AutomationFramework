# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## 1. Project Overview

**Target:** Playwright E2E and API test automation for [Desmos Graphing Calculator](https://www.desmos.com/calculator)
**Framework:** Playwright + TypeScript
**Pattern:** Page Object Model (POM) with Playwright Fixtures (UI); Harness-page fixtures with `page.evaluate` proxies (API)
**Full app context:** `docs/projectContext.md` — read this before writing any UI test
**API reference:** `docs/desmosAPI/Desmos-api-v1.11.md` — read this before writing any API test or test case

---

## 2. Commands

`package.json` has no npm scripts defined — use `npx` directly.

```bash
# Run all tests (headless)
npx playwright test

# Run with visible browser
npx playwright test --headed

# Interactive UI mode
npx playwright test --ui

# Single spec file
npx playwright test src/tests/regression/expression-entry.spec.ts

# Single test by name
npx playwright test -g "should render a parabola"

# Run only API tests
npx playwright test src/tests/api/

# Specific browser only
npx playwright test --project=chromium
npx playwright test --project=firefox

# View last HTML report
npx playwright show-report
```

---

## 3. Folder Structure

```
src/
  pages/                    # Page Object Model classes (.ts)
    CalculatorPage.ts
    GraphSettingsPage.ts
  testData/
    constants.ts            # Selectors, ARIA labels, timeouts, keyboard shortcuts (UI)
    cssConstant.ts          # CSS attribute names and values (aria-label, aria-checked, etc.)
    testData.ts             # Test scenario inputs and expected values (UI tests)
    apiConfig.ts            # Harness-level config for API tests (API version, container ID, sizes)
    apiTestData.ts          # Test scenario inputs for API tests (expressions, bounds, expected values)
  tests/                    # All .spec.ts files, organised by test type
    smoke/                  # First critical happy-path test per feature
    regression/             # All other functional UI tests
    e2e/                    # Multi-feature cross-cutting flows
    performance/            # (reserved) speed / throughput tests
    api/                    # Desmos JavaScript Embed API contract tests
      {feature}/            # One subfolder per API feature area (e.g. calculator-core)
  utils/
    fixtures/               # Playwright custom fixtures
      calculator.fixture.ts
      graph-settings.fixture.ts
      e2e-graph-settings.fixture.ts
      api-calculator.fixture.ts
    helpers/                # (reserved) Pure utility functions — no Playwright imports
docs/
  userstory/                # User story .md files per feature
  testCases/                # UI test case specs — one .md per scenario
    {type}/                 # smoke | regression | e2e | performance (only these 4)
      {feature}/
        TC-*.md
        testData.json       # (optional) external data for that test case
  APITestCases/             # API test case specs, mirroring src/tests/api/ structure
    {feature}/
      TC-API-[AREA]-[NNN]-[kebab-case-title].md
  desmosAPI/
    Desmos-api-v1.11.md     # Desmos JavaScript Embed API reference — READ-ONLY
  projectContext.md         # Desmos selectors, features, known challenges — READ-ONLY
  reviewReport/
    INDEX.md                # Review report index
    runs/                   # Individual review run reports (REVIEW-YYYY-MM-DD-{type}.md)
playwright.config.ts
.env                        # Local secrets (DESMOS_API_KEY=...) — never commit this file
.github/
  agents/                   # GitHub Copilot agents ({kebab-name}.agent.md)
  workflows/                # GitHub Actions workflows
.claude/
  {skill-name}/SKILL.md    # Claude Code context skills (auto-triggered, not slash commands)
  settings.json             # Claude Code MCP server config
  memory/                   # Claude auto-memory (persists across sessions)
```

**Rules:**
- Never place test logic (`test()`, assertions) inside `pages/` or `helpers/`.
- One Page Object class per logical page/component.
- One fixture file per logical grouping.
- Always update this file when adding a new `src/tests/{type}/` subfolder, agent, or fixture.

---

## 4. File Naming Conventions

| Type | Location | Convention | Example |
|------|----------|------------|---------|
| Test spec (UI) | `src/tests/{smoke\|regression\|e2e\|performance}/` | `kebab-case.spec.ts` | `src/tests/regression/expression-entry.spec.ts` |
| Test spec (API) | `src/tests/api/{feature}/` | `kebab-case.spec.ts` | `src/tests/api/calculator-core/calculator-core.spec.ts` |
| Page Object | `src/pages/` | `PascalCase.ts` | `CalculatorPage.ts` |
| Fixture | `src/utils/fixtures/` | `kebab-case.fixture.ts` | `calculator.fixture.ts` |
| Helper | `src/utils/helpers/` | `camelCase.ts` | `mathInput.ts` |
| UI test case doc | `docs/testCases/{type}/{feature}/` | `TC-[ID]-kebab-case-title.md` | `TC-E1-01-001-type-quadratic-function.md` |
| API test case doc | `docs/APITestCases/{feature}/` | `TC-API-[AREA]-[NNN]-kebab-case-title.md` | `TC-API-CORE-001-initialize-graphing-calculator.md` |
| Copilot agent | `.github/agents/` | `kebab-name.agent.md` | `desmos-api-testcase-creator.agent.md` |

---

## 5. Test Writing Conventions

```typescript
// Import path is relative to the spec's subdirectory (e.g. src/tests/regression/)
import { test, expect } from '../../utils/fixtures/calculator.fixture';
// Always import from the fixture — never directly from @playwright/test

test.describe('Feature Name', () => {
  test.beforeEach(async ({ calculatorPage }) => {
    await calculatorPage.goto();
  });

  test('should do something specific', async ({ calculatorPage, page }) => {
    // Arrange, Act, Assert
  });
});
```

**Rules:**
- Use `test.describe()` for every spec file — group by feature.
- Use `test.beforeEach()` for navigation; never navigate inside individual tests.
- Test names: `'should <verb> <what>'` (e.g. `'should display expression list'`).
- Prefer `expect(locator).toBeVisible()` over `expect(await locator.isVisible()).toBe(true)`.
- `waitForTimeout()` only as a last resort — prefer `waitFor`, `toBeVisible`, `toHaveCount`.
- Never commit `page.pause()` or `test.only()`.
- One logical assertion concept per test.

---

## 6. Page Object Model Conventions

```typescript
import { Page, Locator } from '@playwright/test';

export class CalculatorPage {
  readonly page: Page;

  // Expression List
  readonly expressionList: Locator;

  constructor(page: Page) {
    this.page = page;
    this.expressionList = page.locator('.dcg-expressionlist');
  }

  async goto() {
    await this.page.goto('/');
    await this.waitForCalculatorLoad();
  }

  private async waitForCalculatorLoad() {
    await this.page.locator('.dcg-expressionlist').waitFor({ state: 'visible' });
  }

  async typeExpression(text: string) {
    await this.page.locator('.dcg-mq-editable-field').click();
    await this.page.keyboard.type(text);
    await this.page.waitForTimeout(300); // MathQuill render delay
  }
}
```

**Rules:**
- All locators: `readonly` class properties, defined in the constructor.
- Methods represent user-level actions, not raw clicks (`typeExpression()` not `clickMathField()`).
- `goto()` must always call `waitForCalculatorLoad()` internally.
- No assertions inside Page Objects.
- Selector priority: `aria-label` → `role` → `.dcg-*` class → generic CSS → XPath (never).

---

## 7. Fixture Conventions

```typescript
// src/utils/fixtures/calculator.fixture.ts
import { test as base } from '@playwright/test';
import { CalculatorPage } from '../../pages/CalculatorPage';

type Fixtures = { calculatorPage: CalculatorPage };

export const test = base.extend<Fixtures>({
  calculatorPage: async ({ page }, use) => {
    const calculatorPage = new CalculatorPage(page);
    await use(calculatorPage);
  },
});

export { expect } from '@playwright/test';
```

- Test files import `test` and `expect` from the fixture file only.
- Never instantiate Page Objects directly inside test files.

---

## 8. Desmos-Specific Testing Rules

### MathQuill Input

MathQuill is **not** a native `<input>`. Always use `keyboard.type()`:

```typescript
await mathInputField.click();
await page.keyboard.type('y=x^2');
await page.waitForTimeout(300); // required — MathQuill renders asynchronously
```

Never use `locator.fill()` on MathQuill fields.

**Select-all in MathQuill:** `Ctrl+A` does nothing. Use `End` → `Shift+Home` to select the full expression content before overwriting or deleting:

```typescript
await mathInputField.click();
await page.keyboard.press('End');
await page.keyboard.press('Shift+Home');
await page.keyboard.type(newText); // or press('Backspace') to clear
await page.waitForTimeout(300);
```

### Canvas Assertions

The graph is HTML5 Canvas — never assert pixel content. Use DOM proxy signals:

```typescript
// Valid expression rendered — no error present
// Errors render as role="note" inside the expression item; absent when expression is valid
await expect(calculatorPage.expressionError).not.toBeVisible(); // expressionError = getByRole('note')

// Undefined variable created a slider
await expect(page.locator('.dcg-slider-play-btn')).toBeVisible();

// POI tooltip coordinates — use Export-button grandparent; .dcg-trace-coordinates no longer exists
// Negative values use Unicode minus U+2212, not ASCII hyphen
await expect(calculatorPage.traceCoordinates).toContainText('2, 0');
```

Screenshot comparison is acceptable for visual regression if tolerance is set.

### Key Selectors

```ini
Expression list:    .dcg-expressionlist
Expression item:    .dcg-expressionitem[expr-id]   (filter real rows — omit [expr-id] to match all)
Math input field:   .dcg-mq-editable-field
Expression error:   getByRole('note')              (.dcg-error is absent from live DOM)
Add Item button:    getByRole('button', { name: 'Add Item' })
Graph canvas:       .dcg-graph-outer[role="img"]   (two .dcg-graph-outer exist; only one has role="img")
Zoom In:            getByRole('button', { name: 'Zoom In' })
Zoom Out:           getByRole('button', { name: 'Zoom Out' })
Reset View:         getByRole('button', { name: 'Default Viewport' })   (NOT "Reset to Default View")
Share:              getByRole('button', { name: 'Share Graph' })
Keypad open:        getByRole('button', { name: 'Open Keypad' })
Slider play:        .dcg-slider-play-btn
Eye toggle:         .dcg-expression-icon-container  (.dcg-expression-icon is visual-only, non-interactable)
Color swatch:       .dcg-color-tile                 (role="option"; .dcg-color-option does not exist)
POI coordinates:    Export-button grandparent — getByRole('button', { name: 'Export point…' }).locator('../..')
```

Always verify against live DOM before hardcoding — Desmos may update class names.

---

## 9. API Test Conventions

API tests exercise the [Desmos JavaScript Embed API](docs/desmosAPI/Desmos-api-v1.11.md) through a Playwright harness page. They live under `src/tests/api/{feature}/` and use `src/utils/fixtures/api-calculator.fixture.ts`.

### Environment variables

The Desmos API key is loaded from `.env` — never hardcode it:

```bash
# .env (local only — never commit)
DESMOS_API_KEY=your_key_here
```

Fixtures load secrets via `import 'dotenv/config'` before reading `process.env`. If `DESMOS_API_KEY` is missing, the fixture must fail fast with a clear error.

### Test data separation

Keep two distinct files — they change for different reasons:

| File | Contents | Changes when |
|------|----------|-------------|
| `src/testData/apiConfig.ts` | API version, container ID, container dimensions | Harness infrastructure changes |
| `src/testData/apiTestData.ts` | Expressions, bounds, expected state values | Test scenarios change |

Never put harness config in `apiTestData.ts` or test scenario inputs in `apiConfig.ts`.

### Fixture: harness page and CDN load guard

The fixture navigates to `about:blank`, injects Desmos via CDN, and guards the load with an **explicit timeout**. Without the timeout, CDN failures produce cryptic "Desmos is not defined" errors in every test instead of one clear `TimeoutError`.

```typescript
await page.waitForFunction(
  () => typeof (window as any).Desmos !== 'undefined',
  { timeout: 15_000 }, // explicit timeout — required
);
```

### Fixture: window global isolation

The calculator instance lives as a browser-side `window` global. Use a **namespaced, randomized key** to prevent state pollution across tests that share a browser context:

```typescript
// ✅ Correct — unique per fixture instance
const globalKey = `__testCalc_${Math.random().toString(36).slice(2, 8)}`;

await page.evaluate(({ containerId, key }) => {
  const el = document.getElementById(containerId);
  (window as any)[key] = (window as any).Desmos.GraphingCalculator(el);
}, { containerId: 'calculator', key: globalKey });

// Pass globalKey as a parameter to every subsequent evaluate() call
await page.evaluate((key) => (window as any)[key].setExpression(...), globalKey);
```

Cleanup must delete **both** the calculator key and any auxiliary keys (e.g. event arrays):

```typescript
delete (window as any)[key];
delete (window as any)[`${key}_events`];
```

### Fixture: proxy completeness

Before writing any test, read **every TC in the feature folder**, list all Desmos API methods they require, and proxy them all in the fixture. Fixing an incomplete proxy mid-implementation forces risky fixture rewrites.

### TypeScript safety

Use `unknown` (not `any`) for opaque Desmos objects. Use `Record<string, unknown>` for settings and options until a stricter shape is known:

```typescript
// ✅ Correct
getState: () => Promise<unknown>;
setState: (state: unknown) => Promise<void>;
updateSettings: (opts: Record<string, unknown>) => Promise<void>;

// ❌ Wrong — bypasses TypeScript safety
getState: () => Promise<any>;
```

### TC reference convention

Place the TC reference in a comment block **above** the `test()` call, not inside the test name string:

```typescript
// ─────────────────────────────────────────────────────────────────────────────
// TC-API-CORE-001 | Priority 5
// Initialize GraphingCalculator with default options.
// ─────────────────────────────────────────────────────────────────────────────
test(
  'should initialize graphing calculator and perform a setExpression/getExpressions round-trip',
  { tag: ['@Positive'] },
  async ({ calculator }) => { /* ... */ },
);
```

### Coverage status comment

Every API spec file must start with a coverage comment listing all TCs and their automation status. Update it every time a test is added or skipped:

```typescript
// Coverage status for calculator-core API (as of YYYY-MM-DD):
//   TC-API-CORE-001 ✅ automated — constructor init, setExpression/getExpressions round-trip
//   TC-API-CORE-002 ⏳ pending   — setState behavior
//   TC-API-CORE-003 ⏳ pending   — invalid bounds rejection
```

### Tagging

Suite-level tags go on `test.describe()`; polarity tags go on individual `test()` calls:

```typescript
test.describe('Calculator Core API', { tag: ['@CalculatorCore', '@API'] }, () => {
  test('should ...', { tag: ['@Positive'] }, async ({ calculator }) => { /* ... */ });
});
```

### Async assertions: polling over fixed sleeps

For assertions that depend on async browser events, use bounded `waitForFunction` polling, not `waitForTimeout`. Reserve `waitForTimeout` for cases where no DOM proxy exists (document why):

```typescript
// ✅ Correct — bounded polling
await page.waitForFunction(
  ({ key, n }) => ((window as any)[`${key}_events`] ?? []).length >= n,
  { key: globalKey, n: minCount },
  { timeout: 5_000 },
);

// ⚠️ Last resort only — document why
// Brief quiescence window — no DOM proxy exists for "observer did not fire".
await page.waitForTimeout(300);
```

### Playwright matchers over manual checks

```typescript
// ✅ Correct
expect(expressions).toBeInstanceOf(Array);

// ❌ Wrong — poor error output
expect(Array.isArray(expressions)).toBe(true);
```

---

## 10. GitHub Copilot Agents

Agents live in `.github/agents/` as `{kebab-name}.agent.md` files. They are invoked through GitHub Copilot and VS Code. Each agent has a `description` field that determines when Copilot suggests it.

### Available agents

| Agent file | Trigger / purpose |
|-----------|-------------------|
| `desmos-api-testcase-creator.agent.md` | Create automation-ready API test case `.md` files from `docs/desmosAPI/Desmos-api-v1.11.md`. Use before writing API automation. |
| `playwright-api-script-generator.agent.md` | Turn `docs/APITestCases/{feature}/` markdown into Playwright + TypeScript spec files. Use after test cases are written. |
| `desmos-selector-validator.agent.md` | Validate, refresh, or recommend Playwright locators for the Desmos calculator against the live DOM before generating or repairing tests. |
| `playwright-test-coverage-auditor.agent.md` | Compare documented test cases with implemented Playwright specs to surface missing, stale, or mismatched coverage. |
| `playwright-test-generator.agent.md` | Generate Playwright spec files from a structured test plan. |
| `playwright-test-healer.agent.md` | Debug and fix failing Playwright tests. |
| `playwright-test-planner.agent.md` | Create a comprehensive test plan for a web application or feature. |

### Recommended workflow for new API coverage

1. `desmos-api-testcase-creator` → produces `docs/APITestCases/{feature}/TC-API-*.md`
2. `playwright-api-script-generator` → produces `src/tests/api/{feature}/{feature}.spec.ts`
3. `playwright-test-coverage-auditor` → verifies no TC is missing from the spec

### Agent authoring rules

1. **File location:** `.github/agents/{kebab-name}.agent.md`
2. **Required frontmatter fields:** `name`, `description`, `tools`, `model`
3. **Never create an empty agent body.** The agent must contain a complete system prompt before the first commit.
4. **After creating or updating an agent**, update the agent table above.
5. **`tools` must only list tools available in the Copilot environment.** Do not list MCP tools that are not registered.

---

## 11. Playwright Config

- `testDir`: `./src/tests`
- `baseURL`: `https://www.desmos.com/calculator`
- `timeout`: 60000ms | `actionTimeout`: 15000ms | `navigationTimeout`: 30000ms
- `screenshot: 'only-on-failure'` | `video: 'on-first-retry'` | `trace: 'on-first-retry'`
- Active browsers: `chromium` and `firefox` only. Do not add others without discussion.
- Do not modify `playwright.config.ts` without being explicitly asked.

---

## 12. Skill Authoring Rules

Project skills live in `.claude/{skill-name}/SKILL.md`. They are **context skills** — Claude reads them automatically at session start based on `name` + `description`. They are NOT slash commands and cannot be invoked via the `Skill` tool.

**Rules when creating or editing a skill:**

1. **`name` field must exactly match the folder name** (byte-for-byte, including casing). Use `ls .claude/` to confirm the folder casing before writing the `name:` field.
2. **Never commit an empty SKILL.md.** The file must contain the full frontmatter and body before the first commit.
3. **If the skill uses MCP tools** (e.g. `playwright-test/browser_*`), the MCP server must be registered in `.claude/settings.json` before listing those tools in `allowed-tools`. The `.vscode/mcp.json` is for VS Code only — Claude Code does not read it.
4. **`allowed-tools` restricts which tools the skill may use.** List only tools that are available in the current environment.

### UI feature → file mapping

Spec files live under `src/tests/{smoke|regression|e2e|performance}/` — the feature name is the file name.

| Feature folder (`docs/testCases/`) | Page Object | Fixture(s) | Spec file(s) |
|------------------------------------|-------------|------------|--------------|
| `expression-entry` | `CalculatorPage.ts` | `calculator.fixture.ts` | `expression-entry.spec.ts` |
| `graph-settings` | `GraphSettingsPage.ts` | `graph-settings.fixture.ts` | `graph-settings.spec.ts` |
| `graph-settings` (e2e) | Both of the above | `e2e-graph-settings.fixture.ts` (composite) | `graph-settings.spec.ts` under `e2e/` |
| `sliders-animations` | `SlidersPage.ts` | `sliders.fixture.ts` | `sliders-animations.spec.ts` |
| `save-load-share` | `SharePage.ts` | `share.fixture.ts` | `save-load-share.spec.ts` |

### API feature → file mapping

All API features share `api-calculator.fixture.ts`.

| Feature folder (`docs/APITestCases/`) | Fixture | Spec file |
|---------------------------------------|---------|-----------|
| `calculator-core` | `api-calculator.fixture.ts` | `src/tests/api/calculator-core/calculator-core.spec.ts` |
| `viewport-coordinates` | `api-calculator.fixture.ts` | `src/tests/api/viewport-coordinates/viewport-coordinates.spec.ts` |

---

## 13. Hard Rules

### General
- Do not create test files outside `src/tests/`.
- Do not place Page Objects in `src/tests/`.
- Do not write tests that depend on a Desmos account unless explicitly asked.
- Do not assert on canvas pixel data.
- Do not use XPath selectors.
- Do not import from `@playwright/test` directly in test files — always import from the fixture.
- Do not create new files or directories outside the defined structure without asking first.
- Do not modify `docs/projectContext.md` — it is read-only reference.
- Do not modify `docs/desmosAPI/Desmos-api-v1.11.md` — it is read-only reference.
- Always update CLAUDE.md (§3, §4, §12) when adding a new `src/tests/{type}/` subfolder, fixture, or agent.

### API tests
- Do not hardcode `DESMOS_API_KEY` or any secret anywhere in source files — load from `.env` via `process.env` only.
- Do not commit `.env`.
- Do not use `any` for opaque Desmos state objects — use `unknown`; use `Record<string, unknown>` for settings/options.
- Do not mix harness config (`apiConfig.ts`) with test scenario data (`apiTestData.ts`).
- Always add a coverage status comment at the top of every API spec file listing all TCs with ✅ / ⏳ status.
- Do not commit a skeleton API spec with only partial TC coverage and no coverage status comment.
- Always place TC references in a comment block above the `test()` call — never embed TC IDs inside the test name string.
