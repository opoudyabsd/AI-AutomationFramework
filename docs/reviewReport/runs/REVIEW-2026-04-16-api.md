# Test Script Review — api (calculator-core) | 2026-04-16

**Reviewer:** Claude (playwright-testScript-reviwer skill)
**Scope:** api / calculator-core
**Files reviewed:**
- `src/tests/api/calculator-core/calculator-core.spec.ts`
- `src/utils/fixtures/api-calculator.fixture.ts`
- `src/testData/apiTestData.ts`

**Test cases loaded for K-coverage check:**
- `docs/APITestCases/calculator-core/TC-API-CORE-001-initialize-graphing-calculator-with-default-options.md`
- `docs/APITestCases/calculator-core/TC-API-CORE-002-set-state-overwrites-graph-settings-but-not-constructor-options.md`
- `docs/APITestCases/calculator-core/TC-API-CORE-003-reject-invalid-math-bounds-without-changing-viewport.md`
- `docs/APITestCases/calculator-core/TC-API-CORE-004-emit-change-event-with-api-initiation-flag.md`

---

## Summary

| Category | Status | P1 Critical | P2 Warning | P3 Info |
|---|---|---|---|---|
| A — Architecture & Structure | ⚠️ | 0 | 1 | 0 |
| B — Page Object Model Quality | ✅ | 0 | 0 | 0 |
| C — Selector Stability | ✅ | 0 | 0 | 0 |
| D — Test Structure & Naming | ✅ | 0 | 0 | 0 |
| E — Web-First Assertions | ⚠️ | 0 | 1 | 0 |
| F — Smart Waits & Async Handling | ✅ | 0 | 0 | 0 |
| G — Test Isolation | ⚠️ | 0 | 1 | 0 |
| H — User-Visible Behaviour | ✅ | 0 | 0 | 0 |
| I — CI Readiness | ⚠️ | 0 | 2 | 0 |
| J — Test Data Management | ⚠️ | 0 | 1 | 2 |
| K — Test Case Coverage | ⚠️ | 0 | 3 | 1 |
| **Total** | | **0** | **9** | **3** |

Status icons: ❌ has P1 issues · ⚠️ has P2+ issues only · ✅ fully clean

> **Note on applicability:** This is a Playwright-based API test, not a UI test. Categories B (POM Quality), C (Selector Stability), and H (User-Visible Behaviour) are partially or fully not applicable. Findings in those categories are marked N/A. All applicable checks were evaluated.

---

## P1 — Critical Issues

> None. The spec, fixture, and test data contain no P1-severity violations.

---

## P2 — Warnings

> Should be fixed in this sprint or the next.

---

**File:** `src/tests/api/calculator-core/calculator-core.spec.ts` · **Check:** A5 · **Rule:** CLAUDE.md §3

**Violation:**
```typescript
// File path: src/tests/api/calculator-core/calculator-core.spec.ts
// CLAUDE.md §3 defines exactly four allowed subdirectories under src/tests/:
//   smoke/ | regression/ | e2e/ | performance/
// 'api/' is not listed.
```

**Fix:**
Add `api/` to the folder structure in CLAUDE.md §3 and §4:
```markdown
tests/
  smoke/
  regression/
  e2e/
  performance/
  api/              # Desmos JavaScript Embed API contract tests
```
And update the File Naming table:
```markdown
| Test spec (API) | src/tests/api/{feature}/ | kebab-case.spec.ts | calculator-core.spec.ts |
```

**Why:** Undocumented subfolders are invisible to contributors following CLAUDE.md. The next engineer writing an API test for a different feature has no guidance on where to place it, causing structural drift.

---

**File:** `src/tests/api/calculator-core/calculator-core.spec.ts` · **Line:** 19 · **Check:** E1 · **Rule:** CLAUDE.md §5

**Violation:**
```typescript
expect(Array.isArray(expressions)).toBe(true);
```

**Fix:**
```typescript
expect(expressions).toBeInstanceOf(Array);
```

