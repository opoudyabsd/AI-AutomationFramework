# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## 1. Project Overview

**Target:** Playwright E2E test automation for [Desmos Graphing Calculator](https://www.desmos.com/calculator)
**Framework:** Playwright + TypeScript
**Pattern:** Page Object Model (POM) with Playwright Fixtures
**Full app context:** `docs/projectContext.md` — read this before writing any test

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
  testData/
    constants.ts       # Selectors, ARIA labels, timeouts, keyboard shortcuts
    testData.ts        # Test-scoped input values and expected results
    cssConstant.ts     # CSS attribute names and values (aria-label, aria-checked, etc.)
  pages/               # Page Object Model classes (.ts)
  testData/
    apiConfig.ts       # Harness-level config for API tests (API version, container ID, sizes)
  tests/               # All .spec.ts test files, organised by test type:
    smoke/             # First critical happy-path test per feature
    regression/        # All other functional tests
    e2e/               # Multi-feature cross-cutting flows
    performance/       # (reserved) speed / throughput tests
    api/               # Desmos JavaScript Embed API contract tests
      {feature}/       # one subfolder per API feature area (e.g. calculator-core)
  utils/
    fixtures/          # Playwright custom fixtures
    helpers/           # (reserved) Pure utility functions — no Playwright imports
docs/
  userstory/           # User story .md files per feature
  testCases/           # One .md file per test case, organised as:
    {type}/            # smoke | regression | e2e | performance (only these 4)
      {feature}/
        testCase.md
        testData.json  # (optional) external data for that test case
  APITestCases/        # API-specific test case specs, mirroring src/tests/api/ structure
    {feature}/
      TC-API-*.md
  projectContext.md    # Desmos selectors, features, known challenges — READ-ONLY
playwright.config.ts
.claude/
  {skill-name}/SKILL.md   # Project context skills (auto-triggered, not slash commands)
  settings.json            # Claude Code MCP server config
```

**Rules:**
- Never place test logic (`test()`, assertions) inside `pages/` or `helpers/`.
- One Page Object class per logical page/component.
- One fixture file per logical grouping.

---

## 4. File Naming Conventions

| Type        | Location                                        | Convention              | Example                                           |
|-------------|-------------------------------------------------|-------------------------|---------------------------------------------------|
| Test spec (UI)  | `src/tests/{smoke\|regression\|e2e\|performance}/` | `kebab-case.spec.ts` | `src/tests/regression/expression-entry.spec.ts`  |
| Test spec (API) | `src/tests/api/{feature}/`                         | `kebab-case.spec.ts` | `src/tests/api/calculator-core/calculator-core.spec.ts` |
| Page Object | `src/pages/`              | `PascalCase.ts`         | `CalculatorPage.ts`        |
| Fixture     | `src/utils/fixtures/`     | `kebab-case.fixture.ts` | `calculator.fixture.ts`    |
| Helper      | `src/utils/helpers/`      | `camelCase.ts`          | `mathInput.ts`             |

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

## 9. Playwright Config

- `testDir`: `./src/tests`
- `baseURL`: `https://www.desmos.com/calculator`
- `timeout`: 60000ms | `actionTimeout`: 15000ms | `navigationTimeout`: 30000ms
- `screenshot: 'only-on-failure'` | `video: 'on-first-retry'` | `trace: 'on-first-retry'`
- Active browsers: `chromium` and `firefox` only. Do not add others without discussion.
- Do not modify `playwright.config.ts` without being explicitly asked.

---

## 10. Skill Authoring Rules

Project skills live in `.claude/{skill-name}/SKILL.md`. They are **context skills** — Claude reads them automatically at session start based on `name` + `description`. They are NOT slash commands and cannot be invoked via the `Skill` tool.

**Rules when creating or editing a skill:**

1. **`name` field must exactly match the folder name** (byte-for-byte, including casing). Use `ls .claude/` to confirm the folder casing before writing the `name:` field.
2. **Never commit an empty SKILL.md.** The file must contain the full frontmatter and body before the first commit.
3. **If the skill uses MCP tools** (e.g. `playwright-test/browser_*`), the MCP server must be registered in `.claude/settings.json` before listing those tools in `allowed-tools`. The `.vscode/mcp.json` is for VS Code only — Claude Code does not read it.
4. **`allowed-tools` restricts which tools the skill may use.** List only tools that are available in the current environment.

Feature → file mapping for this project:

Spec files live under `src/tests/{smoke|regression|e2e|performance}/` — the feature name is the file name.

| Feature folder (`docs/testCases/`) | Page Object            | Fixture(s)                                                  | Spec file(s)              |
|------------------------------------|------------------------|-------------------------------------------------------------|---------------------------|
| `expression-entry`                 | `CalculatorPage.ts`    | `calculator.fixture.ts`                                     | `expression-entry.spec.ts` |
| `graph-settings`                   | `GraphSettingsPage.ts` | `graph-settings.fixture.ts`                                 | `graph-settings.spec.ts`  |
| `graph-settings` (e2e)             | Both of the above      | `e2e-graph-settings.fixture.ts` (composite — both page objects on one page) | `graph-settings.spec.ts` under `e2e/` |
| `sliders-animations`               | `SlidersPage.ts`       | `sliders.fixture.ts`                                        | `sliders-animations.spec.ts` |
| `save-load-share`                  | `SharePage.ts`         | `share.fixture.ts`                                          | `save-load-share.spec.ts` |

---

## 11. Hard Rules

- Do not create test files outside `src/tests/`.
- Do not place Page Objects in `src/tests/`.
- Do not write tests that depend on a Desmos account unless explicitly asked.
- Do not assert on canvas pixel data.
- Do not use XPath selectors.
- Do not import from `@playwright/test` directly in test files — always import from the fixture.
- Do not create new files or directories outside the defined structure without asking first.
- Do not modify `docs/projectContext.md` — it is read-only reference.
