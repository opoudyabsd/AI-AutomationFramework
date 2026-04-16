## Category C — Selector Stability

*Applies to: **UI tests only**. For API tests, evaluate evaluate()-boundary patterns under Category M.*

| Check | Fail = | Why it matters |
|---|---|---|
| C1 | XPath selector used anywhere in test, fixture, or POM code | XPath tightly couples tests to DOM structure and is explicitly forbidden by project rules |
| C2 | Semantic locator opportunity exists, but code uses a lower-priority selector instead | Misses the most stable, user-facing locator and increases selector drift risk |
| C3 | Generic CSS selector is unscoped or overly broad for the target interaction | Broad selectors often match multiple elements and become flaky after minor UI changes |
| C4 | Selector relies on positional structure such as `nth-child`, sibling order, or deep descendant chains without a stable anchor | Structural selectors are brittle when layout changes but behaviour does not |
| C5 | Same raw selector string is duplicated across multiple tests instead of being centralized in a POM locator or shared constant | Duplicated selectors drift independently and make large selector updates expensive |
| C6 | Locator strategy depends on volatile text, placeholder, or CSS state when a more stable accessible label, role, or scoped container is available | Volatile locators fail after harmless copy or styling changes |

## Category D — Test Structure & Naming

*Applies to: **UI tests and API tests**.*

| Check | Fail = | Why it matters |
|---|---|---|
| D1 | Spec file lacks a `test.describe()` wrapper for its feature scope | Feature grouping becomes inconsistent and report structure is harder to scan |
| D2 | Navigation to the target page happens inside individual tests instead of `test.beforeEach()` — UI tests; for API tests, per-test calculator init happens in test body instead of fixture | Repeated setup code hides the real scenario and invites divergence between tests |
| D3 | Test title does not follow the `should <verb> <what>` pattern or is vague about the observed behaviour | Weak names reduce report readability and make failures harder to triage |
| D4 | A test mixes multiple scenario concepts or multiple unrelated assertion themes in one flow | Coupled scenarios are harder to debug and usually indicate missing coverage boundaries |
| D5 | Temporary debugging filters such as `test.only()` or ad-hoc skip focus markers are committed | Focused runs break suite integrity in CI and can silently hide coverage |
| D6 | Interactive debugging artifacts such as `page.pause()` or equivalent committed debug stops remain in test code | Debug leftovers block unattended execution and violate CI-safe workflow expectations |

## Category E — Web-First Assertions

*Applies to: **UI tests and API tests**. For UI tests, "web-first" means Playwright locator matchers. For API tests, it means using Playwright/Jest matchers (e.g. `toBeInstanceOf`, `toEqual`) rather than manual JS evaluation.*

| Check | Fail = | Why it matters |
|---|---|---|
| E1 | Test uses manual state reads such as `isVisible()`, `textContent()`, or boolean comparisons where a Playwright web-first matcher should be used | Manual reads do not auto-retry and turn transient UI timing into false failures |
| E2 | Locator assertions use generic truthy or falsy expectations instead of explicit matchers like `toBeVisible`, `toHaveText`, or `toHaveAttribute` | Explicit matchers produce stronger retries and clearer failure messages |
| E3 | Test performs a user action that should change visible state but never asserts the resulting user-facing outcome | The test proves interaction happened, not that behaviour was correct |
| E4 | Collection, text, or attribute verification is implemented through ad-hoc DOM extraction rather than Playwright assertion APIs | Ad-hoc verification is noisier, less resilient, and harder to diagnose |
| E5 | Negative assertions are written in a way that skips Playwright auto-wait semantics | Fast false positives or timing races can hide real regressions |
| E6 | API test uses a manual JS check (e.g. `Array.isArray(x)`, `typeof x === 'object'`) inside `expect()` where a Playwright/Jest matcher exists (e.g. `toBeInstanceOf(Array)`, `toBeDefined()`) | Manual checks produce generic `expect(false).toBe(true)` errors instead of descriptive matcher output |

