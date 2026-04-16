// Test inputs and expected values for Desmos API tests.
// Harness configuration (API version, container dimensions) lives in apiConfig.ts.

// Test Expressions
export const TEST_EXPRESSIONS = {
    SIMPLE_LINEAR: {
        id: 'line',
        latex: 'y=x',
    },
    SIMPLE_PARABOLA: {
        id: 'parabola',
        latex: 'y=x^2',
    },
} as const;

// Expected States
export const EXPECTED_STATES = {
    DEFAULT_VIEWPORT: {
        xmin: -10,
        xmax: 10,
        ymin: -10,
        ymax: 10,
    },
} as const;

// Invalid math bounds for TC-API-CORE-003 (rejection scenarios).
// Both cases are documented in the Desmos API: right <= left and top <= bottom are rejected.
export const INVALID_BOUNDS = {
    EQUAL_X: { left: 5, right: 5, bottom: -10, top: 10 },  // right <= left
    EQUAL_Y: { left: -10, right: 10, bottom: 3, top: 3 },  // top <= bottom
} as const;
