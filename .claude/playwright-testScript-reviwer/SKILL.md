---
name: playwright-testScript-reviwer
argument-hint: Path to spec file, feature folder name, or "all" for full suite review
description: |
  Reviews, audits, and analyses existing Playwright TypeScript test scripts in this project. Use this skill whenever the user asks to "review tests", "audit spec files", "analyse test scripts", "check playwright tests", "validate test quality", "inspect test code", "give feedback on tests", "find issues in specs", or "review my automation". Also trigger when the user points to a specific spec file, a feature folder under src/tests/, or asks for a quality report on any .spec.ts file. This skill is READ-ONLY on all source files — it never modifies src/. It writes a prioritised review report to docs/reviewReport/runs/ and updates docs/reviewReport/INDEX.md. Trigger liberally.
allowed-tools:
  - Read
  - Write
  - Edit
  - Glob
  - Bash
---

# Playwright Test Script Reviewer

This skill performs static analysis of existing Playwright TypeScript test scripts against the
project conventions defined in `CLAUDE.md` and the eight Playwright best practices adopted by
this project. It also verifies that each test's implementation aligns with the test case
specification it references (Category K). It produces a prioritised, actionable review report
**written to disk** under `docs/reviewReport/` with violation + fix code blocks and a thematic
retrospective. It **never modifies** any file under `src/`.

---

## When to Use

- A new spec file has been written and needs a quality gate check before merge
- An existing suite is being refactored and you want a baseline quality scan
- A test is flaky or failing in CI and you want a structural diagnosis
- You want a retrospective of recurring patterns across a feature area

---

## Procedure

Follow every step in order. Do not skip steps.

### Step 1 — Load reference context

Read both of these files before touching any test file:

- `CLAUDE.md` — project conventions (structure, naming, POM rules, selector priority, forbidden patterns)
- `docs/projectContext.md` — Desmos app context (MathQuill quirks, Canvas constraints, known selectors,
   async behaviour)

These are the authoritative sources for every judgement made in later steps.

### Step 2 — Determine review scope

Parse the user's input to determine which files to review:

| User input | Files to read |
|---|---|
| Specific file path (e.g. `src/tests/regression/expression-entry.spec.ts`) | That file only |
| Feature folder name (e.g. `expression-entry`) | All `*.spec.ts` under `src/tests/**/*.spec.ts` whose file name matches |
| `all` or no scope specified | Every `*.spec.ts` under `src/tests/` (all subdirectories) |

For each spec file identified, also read:

- Its associated Page Object class under `src/pages/`
- Its associated fixture file under `src/utils/fixtures/`
- For **Category K**: scan the spec for `// TC-*` comments (e.g. `// TC-E1-01-002`).
  For each TC ID found, search `docs/testCases/{smoke,regression,e2e,performance}/{feature}/`
  for a file whose name starts with that TC ID. Read each matched `.md` file.
  Also list all `.md` files under `docs/testCases/` for the scoped feature to detect K6 gaps.

Identify association by matching feature name. If a POM or fixture is missing, flag it as P1 Critical.

### Step 3 — Run the review checklist

For every spec + POM + fixture triple, evaluate each of the eleven categories below (A through K).
Load `references/checklist-categories.md` before evaluating categories C, D, E, G, H, I, J, or K.
Record every finding with: **category**, **severity**, **file + approx line**, **violation snippet**,
**corrected snippet**, **rule reference**.

---

#### Category A — Architecture & Structure

*Rule ref: CLAUDE.md §2, §3*

| Check | Fail = |
|---|---|
| A1 | `test` / `expect` imported from `@playwright/test` directly instead of from the fixture file |
| A2 | Raw `page.locator(...)` calls present inside a `*.spec.ts` file |
| A3 | Page Object class not in `src/pages/` or not named `PascalCase.ts` |
| A4 | Fixture file not in `src/utils/fixtures/` or not named `kebab-case.fixture.ts` |
| A5 | Spec file not in `src/tests/` or not named `kebab-case.spec.ts` |
| A6 | Test logic (assertions, `test()` blocks) found inside a Page Object or helper file |

#### Category B — Page Object Model Quality

*Rule ref: CLAUDE.md §5*

| Check | Fail = | Why it matters |
|---|---|---|
| B1 | Locator not declared as `readonly` class property in the constructor | Locators created ad-hoc inside methods can silently resolve to different elements across calls |
| B2 | Method name does not use verb-first naming (e.g. `colorIcon` instead of `clickColorIcon`) | Noun names are ambiguous — callers cannot tell whether the method reads or mutates state |
| B3 | Assertion (`expect(...)`) found inside a POM method | POM methods are reused across tests; baked-in assertions produce misleading failure messages |
| B4 | `goto()` does not call `waitForCalculatorLoad()` before returning | Tests that navigate and immediately query a locator will race against the expression list appearing, causing intermittent failures |
| B5 | Page Object instantiated directly inside a test file instead of via fixture | Bypasses the fixture lifecycle; makes it impossible to inject mocks or shared context |
| B6 | Multiple logical pages/components collapsed into one POM class | Large POM classes become a maintenance bottleneck and make selector naming ambiguous |

