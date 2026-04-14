---
name: playwright-testScript-reviwer
description: >
  Reviews, audits, and analyses existing Playwright TypeScript test scripts in this project.
  Use this skill whenever the user asks to "review tests", "audit spec files", "analyse test scripts",
  "check playwright tests", "validate test quality", "inspect test code", "give feedback on tests",
  "find issues in specs", or "review my automation". Also trigger when the user points to a specific
  spec file, a feature folder under src/tests/, or asks for a quality report on any .spec.ts file.
  This skill is READ-ONLY on all source files — it never modifies src/. It writes a prioritised
  review report to docs/reviewReport/runs/ and updates docs/reviewReport/INDEX.md. Trigger liberally.
argument-hint: 'Path to spec file, feature folder name, or "all" for full suite review'
---

# Playwright Test Script Reviewer

This skill performs static analysis of existing Playwright TypeScript test scripts against the
project conventions defined in `CLAUDE.md` and the eight Playwright best practices adopted by
this project. It produces a prioritised, actionable review report saved to `docs/reviewReport/`
with violation + fix code blocks and a thematic retrospective. It **never modifies** any file
under `src/`.

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
| Specific file path (e.g. `src/tests/expression-entry.spec.ts`) | That file only |
| Feature folder name (e.g. `expression-entry`) | All `*.spec.ts` under `src/tests/` whose name matches |
| `all` or no scope specified | Every `*.spec.ts` under `src/tests/` |

For each spec file identified, also read:
- Its associated Page Object class under `src/pages/`
- Its associated fixture file under `src/utils/fixtures/`

Identify association by matching feature name. If a POM or fixture is missing, flag it as P1 Critical.

### Step 3 — Run the review checklist

For every spec + POM + fixture triple, evaluate each of the ten categories below.
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

| Check | Fail = |
|---|---|
| B1 | Locator not declared as `readonly` class property in the constructor |
| B2 | Method name does not use verb-first naming (e.g. `clickButton` instead of `submitForm`) |
| B3 | Assertion (`expect(...)`) found inside a POM method |
| B4 | `goto()` does not call `waitForCalculatorLoad()` before returning |
| B5 | Page Object instantiated directly inside a test file instead of via fixture |
| B6 | Multiple logical pages/components collapsed into one POM class |

#### Category C — Selector Stability
*Rule ref: CLAUDE.md §5 + Best Practice 5*

| Check | Fail = |
|---|---|
| C1 | XPath selector used anywhere (absolute or relative) |
| C2 | Position-based selector used (`:nth-child`, `:first`, `:last`, `nth=`) without structural justification |
| C3 | Generic CSS class used when a stable `aria-label` or `.dcg-*` class exists |
| C4 | Dynamic text used as the sole selector anchor for non-static content |
| C5 | Selector priority violated: uses `.dcg-*` when `aria-label` exists on the same element |
| C6 | Selector hard-coded in spec file instead of defined in POM |

#### Category D — Test Structure & Naming
*Rule ref: CLAUDE.md §4*

| Check | Fail = |
|---|---|
| D1 | Spec file has no top-level `test.describe()` wrapper |
| D2 | Navigation (`goto()`) called inside individual tests instead of `test.beforeEach()` |
| D3 | Test name does not follow `'should <verb> <what>'` convention |
| D4 | Multiple independent assertion concepts in a single `test()` block |
| D5 | `test.only()` present in committed code |
| D6 | `page.pause()` present in committed code |

#### Category E — Web-First Assertions
*Rule ref: Best Practice 3*

| Check | Fail = |
|---|---|
| E1 | `expect(await locator.isVisible()).toBe(true)` pattern instead of `expect(locator).toBeVisible()` |
| E2 | Manual polling loop (`while`, `setInterval`) used instead of a web-first assertion |
| E3 | `expect(await locator.textContent()).toBe(...)` instead of `expect(locator).toHaveText(...)` |
| E4 | `expect(await locator.getAttribute(...)).toBe(...)` instead of `expect(locator).toHaveAttribute(...)` |
| E5 | Negative assertion uses `toBe(false)` / `toBe(null)` instead of `.not.toBeVisible()` / `.not.toHaveText(...)` |

