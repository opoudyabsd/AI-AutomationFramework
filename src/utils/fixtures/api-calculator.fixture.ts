import 'dotenv/config';
import { test as base, Page } from '@playwright/test';
import { API_CONFIG } from '../../testData/apiConfig';

// NOTE: API tests require outbound HTTPS access to https://www.desmos.com/api/
// Ensure the Desmos CDN is reachable from CI before running this suite.
const desmosApiKey = process.env.DESMOS_API_KEY;

if (!desmosApiKey) {
    throw new Error('Missing required environment variable: DESMOS_API_KEY');
}

// ── Types ─────────────────────────────────────────────────────────────────────

export type MathBounds = { left: number; right: number; bottom: number; top: number };
export type ChangeEvent = { isUserInitiated: boolean };

type DesmosCalculator = {
    // Core expression API
    setExpression: (options: { id: string; latex: string }) => Promise<void>;
    getExpressions: () => Promise<Array<{ id: string; latex?: string }>>;

    // State API — state object is treated as opaque per Desmos docs; unknown enforces explicit cast at call site
    setState: (state: unknown) => Promise<void>;
    getState: () => Promise<unknown>;

    // Settings API
    updateSettings: (opts: Record<string, unknown>) => Promise<void>;
    getSettings: () => Promise<Record<string, unknown>>;

    // Re-initialise the calculator with different constructor options.
    // Destroys the current instance and creates a fresh one on the same container.
    reinitializeWithOptions: (opts: Record<string, unknown>) => Promise<void>;

    // Viewport API
    setMathBounds: (bounds: MathBounds) => Promise<void>;
    getMathBounds: () => Promise<MathBounds>;

    // Change-event observation helpers
    setupChangeObserver: () => Promise<void>;
    getObservedChanges: () => Promise<ChangeEvent[]>;
    waitForEventCount: (minCount: number) => Promise<void>;
    unobserveChange: () => Promise<void>;

    // Lifecycle
    destroy: () => Promise<void>;
};

type APIFixtures = {
    desmosApiPage: Page;
    calculator: DesmosCalculator;
};

// ── Fixtures ──────────────────────────────────────────────────────────────────

