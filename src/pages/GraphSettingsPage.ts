import { Page, Locator } from '@playwright/test';
import { ARIA, SELECTORS, MATHQUILL_RENDER_DELAY } from '../testData/constants';

export class GraphSettingsPage {
  readonly page: Page;

  // ── Toolbar ────────────────────────────────────────────────────────────────
  readonly graphSettingsButton: Locator;
  readonly zoomInButton: Locator;
  readonly zoomOutButton: Locator;
  // Only present in the DOM after at least one zoom action (aria-label "Default Viewport").
  readonly resetViewButton: Locator;

  // ── Graph canvas ───────────────────────────────────────────────────────────
  // The aria-label on this element is the only DOM representation of the current
  // axis range (e.g. "X axis visible from negative 10 to 10").
  // Axis tick numbers are canvas-rendered and have no DOM text nodes.
  readonly graphCanvas: Locator;

  // ── Settings panel ─────────────────────────────────────────────────────────
  // Live DOM: the panel has role="region" aria-label="Graph Settings" on the
  // inner content container. It is not present in the DOM when the panel is closed.
  readonly settingsPanel: Locator;

  // Angle unit controls — live DOM: role="radiogroup" aria-label="Angle Settings"
  // containing two role="radio" buttons with aria-label="Radians" / "Degrees".
  readonly angleSettingsGroup: Locator;
  readonly radiansOption: Locator;
  readonly degreesOption: Locator;

  // Axis bound inputs — live DOM: .dcg-mq-editable-field[data-dcg-label="xmin|xmax|ymin|ymax"]
  // These are MathQuill components; fill() does not work. Use setAxisDomain() to change values.
  readonly xMinField: Locator;
  readonly xMaxField: Locator;
  readonly yMinField: Locator;
  readonly yMaxField: Locator;

  // Expression list — used only to confirm calculator has fully loaded.
  private readonly expressionList: Locator;

  constructor(page: Page) {
    this.page = page;

    // Toolbar
    this.graphSettingsButton = page.getByRole('button', { name: ARIA.GRAPH_SETTINGS });
    this.zoomInButton        = page.getByRole('button', { name: ARIA.ZOOM_IN });
    this.zoomOutButton       = page.getByRole('button', { name: ARIA.ZOOM_OUT });
    this.resetViewButton     = page.getByRole('button', { name: ARIA.RESET_VIEW });

    // Graph
    this.graphCanvas = page.locator(SELECTORS.GRAPH_CANVAS);

    // Settings panel — exact: true required because a toolbar region with
    // aria-label="Graph Settings Controls" also exists and would cause a strict-mode violation.
    this.settingsPanel      = page.getByRole('region', { name: ARIA.GRAPH_SETTINGS, exact: true });
    this.angleSettingsGroup = this.settingsPanel.getByRole('radiogroup', { name: 'Angle Settings' });
    this.radiansOption      = this.settingsPanel.getByRole('radio', { name: 'Radians' });
    this.degreesOption      = this.settingsPanel.getByRole('radio', { name: 'Degrees' });

    // Axis bound inputs — scoped to settingsPanel so they only resolve when the panel is open.
    this.xMinField = this.settingsPanel.locator(SELECTORS.X_MIN_FIELD);
    this.xMaxField = this.settingsPanel.locator(SELECTORS.X_MAX_FIELD);
    this.yMinField = this.settingsPanel.locator(SELECTORS.Y_MIN_FIELD);
    this.yMaxField = this.settingsPanel.locator(SELECTORS.Y_MAX_FIELD);

    this.expressionList = page.locator(SELECTORS.EXPRESSION_LIST);
  }

  async goto(): Promise<void> {
    await this.page.goto('');
    await this.waitForCalculatorLoad();
  }

  private async waitForCalculatorLoad(): Promise<void> {
    await this.expressionList.waitFor({ state: 'visible' });
  }

  async openSettings(): Promise<void> {
    await this.graphSettingsButton.click();
    await this.settingsPanel.waitFor({ state: 'visible' });
  }

