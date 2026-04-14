---
name: testCase-creation
description: >
  Creates structured, automation-ready test case files in Markdown format from
  user stories. Use this skill whenever the user asks to create, generate, write,
  or produce test cases — even if they just say "make test cases for this story"
  or "cover this feature with tests". Also trigger when the user mentions a user
  story ID (e.g. US-E1-01), references the userstory folder, or asks to derive
  test scenarios from a feature description. Trigger liberally.
argument-hint: "[story-id or feature name]"
allowed-tools:
  - Read
  - Write
  - Glob
  - Bash
---

# Test Case Creation

This skill reads user story files from `docs/userstory/`, analyses each Gherkin scenario defined in them, and produces one test case `.md` file per scenario saved to `docs/testCases/`. It applies Desmos-specific testing rules (MathQuill input, canvas proxy assertions, async rendering) automatically, producing output that a QA engineer can execute manually and a developer can use as a Playwright automation specification.

---

## Workflow

Follow these steps in order:

1. **Read the reference file** — Load `docs/projectContext.md` to ground all selector choices, input methods, and assertion strategies in the actual application context before writing any test case.

2. **Locate and read user story files** — List all `.md` files in `docs/userstory/`. Read the file matching the requested story ID, or all files if no specific story was requested. From each file extract: the User Story ID from the frontmatter, the `Feature:` label, the `Background:` block (shared preconditions), and every `Scenario:` block with its title, `Given`/`When`/`Then` clauses, and comment label (e.g. `# Happy path`, `# Edge case`).

3. **Map each scenario to one test case** — Each `Scenario:` block becomes exactly one `.md` file. Use the scenario's comment label to assign a test type according to the classification table in the Output format section. Derive the Test Case ID as `TC-[STORY_ID]-[NNN]` (e.g. `US-E1-01` → `TC-E1-01-001`). Derive the feature folder name in `kebab-case` from the `Feature:` field (e.g. `Feature: Sliders and Animations` → `sliders-animations`).

4. **Write each test case file** — Use the exact template in the Output format section. Populate every field; leave no placeholder text. Apply Desmos-specific rules from the Reference files section for all selector, input method, assertion, and wait strategy decisions.

5. **Save files to the correct path** — Save each file to `docs/testCases/[testType]/[feature-folder]/[TC-ID]-[kebab-case-description].md`. If the directory does not exist, create it. If a test case uses multiple specific data values (coordinates, expression sets, ranges), also create a `testData.json` in the same folder.

---

## Output format

Use this exact template for every test case file. All fields are required.

```markdown
# TC-[ID]: [Short imperative title — describe the action and the outcome]

**Summary:** [TC-ID] [Feature/Component] [testType] — [One sentence describing what this test case verifies and why it matters]

**Priority:** [1–5] — [1: very low, can be deferred | 3: moderate | 5: critical, implement immediately]

**Related:** [Comma-separated list of related TC IDs and/or the source user story file path. Write "None" if not applicable.]

## Preconditions

- The Desmos Graphing Calculator is open at https://www.desmos.com/calculator
- The calculator is in a fresh state with no expressions entered
- [Any additional preconditions from the Background or Given clauses of the user story]

## Test Steps

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1    | [Single, specific action the user performs] | [What the system should show or do] |
| 2    | [Next action] | [Expected outcome for this step] |

## Notes for Automation

- **Selector:** [CSS class or aria-label for the primary element under test]
- **Input method:** [Exactly how to enter data — specify keyboard.type() for MathQuill fields]
- **Assertion strategy:** [How to verify the outcome — use DOM proxy signals for canvas results]
- **Wait strategy:** [How to handle async rendering — prefer toBeVisible() over waitForTimeout]
```

**Test type classification:**

| Scenario comment label | Test type |
|---|---|
| `# Happy path` — first or most critical success scenario per feature | `smoke` |
| `# Happy path` — all subsequent happy path scenarios | `regression` |
| `# Alternative flow` or secondary valid path | `regression` |
| `# Edge case` or boundary condition | `regression` |
| `# Invalid`, `# Negative`, or error handling | `regression` |
| Scenario spanning two or more distinct features | `e2e` |
| Scenario explicitly mentioning speed, load time, or throughput | `performance` |

**Valid test types:** `smoke`, `regression`, `e2e`, `performance` only. Do not use `functional` or `nonfunctional`.

**File path pattern:**

```
docs/testCases/[testType]/[feature-folder]/[TC-ID]-[kebab-case-description].md
```

---

## Examples

**Example 1 — single story by ID:**

Input: *"Create test cases for US-E1-01"*

Expected output: Five `.md` files, one per scenario in US-E1-01. The first happy path scenario (`Graph a basic function`) becomes `smoke`; all others become `regression`. Files are saved under `docs/testCases/smoke/expression-entry/` and `docs/testCases/regression/expression-entry/`. Each file has a populated Summary, Priority, Related, Preconditions, Test Steps table, and Notes for Automation section.

**Example 2 — all stories for a feature:**

Input: *"Generate all test cases for the sliders feature"*

Expected output: All scenarios from `docs/userstory/E4_Sliders-Animations.md` become individual `.md` files under `docs/testCases/[testType]/sliders-animations/`. The skill reads the `Background:` block once and applies it as a shared precondition across all generated files. Test Case IDs increment sequentially per story (e.g. `TC-E4-01-001`, `TC-E4-01-002`, `TC-E4-02-001`, ...).

**Example 3 — implicit/fuzzy phrasing:**

Input: *"Write test cases for the hide/show expression story"*

Expected output: The skill identifies `US-E1-04` as the closest match by feature name, reads it, and generates test cases for all four scenarios. It does not ask for clarification unless no reasonable match exists.

---

## Edge cases

- **No story ID specified**: Generate test cases for all `.md` files in `docs/userstory/`. Process them in filename order.
- **Story ID not found**: State which files are available in `docs/userstory/` and ask the user to confirm which one to use.
- **Scenario has no comment label**: Default to `regression`. Do not leave the test type blank.
- **Background block is absent**: Use the standard precondition (calculator open at the URL, fresh state) without inferring additional preconditions.
- **Scenario spans multiple features**: Assign `e2e` only if the scenario genuinely requires interacting with two or more distinct UI features. When in doubt, use `regression`.
- **User asks for test cases AND test code**: Generate the `.md` test case files first. Inform the user that Playwright implementation requires the `playwright-test-generator` agent and should be done separately.

---

## Reference files

Load only when needed for the current task:

| File | Load when |
|------|-----------|
| `docs/projectContext.md` | Always — load at Step 1 before writing any test case |
| `docs/userstory/[file].md` | Load the specific file matching the requested story ID, or all files when no ID is specified |
