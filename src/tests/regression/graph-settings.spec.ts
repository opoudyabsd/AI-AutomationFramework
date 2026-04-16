import { test, expect } from '../../utils/fixtures/graph-settings.fixture';
import { ATTRS, ATTR_VALUES } from '../../testData/cssConstant';

test.describe('Graph Settings – Regression', { tag: ['@regression', '@graph-settings'] }, () => {
  test.beforeEach(async ({ graphSettingsPage }) => {
    await graphSettingsPage.goto();
  });

  // TC-E2-01-002 | Priority 3
  test('should default to Radians as the selected angle unit', async ({ graphSettingsPage }) => {
    // Act
    await graphSettingsPage.openSettings();

    // Assert — Radians is checked by default; Degrees is not
    await expect(graphSettingsPage.radiansOption).toHaveAttribute(ATTRS.ARIA_CHECKED, ATTR_VALUES.TRUE);
    await expect(graphSettingsPage.degreesOption).toHaveAttribute(ATTRS.ARIA_CHECKED, ATTR_VALUES.FALSE);
  });
});
