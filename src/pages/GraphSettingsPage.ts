import { Page, Locator } from '@playwright/test';
import { ARIA, SELECTORS } from '../testData/constants';

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
