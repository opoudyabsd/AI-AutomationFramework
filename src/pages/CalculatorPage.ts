import { Page, Locator } from '@playwright/test';
import { SELECTORS, ARIA, SHORTCUTS, MATHQUILL_RENDER_DELAY } from '../testData/constants';

export class CalculatorPage {
  readonly page: Page;

  // Expression List
  readonly expressionList: Locator;
  readonly expressionItems: Locator;  // all real expression rows
  readonly expressionItem: Locator;   // first real expression row
  readonly mathInputField: Locator;
  readonly expressionError: Locator;
  readonly expressionIcon: Locator;

  // The color dot button — accessible name is "Hide Expression N" when visible,
  // "Show Expression N" when hidden. Use this for all click interactions.
  // .dcg-expression-icon is the visual inner element and is not interactable directly.
  readonly expressionToggleButton: Locator;

  // Style menu — selector unverified — confirm against live DOM before committing
  readonly styleMenu: Locator;

  // Toolbar
  readonly zoomInButton: Locator;
  readonly zoomOutButton: Locator;
  // resetViewButton: only present in the DOM after at least one zoom action (aria-label "Default Viewport").
  readonly resetViewButton: Locator;
  readonly addItemButton: Locator;

  // Graph
  readonly graphCanvas: Locator;
  readonly traceCoordinates: Locator;

  // Accessibility — selector unverified — confirm against live DOM before committing
  readonly ariaLiveRegion: Locator;

  constructor(page: Page) {
    this.page = page;

    // Priority 1: role-based for interactive toolbar elements
    this.zoomInButton = page.getByRole('button', { name: ARIA.ZOOM_IN });
    this.zoomOutButton = page.getByRole('button', { name: ARIA.ZOOM_OUT });
    this.resetViewButton = page.getByRole('button', { name: ARIA.RESET_VIEW });
    this.addItemButton = page.getByRole('button', { name: ARIA.ADD_ITEM });

    // Priority 5: .dcg-* scoped and filtered — no stable role/label available
    this.expressionList = page.locator(SELECTORS.EXPRESSION_LIST);
    this.expressionItems = this.expressionList.locator(SELECTORS.EXPRESSION_ITEM);
    this.expressionItem = this.expressionItems.first();
    this.mathInputField = page.locator(SELECTORS.MATH_INPUT).first();
    // Desmos renders inline expression errors as an ARIA `note` element inside the expression item.
    // Previous selector `.dcg-error` was not found in the DOM; `getByRole('note')` is confirmed.
    this.expressionError = this.expressionItem.getByRole('note');
    this.expressionIcon = this.expressionItem.locator(SELECTORS.EXPRESSION_ICON);

    // .dcg-expression-icon is visual-only; the interactable element is the surrounding button.
    // Pattern /(Hide|Show) Expression/ matches both visible ("Hide") and hidden ("Show") states.
    this.expressionToggleButton = this.expressionItem.getByRole('button', { name: /(Hide|Show) Expression/ });

    // When the style options panel is closed, the toggle button is named "Hide Expression N".
    // Ctrl+Shift+O (or click-and-hold) changes its name to "Hide Options for Expression N".
    // In the live DOM that expanded control is not a child of the scoped expression row,
    // so locate it from the expression list rather than from expressionItem.
    this.styleMenu = this.expressionList.getByRole('button', { name: /Options for Expression/ }).first();
    this.graphCanvas = page.locator(SELECTORS.GRAPH_CANVAS);
    // .dcg-trace-coordinates CSS class no longer matches the live DOM.
    // The trace tooltip parent (dcg-tooltip-hit-area-container) holds the Export button but not
    // the coordinate text — the coordinate display is a sibling at the grandparent level.
    // Use grandparent (xpath=../..) so toContainText and innerText capture the coordinate text.
    // When multiple trace points are locked simultaneously, Desmos orders the Export
    // buttons left-to-right by graph x-coordinate. Use .first() so that the locator
    // consistently resolves to the leftmost locked point — for single-point tests
    // .first() is equivalent to the only element; for the two-intercept test it
    // resolves to the left intercept (-2, 0) while the right intercept (2, 0) is last.
    this.traceCoordinates = page.getByRole('button', { name: 'Export point to expression list' }).first().locator('..').locator('..');
    this.ariaLiveRegion = page.locator(SELECTORS.ARIA_LIVE_REGION).first();
  }

  async goto(): Promise<void> {
    await this.page.goto('');
    await this.waitForCalculatorLoad();
  }

  private async waitForCalculatorLoad(): Promise<void> {
    await this.expressionList.waitFor({ state: 'visible' });
  }

  async typeExpression(text: string): Promise<void> {
    await this.mathInputField.click();
    await this.page.keyboard.type(text);
    await this.page.waitForTimeout(MATHQUILL_RENDER_DELAY);
  }

  async editExpression(newText: string): Promise<void> {
    await this.mathInputField.click();
    // Ctrl+A does not select all in MathQuill's custom editor.
    // End moves the cursor to the end of the expression; Shift+Home then
    // selects the entire content back to the start — MathQuill-safe select-all.
    await this.page.keyboard.press('End');
    await this.page.keyboard.press('Shift+Home');
    await this.page.keyboard.type(newText);
    await this.page.waitForTimeout(MATHQUILL_RENDER_DELAY);
  }

