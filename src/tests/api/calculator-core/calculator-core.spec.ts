import { test, expect } from '../../../utils/fixtures/api-calculator.fixture';
import { TEST_EXPRESSIONS, INVALID_BOUNDS } from '../../../testData/apiTestData';

// Coverage status for calculator-core API (as of 2026-04-16):
//   TC-API-CORE-001 ✅ automated — constructor init, setExpression, getExpressions round-trip
//   TC-API-CORE-002 ✅ automated — setState overwrites graph settings; constructor options persist
//   TC-API-CORE-003 ✅ automated — setMathBounds rejects invalid bounds; viewport unchanged
//   TC-API-CORE-004 ✅ automated — observeEvent emits change with isUserInitiated: false

test.describe('Calculator Core API', { tag: ['@CalculatorCore', '@API'] }, () => {

    // ─────────────────────────────────────────────────────────────────────────────
    // TC-API-CORE-001 | Priority 5
    // Initialize GraphingCalculator with default options.
    // API surface: Desmos.GraphingCalculator constructor, setExpression, getExpressions.
    // ─────────────────────────────────────────────────────────────────────────────
    test(
        'should initialize graphing calculator and perform a setExpression/getExpressions round-trip',
        { tag: ['@Positive'] },
        async ({ calculator }) => {
            // Arrange — calculator is already initialized via fixture
            const { id, latex } = TEST_EXPRESSIONS.SIMPLE_LINEAR;

            // Act — set a simple expression
            await calculator.setExpression({ id, latex });

            // Assert — verify the expression is retrievable
            const expressions = await calculator.getExpressions();

            expect(expressions).toBeDefined();
            expect(expressions).toBeInstanceOf(Array);

            const added = expressions.find((expr) => expr.id === id);
            expect(added).toBeDefined();
            expect(added?.latex).toBe(latex);
        },
    );

    // ─────────────────────────────────────────────────────────────────────────────
    // TC-API-CORE-002 | Priority 5
    // setState overwrites graph settings but not constructor options.
    // API surface: reinitializeWithOptions, updateSettings, getSettings, getState, setState.
    //
    // Key distinction tested:
    //   - degreeMode is a GRAPH SETTING  → overwritten by setState
    //   - expressions:false is a CONSTRUCTOR OPTION → not part of serialised state;
    //     API methods still work after setState (programmatic access unaffected)
    // ─────────────────────────────────────────────────────────────────────────────
    test(
        'should overwrite graph settings via setState while constructor options remain in effect',
        { tag: ['@Positive'] },
        async ({ calculator }) => {

            // ── Phase 1: Re-init with constructor option { expressions: false } ───────
            // The expressions list UI is hidden, but programmatic API access is unaffected.
            await calculator.reinitializeWithOptions({ expressions: false });

            // ── Phase 2: Capture default state (degreeMode: false = radians default) ──
            const defaultState = await calculator.getState();
            const settingsAtDefault = await calculator.getSettings();
            expect(settingsAtDefault.degreeMode).toBe(false);

            // ── Phase 3: Switch to degrees via updateSettings ─────────────────────────
            await calculator.updateSettings({ degreeMode: true });
            const settingsAfterUpdate = await calculator.getSettings();
            expect(settingsAfterUpdate.degreeMode).toBe(true);

            // ── Phase 4: Restore default state (which has degreeMode: false) ──────────
            await calculator.setState(defaultState);
            const settingsAfterSetState = await calculator.getSettings();

            // Graph setting (degreeMode) is overwritten by setState — reverts to false.
            expect(settingsAfterSetState.degreeMode).toBe(false);

            // ── Phase 5: Confirm API still works (constructor option did not break it) ─
            // { expressions: false } hides the UI panel but does not disable API access.
            await calculator.setExpression({ id: 'verify', latex: TEST_EXPRESSIONS.SIMPLE_PARABOLA.latex });
            const expressions = await calculator.getExpressions();
            expect(expressions.find((e) => e.id === 'verify')).toBeDefined();
        },
    );

    // ─────────────────────────────────────────────────────────────────────────────
    // TC-API-CORE-003 | Priority 4
    // setMathBounds rejects invalid bounds and leaves the viewport unchanged.
    // API surface: setMathBounds, getMathBounds (graphpaperBounds.mathCoordinates).
    //
    // Two invalid conditions covered (per API docs):
    //   - right <= left  (degenerate or reversed x-axis)
    //   - top <= bottom  (degenerate or reversed y-axis)
    // ─────────────────────────────────────────────────────────────────────────────
    test(
        'should reject invalid math bounds and leave the viewport unchanged',
        { tag: ['@Negative'] },
        async ({ calculator }) => {

            // ── Phase 1: Capture initial bounds ───────────────────────────────────────
            const initialBounds = await calculator.getMathBounds();

            // Sanity: Desmos default viewport has right > left and top > bottom.
            expect(initialBounds.right).toBeGreaterThan(initialBounds.left);
            expect(initialBounds.top).toBeGreaterThan(initialBounds.bottom);

            // ── Phase 2: Attempt bounds where right <= left ───────────────────────────
            await calculator.setMathBounds(INVALID_BOUNDS.EQUAL_X);
            const boundsAfterInvalidX = await calculator.getMathBounds();
            expect(boundsAfterInvalidX).toEqual(initialBounds);

            // ── Phase 3: Attempt bounds where top <= bottom ───────────────────────────
            await calculator.setMathBounds(INVALID_BOUNDS.EQUAL_Y);
            const boundsAfterInvalidY = await calculator.getMathBounds();
            expect(boundsAfterInvalidY).toEqual(initialBounds);
        },
    );

    // ─────────────────────────────────────────────────────────────────────────────
    // TC-API-CORE-004 | Priority 4
    // observeEvent('change') emits for API-driven updates with isUserInitiated: false.
    // API surface: observeEvent, unobserveEvent (via setupChangeObserver / unobserveChange).
    //
    // Event absence after unobserve: verified with a 300 ms quiescence window.
    // No DOM proxy exists for "observer did not fire" — waitForTimeout is the last resort
    // and is the minimum documented in TC-API-CORE-004 automation notes.
    // ─────────────────────────────────────────────────────────────────────────────
    test(
        'should emit change event with isUserInitiated false for API-driven updates, then stop after unobserve',
        { tag: ['@Positive'] },
        async ({ calculator, desmosApiPage }) => {

            // ── Phase 1: Register observer and confirm no events at baseline ──────────
            await calculator.setupChangeObserver();
            const initialChanges = await calculator.getObservedChanges();
            expect(initialChanges.length).toBe(0);

            // ── Phase 2: Trigger an API update ────────────────────────────────────────
            await calculator.setExpression({ id: 'api-change', latex: TEST_EXPRESSIONS.SIMPLE_PARABOLA.latex });

            // ── Phase 3: Wait for at least one change event (bounded polling) ─────────
            await calculator.waitForEventCount(1);
            const changesAfterSet = await calculator.getObservedChanges();
            expect(changesAfterSet.length).toBeGreaterThanOrEqual(1);

            // The change was driven by the API — isUserInitiated must be false.
            const firstEvent = changesAfterSet[0];
            expect(firstEvent.isUserInitiated).toBe(false);

            // ── Phase 4: Unobserve and confirm no further events are captured ─────────
            const countBeforeUnobserve = changesAfterSet.length;
            await calculator.unobserveChange();

            // Trigger another API update after unobserving.
            await calculator.setExpression({ id: 'post-unobserve', latex: TEST_EXPRESSIONS.SIMPLE_LINEAR.latex });

            // Brief quiescence window — no DOM proxy exists for "observer did not fire".
            // 300 ms covers Desmos's change-event debounce; any event slipping through
            // would be caught by the count assertion below.
            await desmosApiPage.waitForTimeout(300);

            const countAfterUnobserve = (await calculator.getObservedChanges()).length;
            expect(countAfterUnobserve).toBe(countBeforeUnobserve);
        },
    );

});
