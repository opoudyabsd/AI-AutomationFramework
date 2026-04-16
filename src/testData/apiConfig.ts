// Harness-level configuration for API tests.
// These values configure the test page infrastructure, not the test scenarios.
// Test inputs (expressions, expected states) live in apiTestData.ts.
export const API_CONFIG = {
  DESMOS_API_VERSION: 'v1.11',
  CALCULATOR_CONTAINER_ID: 'calculator',
  DEFAULT_CONTAINER_SIZE: { width: 600, height: 400 },
} as const;
