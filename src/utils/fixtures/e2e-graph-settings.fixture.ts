import { test as base } from '@playwright/test';
import { GraphSettingsPage } from '../../pages/GraphSettingsPage';
import { CalculatorPage } from '../../pages/CalculatorPage';

type Fixtures = {
  graphSettingsPage: GraphSettingsPage;
  calculatorPage: CalculatorPage;
};

// Both page objects share the same `page` instance injected by Playwright,
// so interactions from either object operate on the same browser page.
export const test = base.extend<Fixtures>({
  graphSettingsPage: async ({ page }, use) => {
    await use(new GraphSettingsPage(page));
  },
  calculatorPage: async ({ page }, use) => {
    await use(new CalculatorPage(page));
  },
});

export { expect } from '@playwright/test';
