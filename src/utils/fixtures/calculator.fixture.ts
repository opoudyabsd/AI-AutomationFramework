import { test as base } from '@playwright/test';
import { CalculatorPage } from '../../pages/CalculatorPage';

type Fixtures = {
  calculatorPage: CalculatorPage;
};

export const test = base.extend<Fixtures>({
  calculatorPage: async ({ page }, use) => {
    const calculatorPage = new CalculatorPage(page);
    await use(calculatorPage);
  },
});

export { expect } from '@playwright/test';