**Why:** `Array.isArray(expressions)` is a manual boolean check that does not benefit from Playwright's assertion retry semantics. `toBeInstanceOf(Array)` is the idiomatic Jest/Playwright form, produces a clearer failure message ("Expected value to be an instance of Array" vs "Expected false to be true"), and signals intent directly.

---

**File:** `src/utils/fixtures/api-calculator.fixture.ts` · **Lines:** 55, 67, 73, 79, 84, 91 · **Check:** G2 · **Rule:** CLAUDE.md §3 (isolation)

**Violation:**
```typescript
// Calculator instance stored on the window global — shared across all evaluate() calls
(window as any).__testCalculator = calc;
// …
(window as any).__testCalculator.setExpression(opts);
```

**Fix:**
Instead of a window global, evaluate a self-contained function that returns all needed data inline, or — for multi-call scenarios — pass the calculator handle implicitly by keeping the page context:
```typescript
// Option A: inline evaluation — all operations in one evaluate() call when possible
const result = await desmosApiPage.evaluate(({ containerId, opts }) => {
  const elt = document.getElementById(containerId)!;
  const calc = (window as any).Desmos.GraphingCalculator(elt);
  calc.setExpression(opts);
  const exprs = calc.getExpressions();
  calc.destroy();
  return exprs;
}, { containerId: API_CONFIG.CALCULATOR_CONTAINER_ID, opts: options });

// Option B: keep the global but namespace it with a unique test ID to prevent
// collision when tests run in parallel in the same browser context:
const globalKey = `__testCalculator_${Date.now()}`;
(window as any)[globalKey] = calc;
```

**Why:** `window.__testCalculator` is a single mutable global. If the `calculator` fixture scope is ever changed from `'function'` (default) to `'context'` or `'worker'`, multiple tests will share the same window and overwrite each other's calculator references. Even at function scope, a fixture ordering bug that causes two tests to run before teardown can cause silent state corruption. A scoped or namespaced key eliminates the risk entirely.

---

**File:** `src/utils/fixtures/api-calculator.fixture.ts` · **Line:** 32 · **Check:** I2 · **Rule:** CLAUDE.md §9; CI best practices

**Violation:**
```typescript
await page.setContent(`
  <script src="https://www.desmos.com/api/${API_CONFIG.DESMOS_API_VERSION}/calculator.js?apiKey=${desmosApiKey}"></script>
`);
```

**Fix:**
Document the external CDN dependency and add a meaningful timeout with a clear failure message for CI environments:
```typescript
// NOTE: This test suite requires outbound HTTPS access to https://www.desmos.com/api/
// If running in an isolated CI environment, ensure the CDN is reachable or
// provide a local bundle via DESMOS_API_LOCAL_BUNDLE env variable.
await page.setContent(`...`);

// waitForFunction already retries; add a generous timeout and a meaningful message
await page.waitForFunction(
  () => typeof (window as any).Desmos !== 'undefined',
  { timeout: 15000 }  // CDN load can be slow in CI — explicit timeout prevents hanging
);
```

Also add to test documentation: this suite requires network access to `desmos.com`.

**Why:** A CDN download failure manifests as a timeout error with no diagnostic context, making CI failures hard to triage. An explicit comment + timeout cap + network access note in the README makes the failure mode visible upfront.

---

**File:** `src/utils/fixtures/api-calculator.fixture.ts` · **Line:** 6 (version embedded in URL) · **Check:** I3 · **Rule:** CLAUDE.md §9

**Violation:**
```typescript
// API_CONFIG.DESMOS_API_VERSION: 'v1.11' — hardcoded in apiTestData.ts
src="https://www.desmos.com/api/${API_CONFIG.DESMOS_API_VERSION}/calculator.js?apiKey=..."
```

