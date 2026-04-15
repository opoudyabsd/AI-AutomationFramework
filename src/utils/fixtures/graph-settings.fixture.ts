import { test as base } from '@playwright/test';
import { GraphSettingsPage } from '../../pages/GraphSettingsPage';

type Fixtures = { graphSettingsPage: GraphSettingsPage };

export const test = base.extend<Fixtures>({
  graphSettingsPage: async ({ page }, use) => {
    const graphSettingsPage = new GraphSettingsPage(page);
    await use(graphSettingsPage);
  },
});

export { expect } from '@playwright/test';