## Category G — Test Isolation

*Applies to: **UI tests and API tests**.*

| Check | Fail = | Why it matters |
|---|---|---|
| G1 | Test outcome depends on another test running before it or on shared persisted application state | Order-dependent tests are unreliable in CI and parallel execution |
| G2 | Shared mutable setup in `beforeAll`, module scope, or reused runtime state can leak between tests | Shared state makes failures non-local and difficult to reproduce |
| G3 | Test does not begin from the expected blank or fresh calculator state for its documented scenario | Hidden preconditions make tests misleading and fragile |
| G4 | Multiple scenarios are bundled into one long flow because later steps rely on earlier side effects instead of their own setup | State-coupled flows prevent selective reruns and targeted debugging |

## Category H — User-Visible Behaviour

*Applies to: **UI tests only**. For API tests, behavioural correctness is evaluated under Category K (TC alignment) and Category M (API contract).*

| Check | Fail = | Why it matters |
|---|---|---|
| H1 | Test asserts on canvas pixels, internal implementation details, or non-user-visible Desmos internals instead of approved DOM proxy signals | The project idea is browser-behaviour validation, not internal rendering inspection |
| H2 | Test validates implementation details while skipping the visible or accessible outcome the user actually experiences | Internal assertions can stay green while user-visible behaviour is broken |
| H3 | Accessibility-relevant flows ignore keyboard behaviour, accessible names, or announced state changes where the scenario implies them | User-visible quality in this project includes accessible behaviour, not only visual clicks |
| H4 | Test uses a technically correct action but does not validate the Desmos-specific visible signal that proves success, such as error absence, slider appearance, or tooltip text | Desmos relies on proxy signals; missing them weakens behavioural confidence |

## Category I — CI Readiness

*Applies to: **UI tests and API tests**.*

| Check | Fail = | Why it matters |
|---|---|---|
| I1 | Test requires account-specific data, local machine assumptions, or manual preconditions that are not CI-safe | Non-portable tests do not fit the shared automation framework goal |
| I2 | Test uses discouraged or unstable execution patterns for CI, such as `networkidle`, unmanaged sleeps, or other brittle synchronization shortcuts | CI instability accumulates quickly from fragile timing patterns |
| I3 | Test lacks a clear, reproducible setup path for the feature under automation | Reproduction and triage slow down when setup is implicit |
| I4 | `test.fixme`, skip logic, or other CI-impacting suppression is used without a precise comment explaining the limitation | Silent suppression hides risk and leaves no audit trail |
| I5 | Test contains local-only logging, experimental code paths, or assumptions that make unattended runs noisy or misleading | CI output should stay deterministic and actionable |
| I6 | API test fixture or setup does not guard a required environment variable at module load time with a clear `throw new Error(...)` | Missing env var fails every test with a cryptic error deep in the call stack instead of a single actionable message at startup |

## Category J — Test Data Management

*Applies to: **UI tests and API tests**.*

| Check | Fail = | Why it matters |
|---|---|---|
| J1 | Magic expressions, coordinates, labels, selectors, or timing values are embedded inline when they belong in `constants.ts`, `testData.ts`, or `apiTestData.ts` | Inline data hides reuse opportunities and makes intent harder to maintain |
| J2 | The same test data is duplicated across files without using shared constants or structured test data modules | Duplicated data drifts and causes inconsistent expectations across suites |
| J3 | Test data definition is mixed into POM interaction logic or otherwise stored in the wrong layer | Data placement should preserve a clean split between behaviour and inputs |
| J4 | Test data naming is vague, misleading, or fails to explain why a value is special for the scenario | Poorly named data obscures scenario purpose and weakens reviews |
| J5 | API test: harness infrastructure config (API version, container ID, container dimensions) is co-located with test scenario inputs (expressions, expected states, invalid bounds) in the same module | Infrastructure config and scenario data change for different reasons; mixing them creates unnecessary coupling and complicates scope-specific updates |
| J6 | API test: inline literal value is used directly in a test body call where a named constant in `apiTestData.ts` should be used | Inline values in API test calls (e.g. raw bound objects, raw expression strings) hide their intent and create update-multiple-places risk |

