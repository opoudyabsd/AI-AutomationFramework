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

// Expected States — property names follow the getState()/setState() serialisation convention
// (xmin/xmax/ymin/ymax). Do NOT use these constants with getMathBounds()/setMathBounds(),
// which use the graphpaperBounds convention (left/right/bottom/top).
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

// Valid viewport bounds for viewport-coordinates API coverage.
// Property names use the graphpaperBounds convention (left/right/bottom/top).
// NOTE: The Desmos factory-default y-extent is derived from the container aspect ratio,
// not a fixed value, so no DEFAULT entry is provided here — do not assert the initial
// bounds with toEqual(); use not.toEqual(target) to confirm the fixture is not already
// in the target state before the action under test.
export const VIEWPORT_BOUNDS = {
    WIDE_LANDSCAPE: { left: -20, right: 20, bottom: -5, top: 5 }, // non-default: wide x, narrow y
} as const;