#### Category F — Smart Waits & Async Handling
*Rule ref: CLAUDE.md §4, §7 + Best Practice 7*

| Check | Fail = |
|---|---|
| F1 | `page.waitForTimeout()` used as primary wait strategy (not a last-resort MathQuill workaround) |
| F2 | `locator.fill()` used on a MathQuill field (`.dcg-mq-editable-field` or similar) |
| F3 | `page.keyboard.type()` used on a MathQuill field **without** a subsequent wait/assertion |
| F4 | `page.waitForFunction()` used when a simpler `expect(locator).toBeVisible()` would suffice |
| F5 | `await page.waitForTimeout(...)` value exceeds 500 ms without a comment explaining why |

#### Category G — Test Isolation
*Rule ref: Best Practice 2*

| Check | Fail = |
|---|---|
| G1 | Shared mutable state (variable declared outside `test()`) mutated across tests |
| G2 | One test depends on state produced by a sibling test (order dependency) |
| G3 | Preconditions for a test set up outside `test.beforeEach()` or the test itself |
| G4 | Storage/cookies modified globally without cleanup in `test.afterEach()` |

#### Category H — User-Visible Behaviour
*Rule ref: Best Practice 1 + CLAUDE.md §7*

| Check | Fail = |
|---|---|
| H1 | Canvas pixel data asserted directly (e.g. `getImageData`, raw pixel comparison) |
| H2 | Assertion targets an internal implementation detail not visible to the end user |
| H3 | Graph rendering verified only by absence of a JS error instead of a DOM proxy signal |
| H4 | Screenshot comparison used without a configured tolerance/threshold |

#### Category I — CI Readiness
*Rule ref: Best Practice 4 + CLAUDE.md §8*

| Check | Fail = |
|---|---|
| I1 | Hardcoded `localhost` or absolute URL instead of relying on `baseURL` from `playwright.config.ts` |
| I2 | Credentials, tokens, or secrets hardcoded in test files |
| I3 | `screenshot`, `video`, or `trace` settings overridden inside a test instead of in config |
| I4 | `test.only()` or `page.pause()` present (duplicate of D5/D6 — flag both categories) |
| I5 | Test relies on system-level state (specific timezone, locale, installed font) without forcing it in config |

#### Category J — Test Data Management
*Rule ref: Best Practice 8 + CLAUDE.md §2*

| Check | Fail = |
|---|---|
| J1 | Magic strings or numbers hardcoded inline instead of imported from `src/testData/constants.ts` |
| J2 | Test-specific data objects defined inline instead of in `src/testData/testData.ts` |
| J3 | Different tests use conflicting/overlapping hardcoded values for the same concept |
| J4 | Environment-specific values (URLs, timeouts) hardcoded instead of read from env/config |

---

### Step 4 — Determine severity for each finding

| Severity | Label | Criterion |
|---|---|---|
| P1 | **Critical** | Blocks correctness, CI stability, or architectural integrity. Must be fixed before merge. |
| P2 | **Warning** | Violates project conventions or best practices. Should be fixed in current or next sprint. |
| P3 | **Info** | Optional improvement that increases maintainability or readability. |

Default severity per category:
- **P1 Critical by default:** A1, A2, A6, B3, B4, C1, D5, D6, E1, F2, G1, G2, H1, I1, I2, I4
- **P2 Warning by default:** A3, A4, A5, B1, B2, B5, B6, C2, C3, C4, C5, C6, D1, D2, D3, D4, E2, E3, E4, E5, F1, F3, F4, G3, G4, H2, H3, H4, I3, I5, J1, J2, J3, J4
- **P3 Info:** Any check where the violation is minor style only with no functional impact