export const test = base.extend<APIFixtures>({
    desmosApiPage: async ({ page }, use) => {
        await page.goto('about:blank');

        await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <script src="https://www.desmos.com/api/${API_CONFIG.DESMOS_API_VERSION}/calculator.js?apiKey=${desmosApiKey}"></script>
        </head>
        <body>
          <div id="${API_CONFIG.CALCULATOR_CONTAINER_ID}"
               style="width: ${API_CONFIG.DEFAULT_CONTAINER_SIZE.width}px; height: ${API_CONFIG.DEFAULT_CONTAINER_SIZE.height}px;">
          </div>
        </body>
      </html>
    `);

        // Wait for the Desmos script to finish loading.
        // Explicit 15 s timeout surfaces CDN issues as a clear TimeoutError rather
        // than a cascade of cryptic "Desmos is not defined" errors in every test.
        await page.waitForFunction(
            () => typeof (window as any).Desmos !== 'undefined',
            { timeout: 15_000 },
        );

        await use(page);
    },

    calculator: async ({ desmosApiPage }, use) => {
        // G2 fix: unique per-instance key prevents collision if fixture scope widens
        // beyond 'function' or tests run in a shared browser context.
        const globalKey = `__testCalc_${Math.random().toString(36).slice(2, 8)}`;

        const init = await desmosApiPage.evaluate(
            ({ containerId, key }) => {
                const element = document.getElementById(containerId);
                if (!element) {
                    throw new Error(`Container element #${containerId} not found`);
                }
                const calc = (window as any).Desmos.GraphingCalculator(element);
                (window as any)[key] = calc;
                return { initialized: true };
            },
            { containerId: API_CONFIG.CALCULATOR_CONTAINER_ID, key: globalKey },
        );

        if (!init.initialized) {
            throw new Error('Calculator initialization failed');
        }

        const calculatorProxy: DesmosCalculator = {
            setExpression: async (options) => {
                await desmosApiPage.evaluate(
                    ({ opts, key }) => { (window as any)[key].setExpression(opts); },
                    { opts: options, key: globalKey },
                );
            },

            getExpressions: async () => {
                return await desmosApiPage.evaluate(
                    (key) => (window as any)[key].getExpressions(),
                    globalKey,
                );
            },

            setState: async (state) => {
                await desmosApiPage.evaluate(
                    ({ s, key }) => { (window as any)[key].setState(s); },
                    { s: state, key: globalKey },
                );
            },

            getState: async () => {
                return await desmosApiPage.evaluate(
                    (key) => (window as any)[key].getState(),
                    globalKey,
                );
            },

            updateSettings: async (opts) => {
                await desmosApiPage.evaluate(
                    ({ o, key }) => { (window as any)[key].updateSettings(o); },
                    { o: opts, key: globalKey },
                );
            },

            getSettings: async () => {
                return await desmosApiPage.evaluate((key) => {
                    // Spread to a plain serialisable object so Playwright's JSON round-trip
                    // captures all own enumerable properties from Desmos's settings object.
                    return Object.assign({}, (window as any)[key].settings) as Record<string, unknown>;
                }, globalKey);
            },

            reinitializeWithOptions: async (opts) => {
                await desmosApiPage.evaluate(
                    ({ key, containerId, options }) => {
                        if ((window as any)[key]) {
                            (window as any)[key].destroy();
                        }
                        const element = document.getElementById(containerId);
                        if (!element) throw new Error(`Container #${containerId} not found`);
                        (window as any)[key] = (window as any).Desmos.GraphingCalculator(element, options);
                    },
                    { key: globalKey, containerId: API_CONFIG.CALCULATOR_CONTAINER_ID, options: opts },
                );
            },

            setMathBounds: async (bounds) => {
                await desmosApiPage.evaluate(
                    ({ b, key }) => { (window as any)[key].setMathBounds(b); },
                    { b: bounds, key: globalKey },
                );
            },

            getMathBounds: async () => {
                return await desmosApiPage.evaluate((key) => {
                    const c = (window as any)[key].graphpaperBounds.mathCoordinates;
                    return { left: c.left, right: c.right, bottom: c.bottom, top: c.top };
                }, globalKey);
            },

            setupChangeObserver: async () => {
                await desmosApiPage.evaluate((key) => {
                    (window as any)[`${key}_events`] = [];
                    (window as any)[key].observeEvent('change', (event: any) => {
                        (window as any)[`${key}_events`].push({
                            isUserInitiated: event?.isUserInitiated ?? false,
                        });
                    });
                }, globalKey);
            },

            getObservedChanges: async () => {
                return await desmosApiPage.evaluate(
                    (key) => ((window as any)[`${key}_events`] ?? []) as ChangeEvent[],
                    globalKey,
                );
            },

            waitForEventCount: async (minCount) => {
                // Uses waitForFunction (bounded polling) rather than a fixed sleep,
                // per TC-API-CORE-004 automation note on debounce timing.
                await desmosApiPage.waitForFunction(
                    ({ key, n }: { key: string; n: number }) =>
                        ((window as any)[`${key}_events`] ?? []).length >= n,
                    { key: globalKey, n: minCount },
                    { timeout: 5_000 },
                );
            },

            unobserveChange: async () => {
                await desmosApiPage.evaluate((key) => {
                    (window as any)[key].unobserveEvent('change');
                    // Events array is preserved so getObservedChanges() still works post-unobserve.
                    // Cleaned up in destroy().
                }, globalKey);
            },

            destroy: async () => {
                await desmosApiPage.evaluate((key) => {
                    if ((window as any)[key]) {
                        (window as any)[key].destroy();
                        delete (window as any)[key];
                    }
                    delete (window as any)[`${key}_events`];
                }, globalKey);
            },
        };

        await use(calculatorProxy);
        await calculatorProxy.destroy();
    },
});

export { expect } from '@playwright/test';
