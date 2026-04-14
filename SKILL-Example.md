# SKILL Agent — Template & Best Practices Guide

This file is your single reference for building a skill agent. It covers folder structure, the SKILL.md format, writing rules, eval setup, and the iteration loop. Copy and adapt.

---

## Table of Contents

1. [What is a Skill?](#1-what-is-a-skill)
2. [Folder Structure](#2-folder-structure)
3. [SKILL.md — Full Template](#3-skillmd--full-template)
4. [Front-matter Rules](#4-front-matter-rules)
5. [Body Section Guide](#5-body-section-guide)
6. [Writing Rules & Best Practices](#6-writing-rules--best-practices)
7. [Progressive Disclosure Pattern](#7-progressive-disclosure-pattern)
8. [Evals Setup](#8-evals-setup)
9. [Build → Test → Improve Loop](#9-build--test--improve-loop)
10. [Common Mistakes to Avoid](#10-common-mistakes-to-avoid)

---

## 1. What is a Skill?

A skill is a folder containing a `SKILL.md` file (plus optional bundled resources) that gives Claude structured, reusable instructions for a specific type of task — such as generating Excel reports, reading PDFs, creating slide decks, or deploying to cloud infrastructure.

Claude reads the skill's `name` and `description` (always in context) and decides whether to open the full `SKILL.md` based on those fields. The body and bundled resources are loaded on demand, keeping context usage lean.

---

## 2. Folder Structure

```
your-skill-name/
├── SKILL.md                  ← required: front-matter + instructions
├── evals/
│   ├── evals.json            ← test prompts and assertions
│   └── files/                ← sample input files for evals
└── bundled-resources/        ← optional
    ├── scripts/              ← Python/bash scripts for deterministic tasks
    ├── references/           ← docs loaded into context as needed
    │   └── TOC.md            ← add this if any reference file exceeds 300 lines
    └── assets/               ← templates, fonts, icons used in output
```

### Multi-domain variant pattern

When a skill supports multiple platforms or frameworks, split reference docs by variant:

```
cloud-deploy/
├── SKILL.md                  ← workflow logic + "which file to load" decision
└── references/
    ├── aws.md
    ├── gcp.md
    └── azure.md
```

Claude reads only the relevant reference file based on the user's context.

---

## 3. SKILL.md — Full Template

Copy this entire block as your starting point. Delete sections that don't apply.

```markdown
---
name: your-skill-name
description: >
  [1-2 sentences on what the skill does.]
  Use this skill whenever the user mentions [specific keywords, phrases,
  or file types]. Also trigger for [related scenarios and implicit signals
  — e.g. "even if they don't say 'Excel', use this skill when they ask
  for a table they can download"]. Trigger liberally.
compatibility:
  tools: [bash, python3]      # optional — omit if no special deps needed
---

# [Skill Name]

[2-3 sentence overview: what the skill accomplishes and what makes it
more effective than a generic Claude response for this task.]

---

## Workflow

Follow these steps in order:

1. **[Step name]** — [Imperative instruction. Briefly explain why if not obvious.]
2. **[Step name]** — [Imperative instruction.]
3. **[Step name]** — [Instruction with condition if needed.]
   - Sub-step for edge case
4. **[Step name]** — [Imperative instruction.]

---

## Output format

ALWAYS use this exact structure:

[Paste the exact template, schema, or file format here.
Use placeholders like [TITLE], {variable}, or <!-- comment --> to mark
slots the model should fill in.]

---

## Examples

**Example 1 — typical case:**
Input: [Realistic user prompt]
Output: [Concrete expected result — enough detail to show the pattern]

**Example 2 — edge case or variant:**
Input: [A different phrasing or harder scenario]
Output: [How the output differs and why]

---

## Edge cases

- **[Missing input]**: [What to ask the user, or what to assume by default.]
- **[Ambiguous request]**: [Default behavior when intent is unclear.]
- **[Known failure mode]**: [How to detect and handle it gracefully.]

---

## Reference files

Load only the file you need for the current task:

| File | Load when |
|------|-----------|
| `references/aws.md` | User mentions AWS or Amazon cloud deployment |
| `references/gcp.md` | User mentions GCP, Google Cloud, or Firebase |
| `references/schemas.md` | Output must conform to a strict JSON/YAML schema |

```

---

## 4. Front-matter Rules

### `name`
- Use kebab-case: `excel-report-builder`, `pdf-extractor`
- Must be unique across your skill library
- Keep it short and descriptive

### `description` — the most important field
- This is the **only triggering mechanism**. Claude decides whether to open the full SKILL.md based solely on this text.
- Include both **what it does** and **when to use it** (user phrases, file types, contexts)
- Make it slightly "pushy" — Claude tends to under-trigger, so be explicit
- Never put "when to use" guidance in the body; it belongs only here

**Good description example:**
```yaml
description: >
  Creates, reads, and edits Excel spreadsheets (.xlsx). Use this skill
  whenever the user mentions spreadsheet, Excel, .xlsx, pivot table, or
  wants to process tabular data — even if they just say "make me a table
  I can download". Also trigger for CSV-to-Excel conversion and formula
  generation. Trigger liberally.
```

**Weak description example (avoid):**
```yaml
description: Handles Excel files.
```

### `compatibility`
- Optional. Only add if the skill genuinely requires specific tools or dependencies.
- Example: `tools: [bash, python3, pandoc]`
- Omit the field entirely if not needed — don't add it as a formality.

---

## 5. Body Section Guide

### Overview (required)
2-3 sentences. Answer: what does this skill accomplish, and why is it better than a generic Claude response?

### Workflow (required)
Numbered steps Claude should follow in order. Use the imperative form. Briefly state the *why* behind non-obvious steps — this helps Claude adapt when edge cases arise.

### Output format (required for structured outputs)
Paste the exact template, schema, or format. The more concrete this section is, the less Claude has to guess. For file outputs, include the exact structural pattern expected.

### Examples (recommended)
2-3 Input → Output pairs. Use realistic user phrasing, not toy examples. Include at least one edge case or variant. Examples help Claude pattern-match faster than abstract rules.

### Edge cases (recommended)
Bullet list of known failure modes, ambiguous inputs, and how to handle them. Be specific — "ask the user for X" is better than "handle gracefully".

### Reference files (include if bundled resources exist)
A table mapping each reference file to the condition under which Claude should load it. This avoids loading everything every time.

---

## 6. Writing Rules & Best Practices

### Language and tone
- Use the **imperative form**: "Load the file", "Check for X", "Return the result as JSON"
- Explain **why**, not just what — Claude adapts better when it understands intent
- Be general and principle-based; avoid hardcoding narrow examples as universal rules
- Prefer theory of mind over heavy-handed MUSTs — explain the goal, trust the model

### Structure
- Keep SKILL.md **under 500 lines** — offload detail to `references/`
- If approaching the limit, add a pointer: "For advanced options, see `references/advanced.md`"
- Use headers, not prose walls — Claude scans structure first
- For large reference files (>300 lines), include a `TOC.md` at the top

### Output templates
- Use exact templates for deterministic formats (reports, JSON schemas, slide decks)
- Use placeholders consistently: `[TITLE]`, `{variable}`, `<!-- slot -->`
- Show a concrete filled example alongside the template when the format is complex

### What NOT to put in SKILL.md
- "When to use" logic → goes in `description` only
- Malware, exploit code, or deceptive instructions
- Entire reference docs → put them in `references/` and point to them
- Redundant repetition of the same rule across sections

---

## 7. Progressive Disclosure Pattern

Skills use a three-level loading system. Design your skill with this in mind:

| Level | What's loaded | Always in context? | Size target |
|-------|--------------|-------------------|-------------|
| Metadata | `name` + `description` | Yes | ~100 words |
| SKILL.md body | Full instructions | When skill triggers | <500 lines |
| Bundled resources | scripts, references, assets | On demand only | Unlimited |

**Practical implication:** The SKILL.md body should contain the *workflow and core rules*. Heavy reference material (API docs, schema definitions, domain-specific checklists) belongs in `references/` and gets loaded only when Claude determines it's needed for the current task.

---

## 8. Evals Setup

Save test cases to `evals/evals.json`. Write them before running — don't add assertions until after the first run, so you can draft them based on real output.

### evals.json schema

```json
{
  "skill_name": "your-skill-name",
  "evals": [
    {
      "id": 1,
      "prompt": "The user's realistic task prompt",
      "expected_output": "Human-readable description of what success looks like",
      "files": ["evals/files/sample.pdf"],
      "expectations": [
        "The output contains a summary section",
        "The output is saved as a .docx file",
        "No placeholder text remains in the output"
      ]
    },
    {
      "id": 2,
      "prompt": "An edge-case variant of the same task",
      "expected_output": "Description of the expected difference in output",
      "files": [],
      "expectations": [
        "The skill asks for clarification when input is ambiguous"
      ]
    }
  ]
}
```

### Writing good test prompts
- Use **realistic user phrasing** — not "invoke the skill with parameter X"
- Cover: a typical case, an edge case, and a variant phrasing
- Prompts should be **substantive enough** that Claude would genuinely benefit from consulting the skill (simple one-liners often don't trigger skills even with perfect descriptions)

### Writing good assertions
- Make them **objectively verifiable** — a pass/fail check, not a judgment
- Name them descriptively: "Output is saved as .xlsx" not "file check"
- Avoid assertions that pass regardless of whether the skill was used (non-discriminating)
- Subjective qualities (tone, style) are better evaluated by human review, not assertions

---

## 9. Build → Test → Improve Loop

```
1. Capture intent
   └─ What does it do? When does it trigger? What's the output format?

2. Draft SKILL.md
   └─ Fill front-matter + all body sections using the template above

3. Write 2-3 test prompts
   └─ Save to evals/evals.json (no assertions yet)

4. Run test cases
   └─ Execute each prompt with the skill active
   └─ Also run a baseline (without the skill) to measure the delta

5. Draft assertions + human review
   └─ Add expectations to evals.json based on what you saw
   └─ Review outputs qualitatively — does the skill actually help?

6. Iterate
   └─ Fix description, workflow steps, or output template based on failures
   └─ Re-run until outputs consistently match expectations

7. Optimize description (optional, Claude Code only)
   └─ Run the trigger-optimization loop to improve recall
   └─ Uses run_loop.py from skill-creator scripts

8. Package
   └─ Run package_skill.py to produce a .skill file for distribution
```

### Updating an existing skill
- Preserve the original `name` — don't rename to `skill-name-v2`
- If the skill path is read-only, copy to a writable location before editing
- Snapshot the old version before editing so you can use it as a baseline in evals

---

## 10. Common Mistakes to Avoid

| Mistake | Fix |
|---------|-----|
| Weak or vague description | Pack it with real user phrases and contexts; be pushy |
| "When to use" in the body | Move all triggering logic to the `description` field |
| SKILL.md over 500 lines | Offload detail to `references/` and add load conditions |
| Assertions that always pass | Make assertions discriminating — they should fail without the skill |
| Test prompts too simple | Use substantive, multi-step prompts that benefit from a skill |
| No examples section | Add at least 2 Input → Output pairs with realistic phrasing |
| Hardcoding narrow examples as rules | Write principles, not rules tied to one specific scenario |
| Missing edge cases section | Explicitly handle ambiguous inputs and known failure modes |
| Loading all reference files always | Add a table specifying when each file should be loaded |
| Renaming skill when updating | Keep the original name; version control handles history |

---

## Quick-start checklist

Before submitting or publishing a skill, verify:

- [ ] `name` is kebab-case and unique
- [ ] `description` includes user phrases, contexts, and file types
- [ ] `description` is slightly pushy (errs toward triggering)
- [ ] SKILL.md body is under 500 lines
- [ ] Workflow section uses imperative form with brief why-explanations
- [ ] Output format section has a concrete template (if applicable)
- [ ] At least 2 examples with realistic user phrasing
- [ ] Edge cases section covers ambiguous inputs
- [ ] `evals/evals.json` has at least 2-3 test prompts with assertions
- [ ] Reference files table specifies load conditions (if bundled resources exist)
- [ ] No "when to use" logic buried in the body
