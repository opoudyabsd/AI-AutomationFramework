# CLAUDE.md — Project Rules & AI Behavior Guide

> This file governs how Claude should work in this repository.
> Read it fully before generating, editing, or reviewing any code.

---

## 1. Project Overview

**Target:** Playwright E2E test automation for [Desmos Graphing Calculator](https://www.desmos.com/calculator)
**Framework:** Playwright + TypeScript
**Pattern:** Page Object Model (POM) with Playwright Fixtures
**Full app context:** `docs/projectContext.md` — read this before writing any test

---

## 2. Folder Structure

```sh
src/
  testData/
    constants.ts
    testData.ts        # Data related to the test
  pages/               # Page Object Models (.ts classes)
  tests/               # All .spec.ts test files (flat, one file per feature area)
  utils/          
    fixtures/          # Playwright custom fixtures (test extensions)
    helpers/           # Pure utility functions (no Playwright imports if possible)
docs/
  testCases/           # Folder with existed test cases
    testType/          # Regression, smoke, e2e, performace. Only this 4 testing type should be used
      feature|component/ # Each feature should be separted by specific folder
        testCase.md      # Test case in .md format, one file per test case
        testData.json    # Json file with the required test data (if needed)
  projectContext.md    # Desmos app context — selectors, features, challenges, description
playwright.config.ts
package.json
CLAUDE.md
```

### Rules

- **Never** place test logic (assertions, `test()` blocks) inside `pages/` or `helpers/`.
- **Never** place page/helper imports directly in `playwright.config.ts`.
- `specs/` is not for test specs — it holds support code only.
- One Page Object class per logical page/component (e.g., `CalculatorPage.ts`).
- One fixture file per logical grouping (e.g., `calculator.fixture.ts`).

---

## 3. File Naming Conventions

| Type               | Location                      | Convention                        | Example                        |
|--------------------|-------------------------------|-----------------------------------|--------------------------------|
| Test spec          | `src/tests/`                  | `kebab-case.spec.ts`              | `expression-input.spec.ts`     |
| Page Object        | `src/specs/pages/`            | `PascalCase.ts`                   | `CalculatorPage.ts`            |
| Fixture            | `src/specs/fixtures/`         | `kebab-case.fixture.ts`           | `calculator.fixture.ts`        |
| Helper             | `src/specs/helpers/`          | `camelCase.ts`                    | `mathInput.ts`                 |

---

## 4. Test Writing Conventions

### Structure

```typescript
import { test, expect } from '../specs/fixtures/calculator.fixture';
// Always import from the fixture, not directly from @playwright/test

test.describe('Feature Name', () => {
  test.beforeEach(async ({ calculatorPage }) => {
    await calculatorPage.goto();
  });

  test('should do something specific', async ({ calculatorPage, page }) => {
    // Arrange, Act, Assert
  });
});
```

### Rules

- Use `test.describe()` for every spec file — group by feature.
- Use `test.beforeEach()` for navigation; never navigate inside individual tests unless testing navigation itself.
- Test names must follow: `'should <verb> <what>'` (e.g., `'should display expression list'`).
- Prefer `expect(locator).toBeVisible()` over `expect(await locator.isVisible()).toBe(true)`.
- Use `await page.waitForTimeout()` **only as a last resort** — prefer `waitFor`, `toBeVisible`, or `toHaveCount`.
- Never use `page.pause()` or `test.only()` in committed code.
- Maximum one logical assertion concept per test — split if multiple independent things are checked.

---

## 5. Page Object Model Conventions

```typescript
export class CalculatorPage {
  readonly page: Page;

  // Group locators by UI region with a comment header
  // Toolbar
  readonly undoButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.undoButton = page.locator('[aria-label="Undo"]');
  }

  // Methods represent user actions, not low-level clicks
  async typeExpression(text: string) { ... }
  async goto() { ... }
}
```

### Rules

- All locators declared as `readonly` class properties in the constructor.
- Methods represent **user-level actions**, not raw clicks (e.g., `typeExpression()` not `clickMathField()`).
- `goto()` must always call `waitForCalculatorLoad()` — never expose a bare `page.goto()` in tests.
- No assertions inside Page Objects — assertions belong in test files.
- Locators must use stable selectors in this priority order:
   1. `aria-label` attributes
   2. `role` + accessible name
   3. Desmos-specific CSS classes (`.dcg-*`)
   4. Generic CSS classes (avoid)
   5. XPath (never)

---

## 6. Fixture Conventions

Fixtures extend the base Playwright `test` object and provide pre-navigated page objects.

```typescript
// src/specs/fixtures/calculator.fixture.ts
import { test as base } from '@playwright/test';
import { CalculatorPage } from '../pages/CalculatorPage';

type Fixtures = { calculatorPage: CalculatorPage };

export const test = base.extend<Fixtures>({
  calculatorPage: async ({ page }, use) => {
    const calculatorPage = new CalculatorPage(page);
    await use(calculatorPage);
  },
});

export { expect } from '@playwright/test';
```

- Test files import `test` and `expect` from the fixture file, not from `@playwright/test`.
- Never instantiate Page Objects directly inside test files.

---

## 7. Desmos-Specific Testing Rules

### MathQuill Input

- MathQuill is **not** a native `<input>`. Use this pattern:

```typescript
await mathInputField.click();
await page.keyboard.type('y=x^2');
await page.waitForTimeout(300); // allow MathQuill to render
```

- Do **not** use `locator.fill()` on MathQuill fields — it will not work.

- For special symbols (`^`, `sqrt`, etc.) use `keyboard.type()` directly.

### Canvas Assertions

- The graph renders on HTML5 Canvas — **never assert pixel content directly**.
- Instead assert via DOM proxy signals:
   - Slider elements appear after an expression with undefined variables
   - Points-of-Interest (POI) label elements appear after clicking a curve
   - Error indicators (`.dcg-expressionitem .dcg-error`) are absent

- Screenshot comparison is acceptable for visual regression, but tolerance must be set.

### Async / Timing

- Always `await` after interactions that trigger graph re-renders.
- Prefer `await expect(locator).toBeVisible()` over arbitrary `waitForTimeout`.
- If polling is needed, use `page.waitForFunction()` with a DOM condition.

### Selectors Reference (from `docs/projectContext.md`)

```ini
Expression list:    .dcg-expressionlist
Expression item:    .dcg-expressionitem
Math input field:   .dcg-mq-editable-field
Add Item button:    [aria-label="Add Item"]
Graph canvas:       .dcg-graph-outer canvas
Zoom In:            [aria-label="Zoom In"]
Zoom Out:           [aria-label="Zoom Out"]
Reset View:         [aria-label="Reset to Default View"]
Share:              [aria-label="Share Graph"]
Keypad open:        [aria-label="Open Keypad"]
Keypad close:       [aria-label="Close Keypad"]
Slider play:        .dcg-slider-play-btn
Eye toggle:         .dcg-expression-icon
```

> These may change — always verify against live DOM before hardcoding.

---

## 8. Playwright Config Rules

- `testDir` must point to `./src/tests`.
- `baseURL` must be `https://www.desmos.com/calculator`.
- `timeout` per test: 60000ms.
- `actionTimeout`: 15000ms, `navigationTimeout`: 30000ms.
- `screenshot: 'only-on-failure'`, `video: 'on-first-retry'`, `trace: 'on-first-retry'`.
- Active projects: `chromium` and `firefox`. Do not add browsers without discussion.
- Do not modify `playwright.config.ts` without being explicitly asked.

---

## 9. Package.json Scripts

```json
"scripts": {
  "test": "playwright test",
  "test:headed": "playwright test --headed",
  "test:ui": "playwright test --ui",
  "test:report": "playwright show-report",
  "test:chromium": "playwright test --project=chromium",
  "test:firefox": "playwright test --project=firefox"
}
```

---

## 10. What Claude Must NOT Do

- Do not create test files outside `src/tests/`.
- Do not place Page Objects in `src/tests/`.
- Do not add `test.only()` or `page.pause()` in committed code.
- Do not write tests that depend on authentication (Desmos account) unless explicitly asked.
- Do not assert on canvas pixel data.
- Do not use `waitForTimeout` as a primary wait strategy.
- Do not use XPath selectors.
- Do not import from `@playwright/test` directly in test files — always import from the fixture.
- Do not create new files or directories not listed in the structure without asking first.
- Do not touch `docs/projectContext.md` — it is a read-only reference document.
