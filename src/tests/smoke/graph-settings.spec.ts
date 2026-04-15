import { test, expect } from '../../utils/fixtures/graph-settings.fixture';
import { graphSettingsData } from '../../testData/testData';
import { ATTRS } from '../../testData/cssConstant';

test.describe('Graph Settings', { tag: ['@smoke', '@graph-settings'] }, () => {
  test.beforeEach(async ({ graphSettingsPage }) => {
    await graphSettingsPage.goto();
  });

  // TC-E2-01-001 | Priority 5
  test('should open Graph Settings panel and expose angle unit controls', async ({ graphSettingsPage }) => {
    // Act
    await graphSettingsPage.openSettings();

    // Assert — panel container is visible with all angle unit controls accessible
    await expect(graphSettingsPage.settingsPanel).toBeVisible();
    await expect(graphSettingsPage.angleSettingsGroup).toBeVisible();
    await expect(graphSettingsPage.radiansOption).toBeVisible();
    await expect(graphSettingsPage.degreesOption).toBeVisible();
  });

  test.describe('Viewport controls', () => {
    // TC-E2-03-001 | Priority 5
    test('should zoom in when Zoom In button is clicked', async ({ graphSettingsPage }) => {
      // Precondition — confirm default viewport before acting
      await expect(graphSettingsPage.graphCanvas).toHaveAttribute(ATTRS.ARIA_LABEL, graphSettingsData.defaultViewportPattern);

      // Act
      await graphSettingsPage.zoomIn(graphSettingsData.zoomStepsToLeaveDefault);

      // Assert — axis range has narrowed; default viewport pattern no longer matches
      await expect(graphSettingsPage.graphCanvas).not.toHaveAttribute(ATTRS.ARIA_LABEL, graphSettingsData.defaultViewportPattern);
    });

    // TC-E2-03-002 | Priority 5
    test('should zoom out when Zoom Out button is clicked', async ({ graphSettingsPage }) => {
      // Precondition — confirm default viewport before acting
      await expect(graphSettingsPage.graphCanvas).toHaveAttribute(ATTRS.ARIA_LABEL, graphSettingsData.defaultViewportPattern);

      // Act
      await graphSettingsPage.zoomOut(graphSettingsData.zoomStepsToLeaveDefault);

      // Assert — axis range has widened; default viewport pattern no longer matches
      await expect(graphSettingsPage.graphCanvas).not.toHaveAttribute(ATTRS.ARIA_LABEL, graphSettingsData.defaultViewportPattern);
    });

    // TC-E2-03-003 | Priority 4
    test('should restore default viewport when Default Viewport button is clicked', async ({ graphSettingsPage }) => {
      // Arrange — zoom to a non-default state (also causes the reset button to appear in the DOM)
      await graphSettingsPage.zoomIn(graphSettingsData.zoomStepsToLeaveDefault);

      // Act
      await graphSettingsPage.resetView();

      // Assert — axis range is back to the default x ∈ [-10, 10]
      await expect(graphSettingsPage.graphCanvas).toHaveAttribute(ATTRS.ARIA_LABEL, graphSettingsData.defaultViewportPattern);
    });
  });
});
