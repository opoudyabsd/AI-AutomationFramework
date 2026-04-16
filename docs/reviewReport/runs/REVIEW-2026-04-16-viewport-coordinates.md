# Test Script Review — viewport-coordinates | 2026-04-16

**Reviewer:** Claude (playwright-testScript-reviwer skill)
**Scope:** viewport-coordinates
**Test types reviewed:** API
**Files reviewed:**
- `src/tests/api/viewport-coordinates/viewport-coordinates.spec.ts`
- `src/utils/fixtures/api-calculator.fixture.ts`
- `src/testData/apiConfig.ts`
- `src/testData/apiTestData.ts`

**Test cases loaded for K-coverage check:**
- `docs/APITestCases/viewport-coordinates/TC-API-VIEWPORT-001-set-viewport-with-setmathbounds.md` ⚠️ file exists but is empty (1 line)
- `docs/APITestCases/viewport-coordinates/TC-API-VIEWPORT-003-observe-graphpaperbounds-for-viewport-changes.md` ⚠️ file exists but is empty (1 line)

---

## Summary

| Category | Applies to | Status | P1 Critical | P2 Warning | P3 Info |
|---|---|---|---|---|---|
| A — Architecture & Structure | UI + API | ✅ | 0 | 0 | 0 |
| B — Page Object Model Quality | UI only | — | — | — | — |
| C — Selector Stability | UI only | — | — | — | — |
| D — Test Structure & Naming | UI + API | ✅ | 0 | 0 | 0 |
| E — Web-First Assertions | UI + API | ⚠️ | 0 | 1 | 0 |
| F — Smart Waits & Async Handling | UI + API | ✅ | 0 | 0 | 0 |
| G — Test Isolation | UI + API | ✅ | 0 | 0 | 0 |
| H — User-Visible Behaviour | UI only | — | — | — | — |
| I — CI Readiness | UI + API | ✅ | 0 | 0 | 0 |
| J — Test Data Management | UI + API | ⚠️ | 0 | 0 | 2 |
| K — Test Case Coverage | UI + API | ⚠️ | 0 | 1 | 0 |
| L — Design Principles | UI + API | ⚠️ | 0 | 1 | 0 |
| M — API Test Architecture | API only | ✅ | 0 | 0 | 0 |
| **Total** | | | **0** | **3** | **2** |

Status icons: ❌ has P1 issues · ⚠️ has P2+ issues only · ✅ fully clean · — not applicable to this scope

---

## P1 — Critical Issues

> None.

---

## P2 — Warnings

---

**File:** `docs/APITestCases/viewport-coordinates/TC-API-VIEWPORT-001-*.md` and `TC-API-VIEWPORT-003-*.md` · **Check:** K6 + K3 · **Rule:** checklist-categories.md Category K

**Violation:**

Both TC doc files exist in `docs/APITestCases/viewport-coordinates/` but contain only 1 line each
(effectively empty — no title, no preconditions, no steps, no expected outcomes).

The spec coverage comment marks TC-001 as `✅ automated`:

```typescript
// Coverage status for viewport-coordinates API (as of 2026-04-16):
//   TC-API-VIEWPORT-001 ✅ automated — setMathBounds updates viewport to requested bounds
//   TC-API-VIEWPORT-003 ⏳ pending   — graphpaperBounds observer emits on viewport changes
```

But with empty TC files there is nothing to verify the implementation against, and no specification
to implement TC-003 from.

**Fix:**

Populate both TC markdown files with the standard project template. Minimum required fields:

```markdown
# TC-API-VIEWPORT-001 — Set viewport with setMathBounds

**Priority:** 4
**Type:** Positive
**API surface:** setMathBounds, graphpaperBounds.mathCoordinates

## Preconditions
- Calculator initialised with default options (no constructor overrides).
- Default Desmos viewport is active: left -10, right 10, bottom -10, top 10.

## Steps
1. Capture initial math bounds via graphpaperBounds.mathCoordinates.
2. Call setMathBounds({ left: -20, right: 20, bottom: -5, top: 5 }).
3. Read the updated math bounds.

## Expected outcome
The returned bounds equal the values passed to setMathBounds exactly:
left -20, right 20, bottom -5, top 5.
```

**Why:** The ✅ automated marker in the coverage comment is meaningless without a spec to check the
implementation against. Any divergence between the test and the intended behaviour is invisible to
reviewers. TC-003 cannot be planned or implemented until it has documented steps and expected outcomes.

---

**File:** `src/tests/api/viewport-coordinates/viewport-coordinates.spec.ts` · **Check:** L6 · **Rule:** checklist-categories.md Category L (KISS)

**Violation:**

`expect.poll` is used to assert the result of `setMathBounds`, a synchronous Desmos API call:

```typescript
// viewport-coordinates.spec.ts lines 25-27
await expect
    .poll(async () => await calculator.getMathBounds())
    .toEqual(VIEWPORT_BOUNDS.STANDARD_WINDOW);
```