## Category K — Test Case Coverage

*Applies to: **UI tests and API tests**.*
*For UI tests, TC docs are under `docs/testCases/{smoke,regression,e2e,performance}/{feature}/`.*
*For API tests, TC docs are under `docs/APITestCases/{feature}/` and IDs follow the pattern `TC-API-<AREA>-NNN`.*

| Check | Fail = | Why it matters |
|---|---|---|
| K1 | Automated test does not reference its documented test case with a `// TC-*` comment when such a mapping exists | The framework depends on traceability from docs to automation |
| K2 | A referenced TC ID has no matching file under `docs/testCases/` (UI) or `docs/APITestCases/` (API) | Broken traceability means the automated test cannot be verified against a source case |
| K3 | The implemented automated flow materially diverges from the documented test case steps or expected outcome | Automation that drifts from the spec becomes misleading even when green |
| K4 | A documented case exists in scope, but no automated test covers it and no omission is documented | Coverage gaps should be visible, not accidental |
| K5 | The test title wording differs from the case wording without changing the underlying behaviour | Minor wording drift weakens traceability and report clarity |
| K6 | Feature-level coverage is partial or stale relative to the documented case set, with no summary of what remains manual or deferred | A hybrid AI workflow still needs a clear boundary between covered and uncovered cases |

## Category L — Design Principles

*Applies to: **UI tests and API tests** — TypeScript code quality across all layers (spec, POM, fixture, test data).*

| Check | Principle | Fail = | Why it matters |
|---|---|---|---|
| L1 | SRP | A spec file, fixture class, or POM class handles multiple unrelated responsibilities — for example, a fixture that owns both harness setup logic and test data generation, or a POM that combines two distinct feature components | Classes and modules with mixed responsibilities become maintenance bottlenecks where unrelated changes collide |
| L2 | ISP | Fixture type interface exposes methods that no consuming test currently uses (dead interface surface), OR a test is forced to cast through the fixture to reach internal state it was never meant to expose | Bloated interfaces make the fixture harder to evolve; internal casts leak implementation details into test bodies |
| L3 | DIP | Test file imports `{ Page }` or another concrete Playwright type and uses it to manipulate browser state directly, bypassing the fixture abstraction layer that was designed to own that concern | Concrete imports couple test files to infrastructure internals; changing the page setup requires updating every test that holds a raw `Page` reference |
| L4 | DRY | The same selector string, expression literal, URL, timeout constant, or expected value appears inline in two or more test bodies without being extracted to a named constant or shared module | Duplicated literals drift independently; a single copy-edit propagation failure produces inconsistent expectations across the suite |
| L5 | DRY | Setup logic identical to what `beforeEach` (UI) or the fixture (API) already performs is repeated again inside one or more individual test bodies | Duplicated setup hides divergence, increases maintenance cost, and suggests the shared setup is incomplete |
| L6 | KISS | A helper function or abstraction layer is created for a single one-time use; the abstraction adds more lines of code than it eliminates | One-use abstractions obscure the execution flow and force reviewers to follow an extra indirection level for no reuse benefit |
| L7 | YAGNI | A fixture method, POM locator, test data constant, or helper function is defined but referenced by zero tests anywhere in the current scope | Unreferenced code misleads reviewers about what is exercised, balloons the maintenance surface, and implies a TC was planned but never automated |
| L8 | SoC | An infrastructure concern — env var loading, CDN waiting, container sizing, page navigation, browser context lifecycle — is written directly inside a test body instead of being owned by the fixture or `beforeEach` | Infrastructure concerns in test bodies couple scenario logic to setup mechanics, reducing readability, preventing reuse, and making the test harder to understand in isolation |
| L9 | Fail Fast | A required prerequisite (environment variable, DOM element, external dependency, fixture guard) can fail silently or cascade into an obscure downstream error rather than throwing an explicit, descriptive error at the earliest detection point | Fail-fast errors surface root cause immediately; silent failures force hours of debugging across unrelated test output |
| L10 | KISS | A multi-step action sequence that conceptually belongs in a single named POM method or fixture proxy is written inline and appears in two or more test bodies | Repeated inline sequences are a signal that the abstraction layer is missing an entry point; they also diverge over time as individual tests evolve separately |

