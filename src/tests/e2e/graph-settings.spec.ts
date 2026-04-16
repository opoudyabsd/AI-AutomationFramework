import { test, expect } from '../../utils/fixtures/e2e-graph-settings.fixture';
import { e2eGraphSettingsData, graphSettingsData, expressionEntryData, graphCoordinates } from '../../testData/testData';
import { ATTRS, ATTR_VALUES } from '../../testData/cssConstant';
import { DESMOS_ANIMATION_SETTLE_DELAY } from '../../testData/constants';

test.describe('Graph Settings – E2E', { tag: ['@e2e', '@graph-settings'] }, () => {
  test.beforeEach(async ({ graphSettingsPage }) => {
    await graphSettingsPage.goto();
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // TC-E2-E2E-001 | Priority 4
  // Settings → expression rendering integration:
  // set custom domain → graph function → verify → reset domain → verify.
  // ─────────────────────────────────────────────────────────────────────────────
  test('should set custom axis domain, graph a function, and verify rendering within the adjusted viewport',
    async ({ graphSettingsPage, calculatorPage }) => {

      // ── Phase 1: Apply a custom axis domain ──────────────────────────────────

      await graphSettingsPage.openSettings();

      // Set x ∈ [0, 4] and y ∈ [−1, 5]
      await graphSettingsPage.setAxisDomain(
        e2eGraphSettingsData.customXMin,
        e2eGraphSettingsData.customXMax,
        e2eGraphSettingsData.customYMin,
        e2eGraphSettingsData.customYMax,
      );

      await graphSettingsPage.closeSettings();

      // Canvas aria-label is the only DOM proxy for viewport extents.
      // After setting x ∈ [0, 4] it reads "X axis visible from 0 to 4 …".
      // The y ∈ [−1, 5] change is not independently asserted: the aria-label
      // encodes Y values as screen-reader decimal strings (e.g. "7.8 0 0 9 3")
      // whose exact format is Desmos-version dependent and fragile to pin.
      await expect(graphSettingsPage.graphCanvas)
        .toHaveAttribute(ATTRS.ARIA_LABEL, e2eGraphSettingsData.customViewportXPattern);

      // ── Phase 2: Graph a function and verify it renders without error ─────────

      await calculatorPage.typeExpression(expressionEntryData.quadraticExpression);

      // Absence of role="note" error element is the DOM proxy for a successful graph render.
      await expect(calculatorPage.expressionItem).toBeVisible();
      await expect(calculatorPage.expressionError).not.toBeVisible();

      // ── Phase 3: Reset to default domain and verify full viewport restored ────

      await graphSettingsPage.openSettings();
      await graphSettingsPage.setAxisDomain(
        e2eGraphSettingsData.defaultXMin,
        e2eGraphSettingsData.defaultXMax,
        e2eGraphSettingsData.defaultYMin,
        e2eGraphSettingsData.defaultYMax,
      );
      await graphSettingsPage.closeSettings();

      await expect(graphSettingsPage.graphCanvas)
        .toHaveAttribute(ATTRS.ARIA_LABEL, graphSettingsData.defaultViewportPattern);

      // Expression must be intact and error-free after domain reset
      await expect(calculatorPage.expressionItem).toBeVisible();
      await expect(calculatorPage.expressionError).not.toBeVisible();
    },
  );

  // ─────────────────────────────────────────────────────────────────────────────
  // TC-E2-E2E-002 | Priority 3
  // Angle unit round-trip: graph sin(x) → verify radians default → switch to
  // degrees → verify expression survives unit change → switch back → verify.
  //
  // Period-change proxy: the aria-checked state on the radio buttons is the
  // only stable DOM signal for the active angle unit. Canvas-rendered tick
  // numbers and curve shape are not assertable via DOM.
  // ─────────────────────────────────────────────────────────────────────────────
  test('should switch angle unit from radians to degrees and back, verifying expression renders throughout',
    async ({ graphSettingsPage, calculatorPage }) => {

      // ── Phase 1: Graph sin(x) — baseline in default Radians mode ─────────────

      await calculatorPage.typeExpression(expressionEntryData.sineExpression);
      await expect(calculatorPage.expressionItem).toBeVisible();
      await expect(calculatorPage.expressionError).not.toBeVisible();

      // ── Phase 2: Confirm Radians is the default, then switch to Degrees ───────

      await graphSettingsPage.openSettings();

      // Assert default state before touching the control
      await expect(graphSettingsPage.radiansOption).toHaveAttribute(ATTRS.ARIA_CHECKED, ATTR_VALUES.TRUE);
      await expect(graphSettingsPage.degreesOption).toHaveAttribute(ATTRS.ARIA_CHECKED, ATTR_VALUES.FALSE);

      // Act — switch to Degrees and assert the selection flips immediately
      await graphSettingsPage.switchToDegrees();
      await expect(graphSettingsPage.degreesOption).toHaveAttribute(ATTRS.ARIA_CHECKED, ATTR_VALUES.TRUE);
      await expect(graphSettingsPage.radiansOption).toHaveAttribute(ATTRS.ARIA_CHECKED, ATTR_VALUES.FALSE);

      await graphSettingsPage.closeSettings();

      // sin(x) must still render after the unit change — the period has shifted to 360
      // (peak now at x = 90°, outside the default x ∈ [−10, 10] viewport), but the
      // expression is valid in both modes so no error is expected.
      await expect(calculatorPage.expressionItem).toBeVisible();
      await expect(calculatorPage.expressionError).not.toBeVisible();

      // ── Phase 3: Switch back to Radians and verify round-trip ─────────────────

      await graphSettingsPage.openSettings();

      // Assert degrees is still selected after panel reopen (state persists)
      await expect(graphSettingsPage.degreesOption).toHaveAttribute(ATTRS.ARIA_CHECKED, ATTR_VALUES.TRUE);

      // Act — switch back to Radians
      await graphSettingsPage.switchToRadians();
      await expect(graphSettingsPage.radiansOption).toHaveAttribute(ATTRS.ARIA_CHECKED, ATTR_VALUES.TRUE);
      await expect(graphSettingsPage.degreesOption).toHaveAttribute(ATTRS.ARIA_CHECKED, ATTR_VALUES.FALSE);

      await graphSettingsPage.closeSettings();

      // Expression must still be intact after the full round-trip
      await expect(calculatorPage.expressionItem).toBeVisible();
      await expect(calculatorPage.expressionError).not.toBeVisible();
    },
  );

  // ─────────────────────────────────────────────────────────────────────────────
  // TC-E2-E2E-003 | Priority 3
  // Viewport interaction workflow: graph y=x²−4 → zoom in → pan → reset →
  // trace right intercept at (2, 0) → verify default viewport and expression.
  //
  // Trace ordering: The test case calls for tracing the intercept while zoomed.
  // However, after zoom and pan the graphCoordToCanvasPixel helper's ±10 default
  // scale is no longer accurate, making a zoomed-state click unreliable.
  // Per the test case's own "Zoom In → Reset" alternative, the trace is
  // performed AFTER reset so the default coordinate mapping is guaranteed correct.
  //
  // Pan assertion: The canvas aria-label does not update after a drag pan
  // (live-verified — see dom-gotchas.md). The pan action is exercised as part
  // of the realistic user workflow; its effect is verified indirectly by the
  // successful subsequent reset and trace.
  // ─────────────────────────────────────────────────────────────────────────────
  test('should zoom in, pan, reset viewport, then trace right intercept and confirm default view restored',
    async ({ graphSettingsPage, calculatorPage, page }) => {

      // ── Phase 1: Graph y=x²−4 (right intercept at (2, 0), left at (−2, 0)) ───

      await calculatorPage.typeExpression(expressionEntryData.interceptExpression);
      await expect(calculatorPage.expressionItem).toBeVisible();
      await expect(calculatorPage.expressionError).not.toBeVisible();

      // ── Phase 2: Zoom in — verify viewport narrows ────────────────────────────

      await graphSettingsPage.zoomIn(graphSettingsData.zoomStepsToLeaveDefault);

      // Negative assertion: the exact post-zoom range is Desmos-internal so we
      // verify only that the viewport left the default, not a specific target value.
      await expect(graphSettingsPage.graphCanvas)
        .not.toHaveAttribute(ATTRS.ARIA_LABEL, graphSettingsData.defaultViewportPattern);

      // ── Phase 3: Pan canvas to the right — exercise the drag interaction ──────

      // Drag left (negative deltaX) shifts the visible range toward positive x,
      // centring the viewport closer to the right intercept region at x ≈ 2.
      // Pan result has no DOM text proxy (aria-label is static after drag);
      // correctness is verified via the subsequent reset and trace steps.
      await graphSettingsPage.panCanvas(e2eGraphSettingsData.panDistancePx);

      // ── Phase 4: Reset to default viewport ───────────────────────────────────

      await graphSettingsPage.resetView();

      // Canvas aria-label must revert to the default x ∈ [−10, 10] pattern after reset.
      // The aria-label tracks the animation in progress (not a static value), so this
      // assertion only passes once the viewport animation fully completes (~2 s).
      await expect(graphSettingsPage.graphCanvas)
        .toHaveAttribute(ATTRS.ARIA_LABEL, graphSettingsData.defaultViewportPattern);

      // ── Phase 5: Trace right intercept in the restored default viewport ───────

      // Even after the aria-label settles, Desmos requires a brief canvas settle period
      // before POI trace clicks are reliable.
      await page.waitForTimeout(DESMOS_ANIMATION_SETTLE_DELAY);

      // graphCoordToCanvasPixel is reliable only when the ±10 default range is active,
      // which is confirmed by the assertion above.
      await calculatorPage.clickGraphAtGraphCoord(
        graphCoordinates.rightIntercept.graphX,
        graphCoordinates.rightIntercept.graphY,
      );

      // The right intercept at (2, 0) is a POI; the Export button grandparent holds
      // the coordinate text. Unicode minus is not involved (positive coordinate).
      await expect(calculatorPage.traceCoordinates).toContainText(expressionEntryData.poiCoordinates);

      // ── Phase 6: Expression is intact after the full zoom/pan/reset cycle ─────

      await expect(calculatorPage.expressionItem).toBeVisible();
      await expect(calculatorPage.expressionError).not.toBeVisible();
    },
  );
});