`expect.poll` is a retry-polling mechanism that implies the value may not be immediately correct —
it retries the callback until the assertion passes or times out. However, `setMathBounds` is
synchronous: `getMathBounds()` returns the updated value on the very next call.

The parallel implementation in `calculator-core.spec.ts` (TC-API-CORE-003) proves this:

```typescript
// calculator-core.spec.ts lines 105-107 — same API, no polling needed
await calculator.setMathBounds(INVALID_BOUNDS.EQUAL_X);
const boundsAfterInvalidX = await calculator.getMathBounds();
expect(boundsAfterInvalidX).toEqual(initialBounds);
```

**Fix:**

```typescript
// Before
await expect
    .poll(async () => await calculator.getMathBounds())
    .toEqual(VIEWPORT_BOUNDS.STANDARD_WINDOW);

// After — consistent with calculator-core.spec.ts pattern
const updatedBounds = await calculator.getMathBounds();
expect(updatedBounds).toEqual(VIEWPORT_BOUNDS.STANDARD_WINDOW);
```

**Why:** Using `expect.poll` for a synchronous operation signals to future readers that async settling
is expected, which is incorrect. It creates a false mental model about the API's behaviour, slows
down the test if the assertion happens to time-wait unnecessarily, and is inconsistent with the
established pattern in the same codebase.

---

**File:** `src/tests/api/viewport-coordinates/viewport-coordinates.spec.ts` · **Check:** E5 · **Rule:** checklist-categories.md Category E

**Violation:**

The precondition assertion on line 21 is vacuously true:

```typescript
// viewport-coordinates.spec.ts lines 19-21
const initialBounds = await calculator.getMathBounds();

expect(initialBounds).not.toEqual(VIEWPORT_BOUNDS.STANDARD_WINDOW);
```

The Desmos default viewport is `{ left: -10, right: 10, bottom: -10, top: 10 }`.
`VIEWPORT_BOUNDS.STANDARD_WINDOW` is `{ left: -20, right: 20, bottom: -5, top: 5 }`.

These are structurally different values. This `not.toEqual` assertion can **never fail** under normal
or broken-fixture conditions, because the Desmos default will never equal `STANDARD_WINDOW`. It
provides false confidence that the test is guarded against a pre-contaminated fixture state.

**Fix:**

Replace the vacuous negative check with a positive precondition that would actually catch a broken
or contaminated starting state:

```typescript
// Before — vacuously true, can never fail
expect(initialBounds).not.toEqual(VIEWPORT_BOUNDS.STANDARD_WINDOW);

// After — asserts the fixture starts from the known Desmos default
// Uses the MathBounds property convention ({left, right, bottom, top})
const DESMOS_DEFAULT_BOUNDS = { left: -10, right: 10, bottom: -10, top: 10 };
expect(initialBounds).toEqual(DESMOS_DEFAULT_BOUNDS);
```

Alternatively, if a shared constant is preferred, add a `DEFAULT_MATH_BOUNDS` entry to
`apiTestData.ts` alongside `VIEWPORT_BOUNDS` (see also P3 J4 note on the existing
`EXPECTED_STATES.DEFAULT_VIEWPORT` constant below):

```typescript
// In apiTestData.ts
export const VIEWPORT_BOUNDS = {
    DEFAULT: { left: -10, right: 10, bottom: -10, top: 10 },     // Desmos default
    STANDARD_WINDOW: { left: -20, right: 20, bottom: -5, top: 5 }, // test target
} as const;

// In spec
expect(initialBounds).toEqual(VIEWPORT_BOUNDS.DEFAULT);
```

**Why:** A negative assertion that can never fail adds no safety and misleads reviewers into thinking
the test is guarded. If the fixture ever starts in a contaminated state (e.g. due to a future
scope-sharing change), this precondition will pass silently and the test will produce a false
positive or a confusing final-assertion failure.

---

## P3 — Info

---

**File:** `src/testData/apiTestData.ts` · **Check:** J4 · **Rule:** checklist-categories.md Category J

**Violation:**

```typescript
// apiTestData.ts lines 34-36
export const VIEWPORT_BOUNDS = {
    STANDARD_WINDOW: { left: -20, right: 20, bottom: -5, top: 5 },
} as const;
```

The name `STANDARD_WINDOW` is ambiguous. "Standard" implies the default or typical Desmos viewport —
which it is not (the actual Desmos default is ±10 on both axes). The name also does not communicate
the intentional asymmetry: the x-range is 4× wider than the y-range, a deliberate choice to produce
bounds that are both valid and clearly distinct from the default.

**Fix:**

```typescript
export const VIEWPORT_BOUNDS = {
    DEFAULT:          { left: -10, right: 10, bottom: -10, top: 10 }, // Desmos factory default
    WIDE_LANDSCAPE:   { left: -20, right: 20, bottom: -5,  top: 5  }, // non-default: wide x, narrow y
} as const;
```

---

**File:** `src/testData/apiTestData.ts` · **Check:** J4 · **Rule:** checklist-categories.md Category J

**Violation:**

