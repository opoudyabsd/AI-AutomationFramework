# Desmos DOM Gotchas — Live-Verified

These replace any conflicting assumption from `docs/projectContext.md`.
Load this file when a selector or interaction does not behave as expected.

---

## Stale selectors

| Documented selector | Live DOM truth | Why it changed |
|---|---|---|
| `.dcg-color-option` | `.dcg-color-tile` (`role="option"`, labels "red"/"blue"/…) | Class renamed |
| `.dcg-expression-icon` | `.dcg-expression-icon-container` | Class renamed; `dcg-expression-icon` never existed in tests |
| `.dcg-trace-coordinates` | Use Export-button anchor (see §Trace below) | Element removed from DOM |
| `.dcg-options-menu` | Button name change `/Options for Expression/` (see §Style below) | Element removed from DOM |
| `.dcg-graph-outer` | `.dcg-graph-outer[role="img"]` — two divs exist; only the main graph has the role | Layout change added overlay |

Expression errors prefer `getByRole('note')` over `.dcg-error` because `.dcg-error` is absent when no error exists, causing false "not found" failures.

---

## Trace / POI tooltips

The Export button (`aria-label="Export point to expression list"`) and its
grandparent `.dcg-label` appear **only at Points of Interest (POIs)** — intercepts,
vertex, min/max, intersections. They do not appear for arbitrary curve points.

```typescript
// Correct locator — grandparent of Export button holds the coordinate text
this.traceCoordinates = page
  .getByRole('button', { name: 'Export point to expression list' })
  .first()
  .locator('xpath=../..');
```

Use `.first()` because Desmos orders multiple locked `.dcg-label` elements by
ascending graph x-coordinate, regardless of click order.

**POI click coordinates — examples:**

```typescript
export const graphCoordinates = {
  curveOnParabola: { graphX: 0, graphY: 0 },  // y=x² vertex at (0,0) — minimum POI
  rightIntercept:  { graphX: 2, graphY: 0 },  // y=x²−4 right x-intercept POI
  leftIntercept:   { graphX: -2, graphY: 0 }, // y=x²−4 left x-intercept POI
} as const;
```

---

## Multiple locked POIs

Clicking a second POI while a first is locked **adds** a second locked trace —
Desmos does not auto-dismiss. Pressing Escape does not dismiss a locked trace
(it only returns focus to the expression input).

Safe multi-POI test pattern — click in ascending x-order so `.first()` is
unambiguous at each step:

```typescript
// Step 1 — only right intercept locked; .first() = (2, 0)
await calc.clickGraphAtGraphCoord(rightIntercept.graphX, rightIntercept.graphY);
await expect(calc.traceCoordinates).toContainText(poiCoordinates);   // "2, 0"

// Step 2 — both locked; left is DOM-first because x=-2 < x=2; .first() = (-2, 0)
await calc.clickGraphAtGraphCoord(leftIntercept.graphX, leftIntercept.graphY);
await expect(calc.traceCoordinates).toContainText(leftInterceptCoords); // "−2, 0"
```

---

## Coordinate text format

`toContainText()` reads `textContent`, which concatenates the aria prose
("left parenthesis, 2 , 0 , right parenthesis") with the visible text ("2, 0").
Parentheses are aria-only — they are never literal characters in text nodes.

```typescript
poiCoordinates:      '2, 0',            // ✓ visible text — no parens
leftInterceptCoords: '\u22122, 0',      // ✓ Unicode minus U+2212, not ASCII -

// These always fail:
poiCoordinates:      '(2, 0)',          // ✗ parens not in textContent
leftInterceptCoords: '-2, 0',           // ✗ ASCII hyphen != U+2212 minus
```

Desmos renders all negative numbers with Unicode MINUS SIGN `−` (U+2212).
Use `'\u2212'` or the literal `−` character for any negative coordinate in `testData.ts`.

---

## Style options panel

When Ctrl+Shift+O or click-and-hold opens the style panel, the toggle button name
changes from `"Hide Expression N"` to `"Hide Options for Expression N"`. Use that
name change as the open indicator:

```typescript
this.styleMenu = this.expressionItem
  .getByRole('button', { name: /Options for Expression/ });
```

After clicking a `.dcg-color-tile`, the panel **stays open** — the button name
remains `"Hide Options for Expression N"`. Do not assert `expressionToggleButton`
(pattern `/(Hide|Show) Expression/`) immediately after a color click; assert
`.dcg-expression-icon-container` or `styleMenu` instead.

---

## Canvas clicks

A second `.dcg-graph-outer` overlay div intercepts pointer events. `locator.click()`
is blocked on the canvas; use raw mouse methods with steps:

```typescript
// Activates Desmos trace via mousemove events, then locks it with click
await this.page.mouse.move(box.x + x, box.y + y, { steps: 5 });
await this.page.mouse.click(box.x + x, box.y + y);
```

---

## MathQuill select-all

`Ctrl+A` does not work in MathQuill's custom editor. Use the `End` → `Shift+Home`
pattern to select the entire expression before replacing or deleting:

```typescript
await this.mathInputField.click();
await this.page.keyboard.press('End');
await this.page.keyboard.press('Shift+Home');
// then keyboard.type(newText) to replace, or Backspace to delete
```