## Category M — API Test Architecture

*Applies to: **API tests only** (`src/tests/api/`). For UI tests, equivalent concerns appear in categories A, B, C, and F.*

| Check | Fail = | Why it matters |
|---|---|---|
| M1 | The window global used as the calculator bridge is not namespaced with a unique per-instance key — e.g. using a fixed string like `__testCalculator` instead of `__testCalc_${randomSuffix}` | A fixed window global collides silently when Playwright runs tests in a shared browser context or when fixture scope ever widens beyond `'function'`; the collision produces non-local state corruption that is almost impossible to diagnose |
| M2 | `page.evaluate()` attempts to pass or return a non-serializable value (live JS object, class instance, closure, DOM node) directly across the Node.js/browser boundary instead of using the window global bridge pattern | Playwright serializes `evaluate()` arguments and return values via JSON; non-serializable values are silently dropped to `{}` or throw a runtime error that has nothing to do with the test scenario |
| M3 | A CDN or external resource load guarded by `page.waitForFunction()` has no explicit `timeout` option | Without a timeout, a CDN failure causes every subsequent test in the suite to fail with a cryptic "X is not defined" error rather than a single clear `TimeoutError` at the point of page setup |
| M4 | The fixture proxy type (`DesmosCalculator` or equivalent) does not expose a method needed for one or more documented TC steps, forcing tests to call raw `page.evaluate()` directly inside the spec body | Raw `evaluate()` in spec bodies violates layer separation, introduces repetition, and makes the spec harder to read and maintain |
| M5 | API version, container ID, or container dimensions are hardcoded as inline string/number literals in the fixture or spec file instead of being imported from a central infrastructure config module (`apiConfig.ts`) | Inline infrastructure values create multiple update points; when the harness configuration changes, every file containing the literal must be found and updated |
| M6 | Harness infrastructure config (API version, container size, element IDs) is defined in the same module as test scenario inputs (expressions, expected states, invalid bounds) | Infrastructure config and scenario data change for different reasons at different times; co-locating them creates unnecessary coupling and makes it harder to audit what triggers a config change vs a data change |
| M7 | The fixture `destroy()` or teardown does not clean up all auxiliary `window` keys created during the test — e.g. an events array `__testCalc_xxx_events` or observer reference — in addition to the calculator instance itself | Leaked window keys can silently pollute subsequent tests or cause memory growth if fixture scope or browser context sharing ever changes |
| M8 | API spec file has no coverage status comment block at the top listing all TCs in the feature folder with their automation status (✅ automated / ⏳ pending) | Without a coverage comment, gaps between documented TCs and automated tests are invisible to reviewers; partial coverage is mistaken for complete coverage |
| M9 | Fixture type uses `any` for an object whose shape is intentionally opaque by API design (e.g. Desmos serialized state object, raw calculator instance reference) rather than `unknown` or a named exported type | `any` silently disables TypeScript's type checker for that value; `unknown` enforces an explicit cast at every call site that needs to inspect it, making opaque usage visible and intentional |
| M10 | For an async browser-side event (e.g. change observer, animation callback), the test uses a fixed `waitForTimeout` as its primary synchronization point when a `waitForFunction` bounded-polling approach is feasible | Fixed sleeps are slow on a fast machine and still flake on a slow CI runner; `waitForFunction` polling self-cancels as soon as the condition is true and fails fast with a `TimeoutError` when it never is |