  async clearExpression(): Promise<void> {
    await this.mathInputField.click();
    // Same MathQuill-safe select-all as editExpression, then delete.
    await this.page.keyboard.press('End');
    await this.page.keyboard.press('Shift+Home');
    await this.page.keyboard.press('Backspace');
    await this.page.waitForTimeout(MATHQUILL_RENDER_DELAY);
  }

  async addExpressionLineViaEnter(): Promise<void> {
    await this.mathInputField.click();
    await this.page.keyboard.press('Enter');
  }

  async addExpressionLineViaShortcut(): Promise<void> {
    // Shortcut unverified — confirm Control+Alt+x in the live app before committing
    await this.page.keyboard.press(SHORTCUTS.ADD_EXPRESSION);
  }

  async addExpressionViaButton(): Promise<void> {
    await this.addItemButton.click();
    // The dropdown item is a button with accessible name "Add expression" (lowercase e).
    // Previous code used getByText('Expression', {exact:true}) which failed due to case mismatch.
    await this.page.getByRole('button', { name: 'Add expression' }).click();
  }

  async toggleExpressionVisibility(): Promise<void> {
    // expressionIcon (.dcg-expression-icon) is visual-only and not interactable.
    // The accessible button surrounding it handles click events.
    await this.expressionToggleButton.click();
  }

  async hideExpressionViaKeyboard(): Promise<void> {
    await this.mathInputField.click();
    await this.page.keyboard.press(SHORTCUTS.OPEN_STYLE);
    // Wait for the keyboard shortcut to move focus into the style options control,
    // then close the popover and activate the now-restored hide/show toggle button.
    await this.styleMenu.waitFor({ state: 'visible' });
    await this.page.keyboard.press('Escape');
    await this.expressionToggleButton.waitFor({ state: 'visible' });
    await this.expressionToggleButton.press('Enter');
  }

  async openStyleMenuViaClickHold(): Promise<void> {
    // Playwright's click delay holds the mouse button down, triggering Desmos's
    // click-and-hold style popover. Use the accessible button — .dcg-expression-icon
    // is the visual inner element and is not interactable directly.
    await this.expressionToggleButton.click({ delay: 700 });
  }

  async openStyleMenuViaKeyboard(): Promise<void> {
    await this.mathInputField.click();
    await this.page.keyboard.press(SHORTCUTS.OPEN_STYLE);
  }

  async selectFirstStyleColor(): Promise<void> {
    // .dcg-color-tile elements have role="option" inside the color picker listbox
    await this.page.locator(SELECTORS.COLOR_OPTION).first().click();
  }

  // ── Graph interaction ────────────────────────────────────────────────────────

  async clickGraphAtGraphCoord(graphX: number, graphY: number): Promise<void> {
    const box = await this.graphCanvas.boundingBox();
    if (!box) throw new Error('Graph canvas not found in DOM');
    const { x, y } = this.graphCoordToCanvasPixel(box, graphX, graphY);
    // Use raw mouse methods — locator.click() is blocked by the second .dcg-graph-outer
    // div (no role) that sits on top and intercepts pointer events for the role="img" layer.
    // steps:15 fires enough intermediate mousemove events for Desmos's trace-snapping
    // engine to detect the curve and snap to the nearest POI before the click locks it.
    // Live-verified: steps:5 is too few for the snap algorithm to engage — the trace
    // lands on an off-curve pixel and no Export button appears.
    await this.page.mouse.move(box.x + x, box.y + y, { steps: 15 });
    // Brief dwell so Desmos's trace engine has time to snap to the nearest POI
    // before the click locks it. Without this pause the snap may not have fired yet,
    // causing the Export button to never appear (observed after resetView() cycles).
    await this.page.waitForTimeout(300);
    await this.page.mouse.click(box.x + x, box.y + y);
  }

  async hoverGraphAtGraphCoord(graphX: number, graphY: number): Promise<void> {
    const box = await this.graphCanvas.boundingBox();
    if (!box) throw new Error('Graph canvas not found in DOM');
    const { x, y } = this.graphCoordToCanvasPixel(box, graphX, graphY);
    // Move with steps so Desmos receives a sequence of mousemove events, which is
    // required for the hover-trace tooltip to activate.
    await this.page.mouse.move(box.x + x, box.y + y, { steps: 10 });
  }

  /**
   * Converts a point in Desmos graph coordinates to canvas-relative pixel offsets.
   * The default Desmos view has x ∈ [-10, 10]. The y range scales with the canvas
   * aspect ratio (y_half = 10 × height/width), matching the actual Desmos viewport.
   * Returns pixel offsets relative to the canvas bounding box top-left corner.
   */
  private graphCoordToCanvasPixel(box: { width: number; height: number }, graphX: number, graphY: number): { x: number; y: number } {
    const xHalf = 10;                         // Desmos default x half-range
    const yHalf = xHalf * (box.height / box.width); // y range scales with aspect ratio
    const x = Math.round(box.width / 2 + (graphX / xHalf) * (box.width / 2));
    const y = Math.round(box.height / 2 - (graphY / yHalf) * (box.height / 2));
    return { x, y };
  }
}