```typescript
// apiTestData.ts lines 17-24
export const EXPECTED_STATES = {
    DEFAULT_VIEWPORT: {
        xmin: -10,
        xmax: 10,
        ymin: -10,
        ymax: 10,
    },
} as const;
```

`EXPECTED_STATES.DEFAULT_VIEWPORT` uses `{ xmin, xmax, ymin, ymax }` property names — the
serialisation convention used by Desmos's `getState()`/`setState()` API. However,
`calculator.getMathBounds()` returns the `MathBounds` type `{ left, right, bottom, top }` —
the convention used by `graphpaperBounds.mathCoordinates`.

These two naming conventions are not interchangeable. `EXPECTED_STATES.DEFAULT_VIEWPORT`
cannot be compared directly against `getMathBounds()` output, despite its name implying it is
the reference for the default viewport. This creates confusion about which constant to use in
viewport assertions and is one reason the vacuous precondition (E5 above) was hard to fix with
an existing constant.

**Fix:**

Add a `MathBounds`-typed default entry in `VIEWPORT_BOUNDS` (see J4 fix above), and clarify
the comment on `EXPECTED_STATES.DEFAULT_VIEWPORT` to restrict its scope:

```typescript
// EXPECTED_STATES — shapes use the getState()/setState() property convention.
// Do NOT use these for getMathBounds() / setMathBounds() comparisons.
export const EXPECTED_STATES = {
    DEFAULT_VIEWPORT: {
        xmin: -10,  // getState() / setState() property names
        xmax: 10,
        ymin: -10,
        ymax: 10,
    },
} as const;
```

---

## Passed Checks

- ✅ **A — Architecture & Structure** — all 7 checks passed. Imports from fixture, correct file location, no raw locators, TC reference in comment block (not in test name string).
- ✅ **D — Test Structure & Naming** — all 6 checks passed. `test.describe` present, calculator init in fixture, test title follows `should <verb> <what>`, single scenario concept, no `test.only` or `page.pause`.
- ✅ **F — Smart Waits & Async Handling** — all applicable checks passed. No raw `waitForTimeout`.
- ✅ **G — Test Isolation** — all 4 checks passed. Fresh fixture per test, no shared mutable state.
- ✅ **I — CI Readiness** — all 6 checks passed. Env var guard present in fixture with descriptive error, no account-specific preconditions, no fixme/skip, deterministic setup.
- ✅ **M — API Test Architecture** — all 10 checks passed. Namespaced window global (`__testCalc_${random}`), CDN guard with explicit 15 s timeout, all called methods (`setMathBounds`, `getMathBounds`) are proxied in the fixture, config/data separation maintained, `destroy()` cleans up both calculator and events keys, coverage status comment present, `unknown` used for opaque state.

---

## Retrospective

### Theme 1 — TC Documentation Created as Stubs and Never Populated

**Observed pattern:** Both TC files in `docs/APITestCases/viewport-coordinates/` are empty shells (1 line). The spec was written and marked ✅ automated before — or without — the TC documentation being filled in.

**Root cause:** The typical AI-assisted workflow (`desmos-api-testcase-creator` → `playwright-api-script-generator`) produces both TC docs and spec in a single pass. When either the spec or the TC docs are written in isolation, the other artefact is omitted or left as a placeholder. Here the spec was authored first; the TC files were created as filename stubs but their content was never committed.

**How to prevent:**
- Before marking a TC as ✅ automated in the coverage comment, verify that the corresponding `.md` file contains at least a Preconditions, Steps, and Expected outcome section.
- Run `playwright-test-coverage-auditor` as a pre-merge gate — it would flag these stubs as K6 coverage gaps.

---

### Theme 2 — API Synchrony Assumption Not Verified Against Existing Codebase

**Observed pattern:** `expect.poll` was used for a synchronous API call (E2 + L6), and the precondition assertion was vacuously negative rather than positively grounded in the known default (E5). Both errors share the same root cause: the test was written without cross-referencing the existing `calculator-core.spec.ts`, which already exercises the same `setMathBounds`/`getMathBounds` pair.

**Root cause:** When a new spec is created for a feature area that partially overlaps with an existing spec, the author may not search the codebase for prior art. `calculator-core.spec.ts` TC-API-CORE-003 establishes the canonical pattern for `setMathBounds` (direct assertion, no polling). Ignoring that pattern produces both unnecessary complexity and a weaker precondition.

**How to prevent:**
- Before writing any assertion involving an already-proxied fixture method (`setMathBounds`, `getMathBounds`), search the codebase for existing usages and mirror the established pattern.
- The reviewer skill now flags `expect.poll` for synchronous API calls under L6; running a review before merge would have caught this.
- Add a `VIEWPORT_BOUNDS.DEFAULT` constant alongside `VIEWPORT_BOUNDS.STANDARD_WINDOW` so precondition assertions have a concrete reference to use (P3 J4 fix), making it easy to write `expect(initialBounds).toEqual(VIEWPORT_BOUNDS.DEFAULT)` without needing an ad-hoc inline object.