**Fix:**
No code change required today (the version IS centralized in `API_CONFIG`). Add a test in CI that asserts the API version responds with a 200 status before the suite runs, so a version deprecation fails fast with a clear error rather than a cascade of cryptic timeout failures:
```typescript
// In fixture setup or a global setup file:
const scriptUrl = `https://www.desmos.com/api/${API_CONFIG.DESMOS_API_VERSION}/calculator.js`;
const response = await page.request.head(scriptUrl);
expect(response.status(), `Desmos API ${API_CONFIG.DESMOS_API_VERSION} unreachable — check for deprecation`).toBe(200);
```

**Why:** When Desmos deprecates a version (returns 404 or redirect), every test in the suite silently times out. A pre-flight check surfaces "API version deprecated" within seconds rather than after 4 × 15 s timeouts.

---

**File:** `src/testData/apiTestData.ts` · **Lines:** 4–8 · **Check:** J3 · **Rule:** CLAUDE.md §3 (layer separation)

**Violation:**
```typescript
// Fixture implementation config and test inputs are merged in one file:
export const API_CONFIG = {          // ← fixture config (belongs in fixture or a config module)
  DESMOS_API_VERSION: 'v1.11',
  CALCULATOR_CONTAINER_ID: 'calculator',
  DEFAULT_CONTAINER_SIZE: { width: 600, height: 400 },
};

export const TEST_EXPRESSIONS = {   // ← test data (correct placement)
  SIMPLE_LINEAR: { id: 'line', latex: 'y=x' },
};
```

**Fix:**
Move `API_CONFIG` to the fixture file or to a dedicated `src/testData/apiConfig.ts`:
```typescript
// src/testData/apiConfig.ts
export const API_CONFIG = {
  DESMOS_API_VERSION: 'v1.11',
  CALCULATOR_CONTAINER_ID: 'calculator',
  DEFAULT_CONTAINER_SIZE: { width: 600, height: 400 },
};
```
Keep `apiTestData.ts` for pure test inputs (`TEST_EXPRESSIONS`, `EXPECTED_STATES`).

**Why:** Mixing infrastructure config with test data makes it harder to audit "what values does this test depend on" vs "what config does the harness need to boot". When `CALCULATOR_CONTAINER_ID` needs to change, it should be an infrastructure change, not a test-data change.

---

**Files:** `src/tests/api/calculator-core/calculator-core.spec.ts` · **Check:** K1 · **Rule:** checklist-categories.md Category K

**Violation:**
```typescript
// TC reference is embedded in the test name string — non-standard in this project:
test('[TC-API-CORE-001] should initialize graphing calculator with default options', ...)