  async closeSettings(): Promise<void> {
    await this.page.keyboard.press('Escape');
    // The panel element is removed from the DOM on close — use 'detached' rather than
    // 'hidden' to express that intent precisely (though 'hidden' would also pass).
    await this.settingsPanel.waitFor({ state: 'detached' });
  }

  /**
   * Sets all four axis bound fields. The settings panel must already be open.
   * Axis inputs are MathQuill components; each field is cleared with End→Shift+Home
   * before typing the new value (same pattern as editExpression in CalculatorPage).
   */
  async setAxisDomain(xMin: string, xMax: string, yMin: string, yMax: string): Promise<void> {
    await this.setMathQuillField(this.xMinField, xMin);
    await this.setMathQuillField(this.xMaxField, xMax);
    await this.setMathQuillField(this.yMinField, yMin);
    await this.setMathQuillField(this.yMaxField, yMax);
    // Brief wait for Desmos to process the last field update before the caller proceeds.
    await this.page.waitForTimeout(MATHQUILL_RENDER_DELAY);
  }

  /**
   * Clears a single MathQuill settings field and types a new value.
   * fill() is not supported on MathQuill components — keyboard interaction is required.
   */
  private async setMathQuillField(field: Locator, value: string): Promise<void> {
    await field.click();
    // End → Shift+Home is the MathQuill-safe select-all pattern (Ctrl+A has no effect).
    await this.page.keyboard.press('End');
    await this.page.keyboard.press('Shift+Home');
    await this.page.keyboard.type(value);
  }

  /** Selects Degrees as the active angle unit. The settings panel must already be open. */
  async switchToDegrees(): Promise<void> {
    await this.degreesOption.click();
  }

  /** Selects Radians as the active angle unit. The settings panel must already be open. */
  async switchToRadians(): Promise<void> {
    await this.radiansOption.click();
  }

  /**
   * Pans the graph canvas by dragging from its centre.
   * @param deltaX - Horizontal pixel offset. Negative = drag left (viewport shifts right).
   * @param deltaY - Vertical pixel offset. Negative = drag up (viewport shifts down).
   *
   * Note: The canvas aria-label does not update after a pan — there is no DOM proxy
   * that reflects the new viewport extents. The action is performed without a state assertion.
   * Use the reset button + aria-label check to confirm the overall viewport workflow.
   */
  async panCanvas(deltaX: number, deltaY = 0): Promise<void> {
    const box = await this.graphCanvas.boundingBox();
    if (!box) throw new Error('Graph canvas not found in DOM');
    const cx = Math.round(box.x + box.width  / 2);
    const cy = Math.round(box.y + box.height / 2);
    // Move to centre first so Desmos receives the initial mousemove before mousedown.
    await this.page.mouse.move(cx, cy, { steps: 3 });
    await this.page.mouse.down();
    await this.page.mouse.move(cx + deltaX, cy + deltaY, { steps: 10 });
    await this.page.mouse.up();
    // Click the MathQuill input field (outside the canvas) to flush Desmos's post-pan
    // canvas state. A mouse-move alone is insufficient, and clicking the expression-list
    // container lands on empty space that Desmos ignores. Clicking the editable math
    // field fires a full click event on a real interactive element, which causes Desmos
    // to exit its internal pan-mode lock. Without this, resetView() followed by a
    // trace click is silently broken — verified by binary isolation (commenting out panCanvas).
    await this.page.locator(SELECTORS.MATH_INPUT).first().click();
  }

  async zoomIn(times = 1): Promise<void> {
    for (let i = 0; i < times; i++) {
      await this.zoomInButton.click();
    }
  }

  async zoomOut(times = 1): Promise<void> {
    for (let i = 0; i < times; i++) {
      await this.zoomOutButton.click();
    }
  }

  async resetView(): Promise<void> {
    // resetViewButton only appears in the DOM after at least one zoom action.
    await this.resetViewButton.waitFor({ state: 'visible' });
    await this.resetViewButton.click();
  }
}
