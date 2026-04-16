# AIStory — Hybrid AI-Assisted Playwright Automation Framework

AIStory is a hybrid automation framework for the [Desmos Graphing Calculator](https://www.desmos.com/calculator). It combines **Playwright** execution with structured documentation and AI agent workflows — using GitHub Copilot agents and Claude Code skills to plan, generate, review, and repair tests at every layer of the stack (UI E2E and JavaScript Embed API).

The framework is **AI-assisted, not fully autonomous**:
- **Playwright** is the runtime engine for executing browser tests.
- **Structured docs** in `docs/userstory/`, `docs/testCases/`, and `docs/APITestCases/` are the source of truth for AI agent inputs.
- **AI agents and skills** accelerate authoring, review, and maintenance — humans review and approve all outputs.

---

## Tech Stack

| Tool | Version / Source |
|---|---|
| [Playwright](https://playwright.dev/) | ^1.59.1 |
| TypeScript / Node.js | `@types/node ^25` |
| Browsers | Chromium, Firefox |
| GitHub Copilot Agents | `.github/agents/*.agent.md` |
| Claude Code Skills | `.claude/*/SKILL.md` |
| AI Models | Claude Sonnet 4.x (primary), GPT-5 / GPT-4.1 (Copilot fallback) |

---

## Setup

**Prerequisites:** Node.js 18+, a Desmos API key (for API tests)

```bash
# 1. Install Node dependencies
npm install

# 2. Install Playwright browsers (first time only)
npx playwright install

# 3. Configure environment variables
cp .env.example .env
# Edit .env and set:
#   DESMOS_API_KEY=your_key_here
```

> **API test prerequisite:** The `DESMOS_API_KEY` environment variable must be set before running
> any spec under `src/tests/api/`. The fixture throws a descriptive error on startup if it is missing.
> Obtain a key from the [Desmos API portal](https://www.desmos.com/api/v1.11/docs/index.html).

---

## AI Agents and LLM Models

This is the core differentiator of AIStory. Every phase of the test lifecycle — from planning through
generation, review, and healing — has a dedicated AI agent or Claude Code skill. Using these correctly
reduces manual authoring time and keeps the test suite aligned with both live Desmos behaviour and
the project's architectural rules.

### Quick Reference

| Phase | Tool | Surface | Model |
|---|---|---|---|
| Plan test scenarios | `playwright-test-planner` | GitHub Copilot | Claude Sonnet 4 |
| Create test case docs | `testCase-creation` | Claude Code skill | Claude Sonnet 4.6 |
| Generate UI spec + POM | `playwright-testScript-creation` | Claude Code skill | Claude Sonnet 4.6 |
| Generate API test cases | `desmos-api-testcase-creator` | GitHub Copilot | GPT-4.1 / Claude Sonnet 4.5 |
| Generate API Playwright spec | `playwright-api-script-generator` | GitHub Copilot | GPT-5 / Claude Sonnet 4.5 |
| Review any test script | `playwright-testScript-reviwer` | Claude Code skill | Claude Sonnet 4.6 |
| Heal broken tests | `playwright-test-healer` | GitHub Copilot | Claude Sonnet 4 |
| Audit coverage gaps | `playwright-test-coverage-auditor` | GitHub Copilot | Claude Sonnet 4 |
| Validate selectors | `desmos-selector-validator` | GitHub Copilot | Claude Sonnet 4 |

---

### GitHub Copilot Agents

Agent definitions live in `.github/agents/*.agent.md`. They are invoked inside GitHub Copilot Chat
(`@agent <agent-name>`) or via the GitHub Copilot agent API. Each agent declares which LLM model
and which MCP tools it is allowed to use.

#### `playwright-test-planner`
**Model:** Claude Sonnet 4 | **MCP tools:** full Playwright browser suite

Navigates the live Desmos calculator in a headed browser, discovers user-facing features, and produces
a structured test plan. Use this when starting a new feature area with no existing test cases.

```
@agent playwright-test-planner
Explore the graph settings panel and plan test scenarios for viewport, zoom, and degree mode.
```

---

#### `playwright-test-generator`
**Model:** Claude Sonnet 4 | **MCP tools:** Playwright browser + file tools

Converts a single test plan item into a Playwright TypeScript spec. It opens the browser, verifies
every selector against the live DOM before writing code, and follows the project's POM + fixture
architecture. Always pass a structured XML input block.

```xml
@agent playwright-test-generator
<test-suite>graph-settings</test-suite>
<test-name>should toggle degree mode and update trigonometric graphs</test-name>
<test-file>src/tests/regression/graph-settings.spec.ts</test-file>
<seed-file>src/tests/regression/expression-entry.spec.ts</seed-file>
<body>
  Open graph settings. Enable degree mode. Type sin(x). Verify the graph period changes.
</body>
```

---

#### `playwright-test-healer`
**Model:** Claude Sonnet 4 | **MCP tools:** Playwright browser + test runner

Runs all tests, identifies failures, inspects the live DOM for each broken selector, performs root-cause
analysis, and patches the spec or POM file. Use when tests fail after a Desmos UI update.

```
@agent playwright-test-healer
```

---

#### `playwright-test-coverage-auditor`
**Model:** Claude Sonnet 4 | **MCP tools:** repository file search only (no browser)

Compares `docs/testCases/` and `docs/APITestCases/` documentation against `src/tests/`
implementations, builds a traceability matrix, and reports coverage gaps as P1/P2/P3 findings.
Use after adding new test case docs to identify which ones still need automation.

```
@agent playwright-test-coverage-auditor
```

---

#### `desmos-selector-validator`
**Model:** Claude Sonnet 4 | **MCP tools:** full Playwright browser suite

Navigates the live Desmos calculator and validates every candidate locator in `src/pages/` or
`src/testData/constants.ts` against the real DOM. Use before generating new tests or when Desmos
updates its class names after a release.

```
@agent desmos-selector-validator
Validate all selectors in CalculatorPage.ts against the live calculator.
```

---

#### `desmos-api-testcase-creator`
**Model:** GPT-4.1 (Copilot) / Claude Sonnet 4.5 (Copilot) | **MCP tools:** file tools

Reads `docs/desmosAPI/Desmos-api-v1.11.md` and produces fully-structured, automation-ready test
case `.md` files saved under `docs/APITestCases/<feature>/`. Use when you want to add coverage for
a new area of the Desmos JavaScript Embed API before writing any code.

```
@agent desmos-api-testcase-creator
Feature: graph settings API (updateSettings, getSettings, degreeMode, polarMode).
Scope: all options. Save files to docs/APITestCases/graph-settings-api/.
```

---

#### `playwright-api-script-generator`
**Model:** GPT-5 (Copilot) / Claude Sonnet 4.5 (Copilot) | **MCP tools:** file tools

Reads `docs/APITestCases/<feature>/*.md` and generates production-ready Playwright + TypeScript
API specs with a complete fixture proxy, externalized config and test data, env-var-based secret
handling, and full coverage status comment. Applies SOLID, KISS, DRY, and Fail Fast principles.

```
@agent playwright-api-script-generator
Feature: docs/APITestCases/calculator-core. Scope: all TCs. Create new spec file.
```

> **Important:** Read the **Lessons Learned** section inside the agent file before using it. It
> documents 10 common mistakes (unnamespaced window globals, TC IDs in test names, config/data
> mixing, incomplete fixture proxy, etc.) that the agent is trained to avoid.

---

### Claude Code Skills

Claude Code skills live in `.claude/*/SKILL.md` and run inside the current Claude Code (`claude`) session. They are **context skills** — Claude reads them automatically based on the task description. Invoke them by describing what you want; do not use slash commands.

> All Claude Code skills run on **Claude Sonnet 4.6** (the model powering the active session).

#### `testCase-creation`
Reads a user story from `docs/userstory/` and produces one test case `.md` per scenario under
`docs/testCases/{type}/{feature}/`. Applies Desmos-specific rules (MathQuill input, Canvas proxy signals,
known selector patterns) automatically.

**Trigger phrase:** "Create test cases for \<feature\>" or "Generate test cases from \<story file\>"

```
Create test cases for the expression-entry user story US-E1-01.
```

---

#### `playwright-testScript-creation`
Reads `docs/testCases/<type>/<feature>/*.md`, validates every locator against the live Desmos
calculator via Playwright MCP tools, then generates or updates the spec, POM, and fixture. Always
reads existing code before writing to avoid duplicate work or selector drift.

**Trigger phrase:** "Generate the Playwright test for TC-\<ID\>" or "Automate test cases for \<feature\>"

```
Generate Playwright tests for all regression cases in docs/testCases/regression/graph-settings/.
```

---

#### `playwright-testScript-reviwer`
Statically audits any Playwright TypeScript script — UI or API — against **13 quality categories**:

| Category | Scope |
|---|---|
| A — Architecture & Structure | UI + API |
| B — Page Object Model Quality | UI only |
| C — Selector Stability | UI only |
| D — Test Structure & Naming | UI + API |
| E — Web-First Assertions | UI + API |
| F — Smart Waits & Async | UI + API |
| G — Test Isolation | UI + API |
| H — User-Visible Behaviour | UI only |
| I — CI Readiness | UI + API |
| J — Test Data Management | UI + API |
| K — Test Case Coverage | UI + API |
| L — Design Principles (SOLID, KISS, DRY, YAGNI, SoC, Fail Fast) | UI + API |
| M — API Test Architecture | API only |

Writes a prioritised report to `docs/reviewReport/runs/REVIEW-<date>-<scope>.md`. Never modifies `src/`.

**Trigger phrase:** "Review tests for \<feature\>", "Audit \<spec-file\>", or "Review API tests for \<feature\>"

```
Review tests for expression-entry.
Review API tests for api/calculator-core.
```

---

### AI-Assisted Workflow: End to End

The recommended sequence for adding a new feature area:

```
1. [optional] Explore the live UI
   → @agent playwright-test-planner

2. Create test case documentation
   → Claude: "Create test cases for <feature>"  (testCase-creation skill)
   OR for API features:
   → @agent desmos-api-testcase-creator

3. Generate Playwright code
   → Claude: "Generate tests for <feature>"  (playwright-testScript-creation skill)
   OR for API features:
   → @agent playwright-api-script-generator

4. Review generated code before merge
   → Claude: "Review tests for <feature>"  (playwright-testScript-reviwer skill)

5. Fix all P1 Critical and P2 Warning findings
   → Implement fixes manually or ask Claude to apply them

6. Run tests and confirm they pass
   → npx playwright test src/tests/<type>/<feature>.spec.ts

7. When tests fail after a Desmos update
   → @agent playwright-test-healer
   OR validate selectors first:
   → @agent desmos-selector-validator
```

---

### AI Setup: Prerequisites

| Requirement | Where configured |
|---|---|
| GitHub Copilot subscription (Teams or Enterprise) | GitHub account settings |
| Claude Code CLI (`claude` command) | `npm install -g @anthropic-ai/claude-code` |
| `DESMOS_API_KEY` env var | `.env` file (see Setup section) |
| Playwright MCP server (for browser-interactive skills) | `.claude/settings.json` |

The `.claude/settings.json` file configures the Playwright MCP server used by browser-interactive
Claude skills. It is committed to the repository and should not need manual editing.

---

## Running Tests

> `package.json` defines no npm scripts — use `npx` directly.

```bash
# Run all tests (headless)
npx playwright test

# Run with visible browser
npx playwright test --headed

# Interactive UI mode
npx playwright test --ui

# Specific spec file
npx playwright test src/tests/regression/expression-entry.spec.ts

# Specific test by title
npx playwright test -g "should render a parabola"

# Single browser only
npx playwright test --project=chromium
npx playwright test --project=firefox

# API tests only
npx playwright test src/tests/api/

# View last HTML report
npx playwright show-report
```

---

## Configuration

Key settings in `playwright.config.ts`:

| Setting | Value |
|---|---|
| `baseURL` | `https://www.desmos.com/calculator` |
| `testDir` | `./src/tests` |
| `timeout` | 60 000 ms |
| `actionTimeout` | 15 000 ms |
| `navigationTimeout` | 30 000 ms |
| `screenshot` | on failure only |
| `video` | on first retry |
| `trace` | on first retry |
| Browsers | Chromium, Firefox |

On CI, retries are set to 2 and workers to 1.

---

## Project Structure

```
.github/
  agents/
    playwright-test-planner.agent.md       # Live-browse and plan test scenarios
    playwright-test-generator.agent.md     # Convert plan items to Playwright specs
    playwright-test-healer.agent.md        # Diagnose and repair failing tests
    playwright-test-coverage-auditor.agent.md  # Traceability gap analysis
    desmos-selector-validator.agent.md     # Validate locators against live DOM
    desmos-api-testcase-creator.agent.md   # Generate API test case docs from API reference
    playwright-api-script-generator.agent.md   # Generate API Playwright specs from TC docs

.claude/
  settings.json                            # Claude MCP server configuration (Playwright MCP)
  playwright-testScript-reviwer/           # Skill: audit UI + API specs (13 categories)
  playwright-TestScript-creation/          # Skill: generate spec + POM from test case docs
  testCase-creation/                       # Skill: generate test case docs from user stories

src/
  testData/
    constants.ts         # Selectors, ARIA labels, keyboard shortcuts, timeouts
    testData.ts          # UI test inputs and expected values
    apiConfig.ts         # API harness config (API version, container ID, dimensions)
    apiTestData.ts       # API test inputs (expressions, bounds, expected states)
  pages/
    CalculatorPage.ts    # POM for the Desmos calculator UI
    GraphSettingsPage.ts # POM for the graph settings panel
  tests/
    smoke/               # Critical happy-path tests (one per feature)
    regression/          # Full functional regression tests
      expression-entry.spec.ts
      graph-settings.spec.ts
    e2e/                 # Cross-feature end-to-end flows
      graph-settings.spec.ts
    api/                 # Desmos JavaScript Embed API contract tests
      calculator-core/
        calculator-core.spec.ts
  utils/
    fixtures/
      calculator.fixture.ts        # UI fixture: provides calculatorPage
      graph-settings.fixture.ts    # UI fixture: provides graphSettingsPage
      api-calculator.fixture.ts    # API fixture: provides calculator proxy + desmosApiPage

docs/
  userstory/             # User story .md files per feature (Gherkin)
  testCases/             # Test case definitions: {smoke|regression|e2e|performance}/{feature}/
  APITestCases/          # API test case definitions: {feature}/TC-API-*.md
  desmosAPI/             # Desmos API v1.11 reference (used by API agent)
  reviewReport/          # Automated review reports written by the reviewer skill
    INDEX.md             # Index of all review runs
    runs/                # Individual REVIEW-<date>-<scope>.md reports
  projectContext.md      # Desmos selectors, DOM quirks, testing constraints (READ-ONLY)

CLAUDE.md                # Project rules for Claude Code (authoritative for all AI tools)
playwright.config.ts
```

---

## Test Coverage

| Feature area | Type | Spec file | Status |
|---|---|---|---|
| Expression entry & graph rendering | regression | `regression/expression-entry.spec.ts` | Active |
| Graph settings (UI) | regression | `regression/graph-settings.spec.ts` | Active |
| Graph settings (E2E cross-feature) | e2e | `e2e/graph-settings.spec.ts` | Active |
| Calculator Core API | api | `api/calculator-core/calculator-core.spec.ts` | Active |

---

## Architecture

### Page Object Model (UI tests)

All UI interactions are encapsulated in Page Object classes in `src/pages/`. Test files never use
raw locators — they call named action methods (`typeExpression`, `toggleExpressionVisibility`).

Selector priority (highest → lowest):
1. `aria-label` / semantic role
2. `.dcg-*` scoped CSS class
3. Generic CSS (scoped to a container)
4. XPath — **never used**

### API Test Architecture

API tests live in `src/tests/api/<feature>/`. They embed the Desmos JavaScript calculator into a
Playwright-controlled browser page via `page.setContent()`, then interact with it entirely through
a typed fixture proxy (`DesmosCalculator`). Key design rules:

- **Window global bridge:** The calculator instance cannot cross the `page.evaluate()` JSON boundary.
  It is stored as `window.__testCalc_<random>` (namespaced per fixture instance to prevent collisions).
- **Proxy completeness:** All Desmos API methods needed across a TC suite must be proxied in the fixture
  before any spec is written.
- **Config/data separation:** `apiConfig.ts` holds harness infrastructure; `apiTestData.ts` holds
  scenario inputs. They change for different reasons.

### Fixtures

Fixtures in `src/utils/fixtures/` extend Playwright's `test` base to inject pre-constructed page
objects or API proxies. All spec files import `test` and `expect` from the fixture — never directly
from `@playwright/test`.

### Test Data

| File | Contains |
|---|---|
| `constants.ts` | Selectors, ARIA labels, keyboard shortcuts, timing constants |
| `testData.ts` | UI test inputs, expected expressions, graph coordinates |
| `apiConfig.ts` | API version, container ID, container dimensions |
| `apiTestData.ts` | Expression payloads, invalid bounds, expected viewport states |

---

## Docs

| Path | Purpose |
|---|---|
| `docs/projectContext.md` | Desmos selectors, DOM quirks, Canvas constraints — **read-only** |
| `docs/userstory/` | User stories in Gherkin format, one file per feature |
| `docs/testCases/` | Test case definitions by `{type}/{feature}/` |
| `docs/APITestCases/` | API test case definitions by `{feature}/TC-API-*.md` |
| `docs/desmosAPI/` | Desmos JavaScript Embed API v1.11 reference |
| `docs/reviewReport/` | Review reports generated by the reviewer skill |
| `.github/agents/` | GitHub Copilot agent definitions |
| `.claude/` + `CLAUDE.md` | Claude Code skills and project-wide authoring rules |