#### Category C — Selector Stability  
#### Category D — Test Structure & Naming  
#### Category E — Web-First Assertions  
#### Category G — Test Isolation  
#### Category H — User-Visible Behaviour  
#### Category I — CI Readiness  
#### Category J — Test Data Management  
#### Category K — Test Case Coverage

See `references/checklist-categories.md` for the full check tables for categories C, D, E, G, H, I, J, and K. Load that file whenever you evaluate those categories.

#### Category F — Smart Waits & Async Handling

*Rule ref: CLAUDE.md §4, §7 + Best Practice 7*

| Check | Fail = | Why it matters |
|---|---|---|
| F1 | `page.waitForTimeout()` used as primary wait strategy (not a last-resort MathQuill workaround) | Fixed sleeps make suites slow and still break when a machine is under load; web-first assertions self-cancel as soon as the condition is met |
| F2 | `locator.fill()` used on a MathQuill field (`.dcg-mq-editable-field` or similar) | MathQuill intercepts native input events; `fill()` bypasses them and produces empty or malformed expression state |
| F3 | `page.keyboard.type()` used on a MathQuill field without a subsequent `waitForTimeout` or assertion | MathQuill renders asynchronously; assertions fired immediately after typing will see a stale DOM |
| F4 | `page.waitForFunction()` used when a simpler `expect(locator).toBeVisible()` would suffice | `waitForFunction` bypasses Playwright's auto-retry and makes failure messages harder to read |
| F5 | `await page.waitForTimeout(...)` value exceeds 500 ms without a comment explaining why | Unexplained long sleeps indicate either a missing web-first wait or a poorly understood async dependency |

---

### Step 4 — Determine severity for each finding

| Severity | Label | Criterion |
|---|---|---|
| P1 | **Critical** | Blocks correctness, CI stability, or architectural integrity. Must be fixed before merge. |
| P2 | **Warning** | Violates project conventions or best practices. Should be fixed in current or next sprint. |
| P3 | **Info** | Optional improvement that increases maintainability or readability. |

Default severity per category:

- **P1 Critical by default:** A1, A2, A6, B3, B4, C1, D5, D6, E1, F2, G1, G2, H1, I1, I2, I4, K2
- **P2 Warning by default:** A3, A4, A5, B1, B2, B5, B6, C2, C3, C4, C5, C6, D1, D2, D3, D4, E2, E3, E4, E5, F1, F3, F4, G3, G4, H2, H3, H4, I3, I5, J1, J2, J3, J4, K1, K3, K4, K6
- **P3 Info:** Any check where the violation is minor style only with no functional impact; K5 (test name wording mismatch)

### Step 5 — Write report files to disk

> **MANDATORY:** This step requires exactly two tool calls (`Write` for the run report, then `Write` or `Edit` for `INDEX.md`). Never paste report content into chat — doing so loses the audit trail and exhausts the context window. After both tool calls succeed, confirm in chat with only the report file path and the Summary table.

---

**5a. Determine the output paths**

Compute these paths before making any tool call:

- **Run report:** `docs/reviewReport/runs/REVIEW-<YYYY-MM-DD>-<scope>.md`
  - `<YYYY-MM-DD>` = today's date
  - `<scope>` = feature folder name (kebab-case) or `all`
  - If the file already exists (same-day re-run), append a counter: `-2`, `-3`, etc.
- **Index:** `docs/reviewReport/INDEX.md`

Use `Bash` to create `docs/reviewReport/runs/` if it does not exist:
```bash
mkdir -p docs/reviewReport/runs
```

---

**5b. Call `Write` to create the run report**

Call the `Write` tool now with:
- `file_path` = the run report path from 5a
- `content` = the fully-populated report using the template below (replace every placeholder with real findings from Step 3)

Report template:

```
# Test Script Review — <scope> | <YYYY-MM-DD>

**Reviewer:** Claude (playwright-testScript-reviwer skill)
**Scope:** <scope>
**Files reviewed:**
- `src/tests/<testType>/<file>.spec.ts`
- `src/pages/<File>.ts`
- `src/utils/fixtures/<file>.fixture.ts`

**Test cases loaded for K-coverage check:**
- `docs/testCases/{type}/{feature}/<TC-ID>.md` (one line per loaded file)

---

## Summary

| Category | Status | P1 Critical | P2 Warning | P3 Info |
|---|---|---|---|---|
| A — Architecture & Structure | ❌/⚠️/✅ | n | n | n |
| B — Page Object Model Quality | ... | | | |
| C — Selector Stability | ... | | | |
| D — Test Structure & Naming | ... | | | |
| E — Web-First Assertions | ... | | | |
| F — Smart Waits & Async Handling | ... | | | |
| G — Test Isolation | ... | | | |
| H — User-Visible Behaviour | ... | | | |
| I — CI Readiness | ... | | | |
| J — Test Data Management | ... | | | |
| K — Test Case Coverage | ... | | | |
| **Total** | | **n** | **n** | **n** |

Status icons: ❌ has P1 issues · ⚠️ has P2+ issues only · ✅ fully clean

---

## P1 — Critical Issues

> Must be resolved before this code is merged.

**File:** `path/to/file.ts` · **Check:** A1 · **Rule:** CLAUDE.md §4

**Violation:**
\`\`\`typescript
// exact snippet from the file
\`\`\`

**Fix:**
\`\`\`typescript
// corrected version
\`\`\`

**Why:** One sentence explaining the consequence of leaving this unfixed.

---

## P2 — Warnings

> Should be fixed in this sprint or the next.

(same sub-section format as P1)

---

## P3 — Info

> Optional improvements. No urgency.

(same sub-section format as P1, abbreviated — omit "Why" if self-evident)

---

## Passed Checks

The following categories had zero violations:

- ✅ **[Category name]** — all [n] checks passed

---

## Retrospective

> Thematic root-cause analysis. Identifies the underlying habits or gaps that produced
> multiple related findings and prescribes concrete practices to avoid recurrence.

### Theme 1 — [Root cause title]

**Observed pattern:** [What multiple findings have in common]

**Root cause:** [Why this likely happened]

**How to prevent:**
- [Concrete habit or rule to adopt]
- [Tooling or review step that catches this early]

(Repeat for each theme with ≥2 supporting findings or ≥1 P1 finding.)
```

---

**5c. Call `Write` or `Edit` to update INDEX.md**

After the run report is written, update the index file:

- **If `docs/reviewReport/INDEX.md` does not exist:** call `Write` with this content (replacing the data row with real values):

```
# Review Report Index

| Date | Scope | P1 Critical | P2 Warning | P3 Info | Report |
|---|---|---|---|---|---|
| YYYY-MM-DD | <scope> | n | n | n | [REVIEW-YYYY-MM-DD-<scope>.md](./runs/REVIEW-YYYY-MM-DD-<scope>.md) |
```

- **If `docs/reviewReport/INDEX.md` already exists:** call `Edit` to insert the new row immediately after the header row (most-recent run appears first). Do not overwrite existing rows.

---

## Edge Cases

- **No spec file found for scope:** Report the missing file as a P1 finding (A-missing), explain what
   is expected, and create the report with that single finding.
- **POM or fixture file missing:** Flag as P1 A2/A3, note in report header under "Files reviewed" as
   `(missing)`, continue reviewing what exists.
- **Spec passes all checks:** Still write the report with all-✅ summary, empty P1/P2/P3 sections,
   and a brief retrospective noting what is being done well.
- **Same-day re-run:** Append `-2` (or incrementing counter) to the filename. Do not overwrite.
- **No issues found across a whole category:** Write `✅ [Category] — all checks passed` in the
   Passed Checks section; omit the category from P1/P2/P3 sections entirely.
- **TC file not found for a referenced TC-ID (K2):** Flag as P1. Note the expected file path in the
   finding so it is easy to create.
- **Test covers preconditions via `test.beforeEach` (K3):** Count `beforeEach` navigation as covering
   the "Preconditions" row — do not flag missing explicit step if `goto()` is called there.
- **Canvas proxy assertions (K4):** Absence of `expressionError` (rendered via `getByRole('note')`) / presence of a DOM proxy element such as a slider or trace tooltip is accepted as satisfying a "graph rendered" expected result — do not flag as K4.

---

## Output Rules (strict)

1. Do not modify any file under `src/`, `docs/testCases/`, or `docs/projectContext.md`.
2. Write only the run report and `INDEX.md` under `docs/reviewReport/`.
3. Use the `Write` tool to write the run report — pasting it into chat loses the audit trail and
   exhausts the context window. After writing, confirm with the absolute file path and Summary
   table only.
4. Every finding must cite the exact file, a real code pattern observed, and the specific check
   ID from this skill. Do not invent findings.
5. Use the `typescript` language tag for all code blocks in the report.
6. For `INDEX.md`: write the full header if it is absent or empty, then append the data row.
   Use `Write` if the file is absent; use `Edit` to prepend the new row if the file already exists.

---

## Reference files

Load only when needed:

| File | Load when |
|---|---|
| `CLAUDE.md` | Always — Step 1, before any analysis |
| `docs/projectContext.md` | Always — Step 1, before any analysis |
| `references/checklist-categories.md` | Step 3 — before evaluating categories C, D, E, G, H, I, J, or K |
| `src/tests/<file>.spec.ts` | For each file in scope |
| `src/pages/<File>.ts` | For each POM associated with the scope |
| `src/utils/fixtures/<file>.fixture.ts` | For each fixture associated with the scope |
| `docs/testCases/{type}/{feature}/<TC-ID>.md` | Step 2 — for each `// TC-*` comment found in spec files |
| `src/testData/constants.ts` | Step 3 Category J — when checking for magic values |
| `src/testData/testData.ts` | Step 3 Category J — when checking for inline test data |