// UI tests use the standard comment block:
// TC-E2-E2E-001 | Priority 4
// Description...
test('should ...', ...)
```

**Fix:**
```typescript
// TC-API-CORE-001 | Priority 5
// Initialize GraphingCalculator with default options.
// API surface: GraphingCalculator constructor, setExpression, getExpressions.
test('should initialize graphing calculator with default options',
```

**Why:** Embedding `[TC-API-CORE-001]` in the test name makes Playwright HTML reports noisy, breaks sorting by feature, and diverges from the project's established `// TC-*` traceability convention. Using a comment block keeps the test name short and scannable while preserving the TC reference in the source.

---

**Files:** `src/tests/api/calculator-core/calculator-core.spec.ts` · **Check:** K4 · **Rule:** checklist-categories.md Category K

**Violation:**
Three of the four documented TC-API-CORE test cases have no automated tests:

| TC ID | Title | Automated |
|---|---|---|
| TC-API-CORE-001 | Initialize GraphingCalculator with default options | ✅ |
| TC-API-CORE-002 | setState overwrites graph settings but not constructor options | ❌ |
| TC-API-CORE-003 | Reject invalid math bounds without changing viewport | ❌ |
| TC-API-CORE-004 | Emit change event with API initiation flag | ❌ |

**Fix:**
Implement TC-API-CORE-002, -003, -004 in `calculator-core.spec.ts`. The fixture's `DesmosCalculator` proxy will need to be extended to expose:
- `TC-API-CORE-002`: `updateSettings`, `settings` observable
- `TC-API-CORE-003`: `setMathBounds`, `graphpaperBounds` observable
- `TC-API-CORE-004`: `observeEvent`, `unobserveEvent`

**Why:** A 25% coverage rate (1/4 cases) means the API contract for three important behaviors — state persistence semantics, bound validation, and event emission — is entirely unverified.

---

**Files:** `src/tests/api/calculator-core/calculator-core.spec.ts` · **Check:** K6 · **Rule:** checklist-categories.md Category K

**Violation:**
The `calculator-core` feature has 4 documented TC files but only 1 automated test. No summary comment in the spec marks TC-002/003/004 as deferred or manual.

**Fix:**
Add a coverage summary comment at the top of the spec:
```typescript
// Coverage status for calculator-core API (as of 2026-04-16):
//   TC-API-CORE-001 ✅ automated (this file)
//   TC-API-CORE-002 ⏳ not yet automated — requires updateSettings + settings proxy
//   TC-API-CORE-003 ⏳ not yet automated — requires setMathBounds + graphpaperBounds proxy
//   TC-API-CORE-004 ⏳ not yet automated — requires observeEvent + unobserveEvent proxy
```

**Why:** Without this marker, the 3 missing tests appear to be accidental omissions rather than planned follow-up work. A coverage comment creates accountability and gives reviewers the full picture in one place.

---

## P3 — Info

> Optional improvements. No urgency.

---

**File:** `src/utils/fixtures/api-calculator.fixture.ts` · **Lines:** 14–15 · **Check:** J3 (type safety)

```typescript
setState: (state: any) => Promise<void>;
getState: () => Promise<any>;
```

The `any` type on `setState`/`getState` bypasses TypeScript's type checking for Desmos state objects. If the API surface is to be treated as opaque (per the TC-002 note: "docs treat state as opaque"), at minimum use `unknown` to force an explicit cast at the call site:
```typescript
setState: (state: unknown) => Promise<void>;
getState: () => Promise<unknown>;
```

This has no functional impact but prevents accidental structural access on the opaque state object without an explicit assertion or cast.

---

**File:** `src/testData/apiTestData.ts` · **Lines:** 17–20, 23–30 · **Check:** J2

```typescript
SIMPLE_PARABOLA: { id: 'parabola', latex: 'y=x^2' },  // defined, never used
// ...
EXPECTED_STATES: { DEFAULT_VIEWPORT: { xmin: -10, ... } }  // defined, never used
```

`TEST_EXPRESSIONS.SIMPLE_PARABOLA` and `EXPECTED_STATES.DEFAULT_VIEWPORT` are unused by any current test. They are forward-looking stubs for TC-002/003/004. No change needed now, but once TC-002 through TC-004 are implemented, confirm these constants are actually used rather than duplicated inline.

---

**File:** `src/utils/fixtures/api-calculator.fixture.ts` · **Lines:** 64–97 · **Check:** A3 (design note)

```typescript
// DesmosCalculator proxy is entirely defined inside the fixture function,
// not as a class in src/pages/. The proxy wraps page.evaluate() calls
// but has no constructor, no type export usable from a spec file, and
// no path that would let a second fixture reuse it.
```

The proxy pattern works for a single fixture/spec pair. If a second API feature (e.g., `accessibility-api.spec.ts`) needs the same `setExpression` / `getExpressions` calls, the entire proxy must be duplicated or extracted. Consider promoting the proxy to a class in `src/pages/CalculatorApiPage.ts` early, before duplication occurs:
```typescript
// src/pages/CalculatorApiPage.ts
export class CalculatorApiPage {
  constructor(private readonly page: Page) {}

  async setExpression(opts: { id: string; latex: string }): Promise<void> { ... }
  async getExpressions(): Promise<Array<{ id: string; latex?: string }>> { ... }
  // ...
}
```

This is not a current violation (there is only one API spec), but the cost of this refactor grows linearly with each new API spec file.

---

**File:** `src/tests/api/calculator-core/calculator-core.spec.ts` · **Lines:** 5–7 · **Check:** K5

```typescript
// TC title:   "Initialize GraphingCalculator with default options"
// Spec title: "[TC-API-CORE-001] should initialize graphing calculator with default options"
```

Minor: TC title is PascalCase ("Initialize"), spec body is lowercase ("should initialize"). The semantic content is identical. After fixing K1 (removing the `[TC-API-CORE-001]` prefix), align casing for visual consistency.

---

## Passed Checks

The following categories had zero violations:

- ✅ **B — Page Object Model Quality** — The `DesmosCalculator` proxy pattern is an appropriate API-layer adaptation: all methods are verb-first, no assertions exist inside the proxy, setup is fully fixture-managed, and the proxy is not instantiated directly inside the spec. N/A checks (B1, B4, B5, B6) were excluded from evaluation.
- ✅ **C — Selector Stability** — No DOM selectors appear in the spec. The fixture uses `document.getElementById` (stable, driven by `API_CONFIG.CALCULATOR_CONTAINER_ID`) and no CSS or XPath patterns. N/A checks (C1–C6) were excluded.
- ✅ **D — Test Structure & Naming** — `test.describe()` wrapper present, test name follows `should <verb>` pattern, no `test.only()` or `page.pause()` artifacts.
- ✅ **F — Smart Waits & Async Handling** — `waitForFunction(() => typeof Desmos !== 'undefined')` is the correct idiom for script-load detection. No hardcoded `waitForTimeout` in spec or fixture. All `evaluate()` calls are properly `await`-ed. No `fill()` or MathQuill concerns apply.
- ✅ **H — User-Visible Behaviour** — API tests validate JavaScript contract behaviour, not visible DOM state. The assertions verify the API's published contract (expression round-trip, data shape) rather than internal implementation details.

---

## Retrospective

---

### Theme 1 — Skeleton Spec: Infrastructure Solid, Coverage Missing (K4, K6, A5)

**Observed pattern:** The fixture is well-engineered — API key via env, proper teardown, `waitForFunction` guard, clean proxy abstraction — but the spec file contains only 1 of 4 documented test cases. The new `api/` folder is also undocumented in CLAUDE.md.

**Root cause:** The spec appears to be an initial scaffold, committed before the remaining three test cases were implemented. The infrastructure cost (fixture, page setup, proxy) was paid upfront, but the test coverage was deferred without a visible marker.

**How to prevent:**
- When committing a new spec folder, add a coverage-status comment block at the top listing all TCs and their automation status (`✅ / ⏳ / ❌`).
- Update CLAUDE.md §3 and §4 immediately when a new folder is created — treat CLAUDE.md as a living document, not a post-hoc summary.
- Use the K6 coverage comment as a "definition of done" checklist: the spec is not review-ready until either all TCs are covered or every gap has an explicit deferral reason.

---

### Theme 2 — Mutable Window Global as Cross-Call State Carrier (G2)

**Observed pattern:** The fixture stores the calculator instance as `window.__testCalculator` to share it across multiple `page.evaluate()` calls. This is a pragmatic solution (Playwright cannot pass non-serializable objects across the JS boundary), but it creates hidden shared state.

**Root cause:** Playwright's `page.evaluate()` serializes arguments and return values via JSON, which means live object references cannot be passed directly. The developer used the window global as the "bridge" — a natural first approach but one that carries isolation risk.

**How to prevent:**
- For multi-call scenarios, consider keeping all operations in a single `evaluate()` call when the sequence is deterministic.
- If multi-call is unavoidable, namespace the global with a unique key per test run (`__testCalc_${crypto.randomUUID().slice(0, 8)}`) and clean it up in `finally`.
- Document the trade-off explicitly in the fixture so future contributors understand why the global exists and what scope it is safe at.

---

### Theme 3 — Config and Data Mixed in One Module (J3)

**Observed pattern:** `apiTestData.ts` exports both `API_CONFIG` (fixture harness settings: version string, container ID, pixel dimensions) and `TEST_EXPRESSIONS`/`EXPECTED_STATES` (actual test inputs). These serve different consumers at different change frequencies.

**Root cause:** The file was named `apiTestData.ts` when the first constants were created, and subsequent config constants were appended without questioning the boundary.

**How to prevent:**
- Establish the naming convention early: files named `*TestData.ts` contain test inputs; files named `*Config.ts` or `*Constants.ts` contain infrastructure parameters.
- During review, check whether a constant in `testData.ts` would need to change if the test scenario changed vs if the infrastructure changed. If the answer is "infrastructure", it belongs in config, not data.
