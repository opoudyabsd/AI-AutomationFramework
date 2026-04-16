## Category C — Selector Stability

| Check | Fail = | Why it matters |
|---|---|---|
| C1 | XPath selector used anywhere in test, fixture, or POM code | XPath tightly couples tests to DOM structure and is explicitly forbidden by project rules |
| C2 | Semantic locator opportunity exists, but code uses a lower-priority selector instead | Misses the most stable, user-facing locator and increases selector drift risk |
| C3 | Generic CSS selector is unscoped or overly broad for the target interaction | Broad selectors often match multiple elements and become flaky after minor UI changes |
| C4 | Selector relies on positional structure such as `nth-child`, sibling order, or deep descendant chains without a stable anchor | Structural selectors are brittle when layout changes but behaviour does not |
| C5 | Same raw selector string is duplicated across multiple tests instead of being centralized in a POM locator or shared constant | Duplicated selectors drift independently and make large selector updates expensive |
| C6 | Locator strategy depends on volatile text, placeholder, or CSS state when a more stable accessible label, role, or scoped container is available | Volatile locators fail after harmless copy or styling changes |

## Category D — Test Structure & Naming

| Check | Fail = | Why it matters |
|---|---|---|
| D1 | Spec file lacks a `test.describe()` wrapper for its feature scope | Feature grouping becomes inconsistent and report structure is harder to scan |
| D2 | Navigation to the target page happens inside individual tests instead of `test.beforeEach()` | Repeated setup code hides the real scenario and invites divergence between tests |
| D3 | Test title does not follow the `should <verb> <what>` pattern or is vague about the observed behaviour | Weak names reduce report readability and make failures harder to triage |
| D4 | A test mixes multiple scenario concepts or multiple unrelated assertion themes in one flow | Coupled scenarios are harder to debug and usually indicate missing coverage boundaries |
| D5 | Temporary debugging filters such as `test.only()` or ad-hoc skip focus markers are committed | Focused runs break suite integrity in CI and can silently hide coverage |
| D6 | Interactive debugging artifacts such as `page.pause()` or equivalent committed debug stops remain in test code | Debug leftovers block unattended execution and violate CI-safe workflow expectations |

## Category E — Web-First Assertions

| Check | Fail = | Why it matters |
|---|---|---|
| E1 | Test uses manual state reads such as `isVisible()`, `textContent()`, or boolean comparisons where a Playwright web-first matcher should be used | Manual reads do not auto-retry and turn transient UI timing into false failures |
| E2 | Locator assertions use generic truthy or falsy expectations instead of explicit matchers like `toBeVisible`, `toHaveText`, or `toHaveAttribute` | Explicit matchers produce stronger retries and clearer failure messages |
| E3 | Test performs a user action that should change visible state but never asserts the resulting user-facing outcome | The test proves interaction happened, not that behaviour was correct |
| E4 | Collection, text, or attribute verification is implemented through ad-hoc DOM extraction rather than Playwright assertion APIs | Ad-hoc verification is noisier, less resilient, and harder to diagnose |
| E5 | Negative assertions are written in a way that skips Playwright auto-wait semantics | Fast false positives or timing races can hide real regressions |

## Category G — Test Isolation

| Check | Fail = | Why it matters |
|---|---|---|
| G1 | Test outcome depends on another test running before it or on shared persisted application state | Order-dependent tests are unreliable in CI and parallel execution |
| G2 | Shared mutable setup in `beforeAll`, module scope, or reused runtime state can leak between tests | Shared state makes failures non-local and difficult to reproduce |
| G3 | Test does not begin from the expected blank or fresh calculator state for its documented scenario | Hidden preconditions make tests misleading and fragile |
| G4 | Multiple scenarios are bundled into one long flow because later steps rely on earlier side effects instead of their own setup | State-coupled flows prevent selective reruns and targeted debugging |

## Category H — User-Visible Behaviour

| Check | Fail = | Why it matters |
|---|---|---|
| H1 | Test asserts on canvas pixels, internal implementation details, or non-user-visible Desmos internals instead of approved DOM proxy signals | The project idea is browser-behaviour validation, not internal rendering inspection |
| H2 | Test validates implementation details while skipping the visible or accessible outcome the user actually experiences | Internal assertions can stay green while user-visible behaviour is broken |
| H3 | Accessibility-relevant flows ignore keyboard behaviour, accessible names, or announced state changes where the scenario implies them | User-visible quality in this project includes accessible behaviour, not only visual clicks |
| H4 | Test uses a technically correct action but does not validate the Desmos-specific visible signal that proves success, such as error absence, slider appearance, or tooltip text | Desmos relies on proxy signals; missing them weakens behavioural confidence |

## Category I — CI Readiness

| Check | Fail = | Why it matters |
|---|---|---|
| I1 | Test requires account-specific data, local machine assumptions, or manual preconditions that are not CI-safe | Non-portable tests do not fit the shared automation framework goal |
| I2 | Test uses discouraged or unstable execution patterns for CI, such as `networkidle`, unmanaged sleeps, or other brittle synchronization shortcuts | CI instability accumulates quickly from fragile timing patterns |
| I3 | Test lacks a clear, reproducible setup path for the feature under automation | Reproduction and triage slow down when setup is implicit |
| I4 | `test.fixme`, skip logic, or other CI-impacting suppression is used without a precise comment explaining the limitation | Silent suppression hides risk and leaves no audit trail |
| I5 | Test contains local-only logging, experimental code paths, or assumptions that make unattended runs noisy or misleading | CI output should stay deterministic and actionable |

## Category J — Test Data Management

| Check | Fail = | Why it matters |
|---|---|---|
| J1 | Magic expressions, coordinates, labels, selectors, or timing values are embedded inline when they belong in `constants.ts` or `testData.ts` | Inline data hides reuse opportunities and makes intent harder to maintain |
| J2 | The same test data is duplicated across files without using shared constants or structured test data modules | Duplicated data drifts and causes inconsistent expectations across suites |
| J3 | Test data definition is mixed into POM interaction logic or otherwise stored in the wrong layer | Data placement should preserve a clean split between behaviour and inputs |
| J4 | Test data naming is vague, misleading, or fails to explain why a value is special for the scenario | Poorly named data obscures scenario purpose and weakens reviews |

## Category K — Test Case Coverage

| Check | Fail = | Why it matters |
|---|---|---|
| K1 | Automated test does not reference its documented test case with a `// TC-*` comment when such a mapping exists | The framework depends on traceability from docs to automation |
| K2 | A referenced TC ID has no matching file in `docs/testCases/{smoke,regression,e2e,performance}/{feature}/` | Broken traceability means the automated test cannot be verified against a source case |
| K3 | The implemented automated flow materially diverges from the documented test case steps or expected outcome | Automation that drifts from the spec becomes misleading even when green |
| K4 | A documented case exists in scope, but no automated test covers it and no omission is documented | Coverage gaps should be visible, not accidental |
| K5 | The test title wording differs from the case wording without changing the underlying behaviour | Minor wording drift weakens traceability and report clarity |
| K6 | Feature-level coverage is partial or stale relative to the documented case set, with no summary of what remains manual or deferred | A hybrid AI workflow still needs a clear boundary between covered and uncovered cases |