### Step 5 — Write the report files

**5a. Determine output paths**

- Run file: `docs/reviewReport/runs/REVIEW-<YYYY-MM-DD>-<scope>.md`
  - `<YYYY-MM-DD>` = today's date
  - `<scope>` = feature folder name (kebab-case) or `all`
  - If a file with that name already exists (same-day re-run), append a counter suffix: `-2`, `-3`, etc.
- Index file: `docs/reviewReport/INDEX.md`

Create `docs/reviewReport/runs/` if it does not exist.

**5b. Write the run report** using this exact structure:

```markdown
# Test Script Review — <scope> | <YYYY-MM-DD>

**Reviewer:** Claude (playwright-testScript-reviwer skill)
**Scope:** <scope>
**Files reviewed:**
- `src/tests/<file>.spec.ts`
- `src/pages/<File>.ts`
- `src/utils/fixtures/<file>.fixture.ts`

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
| **Total** | | **n** | **n** | **n** |

Status icons: ❌ has P1 issues · ⚠️ has P2+ issues only · ✅ fully clean

---

## P1 — Critical Issues

> Must be resolved before this code is merged.

### [ID]: [Short title]

**File:** `path/to/file.ts` · **Check:** A1 · **Rule:** CLAUDE.md §4

**Violation:**
```typescript
// what was found
```

**Fix:**
```typescript
// corrected version
```

**Why:** One sentence explaining the consequence of leaving this unfixed.

---

## P2 — Warnings

> Should be fixed in this sprint or the next.

(same sub-section format as P1)

---

## P3 — Info

> Optional improvements. No urgency.

(same sub-section format as P1, but abbreviated — omit "Why" if self-evident)

---

## Passed Checks

The following categories had zero violations:

- ✅ **[Category name]** — all [n] checks passed

---

## Retrospective

> Thematic root-cause analysis. Not a repetition of individual issues — identifies the underlying
> habits or gaps that produced multiple related findings, and prescribes concrete practices to avoid
> recurrence.

### Theme 1 — [Root cause title]

**Observed pattern:** [What multiple findings have in common]

**Root cause:** [Why this likely happened]

**How to prevent:**
- [Concrete habit or rule to adopt]
- [Tooling or review step that catches this early]

### Theme 2 — ...

(Repeat for each distinct theme. Include only themes that have ≥2 supporting findings or 1 P1 finding.)
```

**5c. Update INDEX.md**

If `docs/reviewReport/INDEX.md` does not exist, create it with this header:

```markdown
# Review Report Index

| Date | Scope | P1 Critical | P2 Warning | P3 Info | Report |
|---|---|---|---|---|---|
```

Append a new row for this run:

```markdown
| YYYY-MM-DD | <scope> | n | n | n | [REVIEW-YYYY-MM-DD-scope.md](./runs/REVIEW-YYYY-MM-DD-scope.md) |
```

Prepend new rows at the top (below the header) so the most recent run appears first.

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

---

## Output Rules (strict)

1. **Never** modify any file under `src/` or `docs/testCases/` or `docs/projectContext.md`.
2. The only files written are the run report and `INDEX.md` under `docs/reviewReport/`.
3. Do not show the full report content in chat — confirm the file path and print only the Summary
   table and total counts to the chat window as confirmation.
4. Do not invent findings. Every finding must cite the exact file, a real code pattern observed,
   and the specific check ID from this skill.
5. All code blocks in the report must use the `typescript` language tag.

---

## Reference files

Load only when needed:

| File | Load when |
|---|---|
| `CLAUDE.md` | Always — load at Step 1 before any analysis |
| `docs/projectContext.md` | Always — load at Step 1 before any analysis |
| `src/tests/<file>.spec.ts` | For each file in scope |
| `src/pages/<File>.ts` | For each POM associated with the scope |
| `src/utils/fixtures/<file>.fixture.ts` | For each fixture associated with the scope |
