import { test, expect } from '../../../utils/fixtures/api-calculator.fixture';
import { VIEWPORT_BOUNDS } from '../../../testData/apiTestData';

// Coverage status for viewport-coordinates API (as of 2026-04-16):
//   TC-API-VIEWPORT-001 ✅ automated — setMathBounds updates viewport to requested bounds
//   TC-API-VIEWPORT-003 ⏳ pending   — graphpaperBounds observer emits on viewport changes

test.describe('Viewport Coordinates API', { tag: ['@ViewportCoordinates', '@API'] }, () => {

    // ─────────────────────────────────────────────────────────────────────────────
    // TC-API-VIEWPORT-001 | Priority 4
    // Set viewport with setMathBounds.
    // API surface: setMathBounds, graphpaperBounds.mathCoordinates.
    // ─────────────────────────────────────────────────────────────────────────────
    test(
        'should update the viewport to the requested math bounds',
        { tag: ['@Positive'] },
        async ({ calculator }) => {
            // Precondition — fixture must not already be in the target state.
            // The Desmos default y-extent varies with container aspect ratio, so we assert
            // the negative: initial bounds ≠ WIDE_LANDSCAPE. This would catch state
            // contamination from a previous test without depending on exact default values.
            const initialBounds = await calculator.getMathBounds();
            expect(initialBounds).not.toEqual(VIEWPORT_BOUNDS.WIDE_LANDSCAPE);

            await calculator.setMathBounds(VIEWPORT_BOUNDS.WIDE_LANDSCAPE);

            // setMathBounds is synchronous — read result directly, no polling needed.
            const updatedBounds = await calculator.getMathBounds();
            expect(updatedBounds).toEqual(VIEWPORT_BOUNDS.WIDE_LANDSCAPE);
        },
    );

});