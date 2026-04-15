# AIStory — Playwright E2E Test Suite for Desmos Graphing Calculator

Automated end-to-end test suite for the [Desmos Graphing Calculator](https://www.desmos.com/calculator), built with **Playwright** and **TypeScript** following the **Page Object Model (POM)** pattern with Playwright Fixtures.

---

## Tech Stack

| Tool | Version |
|---|---|
| [Playwright](https://playwright.dev/) | ^1.59.1 |
| TypeScript / Node.js | via `@types/node ^25` |
| Browsers | Chromium, Firefox |

---

## Project Structure

```
src/
  testData/
    constants.ts          # Selectors, ARIA labels, keyboard shortcuts, timeouts
    testData.ts           # Test-scoped data values (expressions, coordinates, results)
  pages/
    CalculatorPage.ts     # Page Object for the Desmos calculator UI
  tests/
    expression-entry.spec.ts   # Expression entry and graph rendering feature tests
  utils/
    fixtures/
      calculator.fixture.ts    # Playwright fixture that provides `calculatorPage`
docs/
  userstory/             # User story .md files per feature (Gherkin format)
  testCases/
    smoke/               # Smoke test case definitions
    regression/          # Regression test case definitions
  projectContext.md      # Desmos selectors, known behaviours, challenges (read-only)
playwright.config.ts
```

---

## Setup

**Prerequisites:** Node.js 18+

```bash
# Install dependencies
npm install

# Install Playwright browsers (first time only)
npx playwright install
```

---

## Running Tests

```bash
# Run all tests (headless)
npx playwright test

# Run with visible browser
npx playwright test --headed

# Interactive UI mode
npx playwright test --ui

# Single spec file
npx playwright test src/tests/expression-entry.spec.ts

# Single test by name
npx playwright test -g "should render a parabola"

# Single browser
npx playwright test --project=chromium
npx playwright test --project=firefox

# View last HTML report
npx playwright show-report
```

---

## Configuration

Key settings in `playwright.config.ts`:

| Setting | Value |
|---|---|
| `baseURL` | `https://www.desmos.com/calculator` |
| `timeout` | 60 000 ms |
| `actionTimeout` | 15 000 ms |
| `navigationTimeout` | 30 000 ms |
| `screenshot` | on failure only |
| `video` | on first retry |
| `trace` | on first retry |
| Browsers | Chromium, Firefox |

On CI, retries are set to 2 and workers to 1.

---

## Test Coverage (current)

| Feature area | Spec file | Tests |
|---|---|---|
| Expression entry & graph rendering | `expression-entry.spec.ts` | 20 |

Feature areas planned (Page Objects and fixtures stubbed):

| Feature | Page Object | Fixture | Spec |
|---|---|---|---|
| Graph settings / viewport | `GraphSettingsPage.ts` | `graph-settings.fixture.ts` | `graph-settings.spec.ts` |
| Sliders & animations | `SlidersPage.ts` | `sliders.fixture.ts` | `sliders-animations.spec.ts` |
| Save / load / share | `SharePage.ts` | `share.fixture.ts` | `save-load-share.spec.ts` |

---

## Architecture

### Page Object Model

All UI interaction is encapsulated in Page Object classes inside `src/pages/`. Tests never use locators directly — they call named action methods (`typeExpression`, `toggleExpressionVisibility`, etc.).

Selector priority (highest to lowest):
1. `aria-label` / role
2. `.dcg-*` scoped CSS class
3. Generic CSS
4. XPath — **never used**

### Fixtures

`src/utils/fixtures/calculator.fixture.ts` extends Playwright's `test` base to inject a pre-constructed `CalculatorPage` instance. All test files import `test` and `expect` from the fixture — never from `@playwright/test` directly.

### Test Data

- `constants.ts` — static selectors, ARIA labels, keyboard shortcuts, timing constants
- `testData.ts` — dynamic test data (expressions, expected results, graph coordinates)

Graph coordinates are stored as Desmos graph units (e.g. `{ graphX: 2, graphY: 0 }`) and converted to canvas pixel offsets at runtime, so tests work at any viewport size.

### Desmos-Specific Constraints

- **MathQuill input** — `locator.fill()` does not work; always use `page.keyboard.type()` followed by a 300 ms render delay.
- **Canvas assertions** — the graph is an HTML5 Canvas; pixel assertions are not used. DOM proxy signals (absence of `.dcg-error`, presence of `.dcg-slider-play-btn`, coordinate tooltip text) are used instead.
- **Aria-live region** — Desmos does not maintain a persistent `aria-live` announcement region; accessibility assertions rely on accessible name changes on interactive elements.

---

## Docs

- `docs/projectContext.md` — canonical reference for Desmos selectors, known DOM quirks, and testing constraints. **Read-only.**
- `docs/userstory/` — user stories in Gherkin format, one file per feature.
- `docs/testCases/` — test case definitions organised by `{type}/{feature}/testCase.md`.
