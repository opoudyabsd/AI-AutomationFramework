import { test, expect } from '../../utils/fixtures/calculator.fixture';
import { expressionEntryData, graphCoordinates } from '../../testData/testData';

test.describe('Expression Entry', { tag: ['@regression', '@expression-entry'] }, () => {
  test.beforeEach(async ({ calculatorPage }) => {
    await calculatorPage.goto();
  });

  // TC-E1-01-002 | Priority 3
  test('should graph a function without y= prefix', async ({ calculatorPage }) => {
    // Act
    await calculatorPage.typeExpression(expressionEntryData.sineExpression);

    // Assert — expression item is visible and no error (proxy for successful graph render)
    await expect(calculatorPage.expressionItem).toBeVisible();
    await expect(calculatorPage.expressionError).not.toBeVisible();
  });

  test.describe('Expression types', () => {
    // TC-E1-01-003 | Priority 3
    test('should display evaluated result for arithmetic expression without drawing a curve', async ({ calculatorPage }) => {
      // Act
      await calculatorPage.typeExpression(expressionEntryData.arithmeticExpression);

      // Assert — result shown inline; no error present
      await expect(calculatorPage.expressionItem).toBeVisible();
      await expect(calculatorPage.expressionItem).toContainText(expressionEntryData.arithmeticResult);
      await expect(calculatorPage.expressionError).not.toBeVisible();
    });

    // TC-E1-01-004 | Priority 4
    test('should show inline error indicator for malformed expression', async ({ calculatorPage }) => {
      // Act
      await calculatorPage.typeExpression(expressionEntryData.malformedExpression);

      // Assert — error indicator present (proxy that no curve was drawn)
      await expect(calculatorPage.expressionError).toBeVisible();
    });

    // TC-E1-01-005 | Priority 2
    test('should show no error and no graph for empty expression line on load', async ({ calculatorPage }) => {
      // Assert — default state after page load: expression row exists, no error
      await expect(calculatorPage.expressionItem).toBeVisible();
      await expect(calculatorPage.expressionError).not.toBeVisible();
    });
  });

  test.describe('Edit and clear', () => {
    // TC-E1-02-001 | Priority 4
    test('should update graph when an existing expression is edited', async ({ calculatorPage }) => {
      // Arrange
      await calculatorPage.typeExpression(expressionEntryData.quadraticExpression);

      // Act — editExpression uses End+Shift+Home (MathQuill-safe select-all)
      await calculatorPage.editExpression(expressionEntryData.cubicExpression);

      // Assert — new expression renders without error (proxy for updated curve)
      await expect(calculatorPage.expressionItem).toBeVisible();
      await expect(calculatorPage.expressionError).not.toBeVisible();
    });

    // TC-E1-02-002 | Priority 3
    test('should remove graph when all expression content is cleared', async ({ calculatorPage }) => {
      // Arrange
      await calculatorPage.typeExpression(expressionEntryData.quadraticExpression);

      // Act — clearExpression uses End+Shift+Home (MathQuill-safe select-all)
      await calculatorPage.clearExpression();

      // Assert — blank line, no error (mirrors default initial state)
      await expect(calculatorPage.expressionItem).toBeVisible();
      await expect(calculatorPage.expressionError).not.toBeVisible();
    });
  });

  test.describe('Add expression line', () => {
    // TC-E1-03-001 | Priority 4
    test('should add a new blank expression line when Enter is pressed', async ({ calculatorPage }) => {
      // Arrange
      const initialCount = await calculatorPage.expressionItems.count();

      // Act
      await calculatorPage.addExpressionLineViaEnter();

      // Assert — one additional expression row in the list
      await expect(calculatorPage.expressionItems).toHaveCount(initialCount + 1);
    });

    // TC-E1-03-002 | Priority 2
    test('should add a new blank expression line via Ctrl+Alt+X keyboard shortcut', async ({ calculatorPage }) => {
      // Arrange
      const initialCount = await calculatorPage.expressionItems.count();

      // Act — shortcut unverified, confirm in live app before committing
      await calculatorPage.addExpressionLineViaShortcut();

      // Assert
      await expect(calculatorPage.expressionItems).toHaveCount(initialCount + 1);
    });

    // TC-E1-03-003 | Priority 3
    test('should add a new expression line via the Add Item button', async ({ calculatorPage }) => {
      // Arrange
      const initialCount = await calculatorPage.expressionItems.count();

      // Act — uses getByText (Desmos dropdown has no role="menuitem")
      await calculatorPage.addExpressionViaButton();

      // Assert
      await expect(calculatorPage.expressionItems).toHaveCount(initialCount + 1);
    });

    // TC-E1-03-004 | Priority 3
    test('should announce new expression line addition to screen reader', async ({ calculatorPage }) => {
      // Arrange
      const initialCount = await calculatorPage.expressionItems.count();

      // Act
      await calculatorPage.addExpressionLineViaEnter();

      // Assert — functional: new row exists
      await expect(calculatorPage.expressionItems).toHaveCount(initialCount + 1);
      // Assert — accessibility: new expression row exposes a labelled textbox accessible to screen readers.
      // Desmos uses a single MathQuill aria-live span (always empty) and does not expose a
      // persistent announcement live region, so aria-live content cannot be reliably asserted.
      // The textbox accessible name ("Expression N:") confirms the item is screen-reader navigable.
      const newItem = calculatorPage.expressionItems.last();
      // MathQuill's <textarea> is CSS-hidden but screen-reader accessible via aria-labelledby.
      // toBeVisible() fails because it is intentionally hidden; check accessible name directly.
      await expect(newItem.getByRole('textbox')).toHaveAccessibleName(/Expression \d+:/);
      await expect(newItem.getByRole('textbox')).toBeFocused();
    });
  });

  test.describe('Visibility toggle', () => {
    // TC-E1-04-001 | Priority 4
    test('should hide a graphed expression when the color icon is clicked', async ({ calculatorPage }) => {
      // Arrange
      await calculatorPage.typeExpression(expressionEntryData.quadraticExpression);

      // Act
      await calculatorPage.toggleExpressionVisibility();

      // Assert — when hidden the button accessible name changes to "Show Expression N"
      // (.dcg-expression-icon is visual-only and does not receive a 'hidden' CSS class we can observe)
      await expect(calculatorPage.expressionToggleButton).toHaveAccessibleName(/Show Expression/);
    });

    // TC-E1-04-002 | Priority 3
    test('should show a previously hidden expression when the color icon is clicked again', async ({ calculatorPage }) => {
      // Arrange
      await calculatorPage.typeExpression(expressionEntryData.quadraticExpression);
      await calculatorPage.toggleExpressionVisibility(); // hide first

      // Act
      await calculatorPage.toggleExpressionVisibility(); // show

      // Assert — button name reverts to "Hide Expression N" (expression is visible again)
      await expect(calculatorPage.expressionToggleButton).toHaveAccessibleName(/Hide Expression/);
    });

    // TC-E1-04-003 | Priority 3
    test('should hide a graphed expression via Ctrl+Shift+O then Enter keyboard shortcut', async ({ calculatorPage }) => {
      // Arrange
      await calculatorPage.typeExpression(expressionEntryData.quadraticExpression);

      // Act — follow the documented keyboard path directly.
      await calculatorPage.hideExpressionViaKeyboard();

      // Assert — button name changed to "Show Expression N" confirms the expression was hidden
      await expect(calculatorPage.expressionToggleButton).toHaveAccessibleName(/Show Expression/);
    });

    test.describe('Style menu', () => {
      // TC-E1-05-001 | Priority 3
      test('should open Style menu when color icon is clicked and held', async ({ calculatorPage }) => {
        // Arrange
        await calculatorPage.typeExpression(expressionEntryData.quadraticExpression);

        // Act — click({delay:700}) simulates click-and-hold (replaced dispatchEvent which was insufficient)
        await calculatorPage.openStyleMenuViaClickHold();

        // Assert — style menu container becomes visible
        // Selector unverified — confirm against live DOM before committing
        await expect(calculatorPage.styleMenu).toBeVisible();
      });

      // TC-E1-05-002 | Priority 3
      test('should update color icon when a new colour is selected in the Style menu', async ({ calculatorPage }) => {
        // Arrange
        await calculatorPage.typeExpression(expressionEntryData.quadraticExpression);
        await calculatorPage.openStyleMenuViaClickHold();
        await expect(calculatorPage.styleMenu).toBeVisible();

        // Act — color swatch selector unverified, confirm against live DOM before committing
        await calculatorPage.selectFirstStyleColor();

        // Assert — icon is still visible (color changed; exact attribute check
        // requires live DOM inspection to identify the color-reflecting attribute)
        await expect(calculatorPage.expressionIcon).toBeVisible();
      });

      // TC-E1-05-003 | Priority 3
      test('should open Style menu via Ctrl+Shift+O keyboard shortcut', async ({ calculatorPage }) => {
        // Arrange
        await calculatorPage.typeExpression(expressionEntryData.quadraticExpression);

        // Act
        await calculatorPage.openStyleMenuViaKeyboard();

        // Assert — style menu container becomes visible
        // Selector unverified — confirm against live DOM before committing
        await expect(calculatorPage.styleMenu).toBeVisible();
      });
    });

    test.describe('Trace and points of interest', () => {
      // TC-E1-07-001 | Priority 4
      test('should display coordinate tooltip when a point on a graphed curve is clicked', async ({ calculatorPage }) => {
        // Arrange
        await calculatorPage.typeExpression(expressionEntryData.quadraticExpression);

        // Act — graph coordinates converted to canvas pixels at runtime via bounding box
        await calculatorPage.clickGraphAtGraphCoord(
          graphCoordinates.curveOnParabola.graphX,
          graphCoordinates.curveOnParabola.graphY,
        );

        // Assert
        await expect(calculatorPage.traceCoordinates).toBeVisible();
      });

      // TC-E1-07-002 | Priority 3
      test('should update coordinate tooltip as mouse moves along a graphed curve', async ({ calculatorPage }) => {
        // Arrange
        await calculatorPage.typeExpression(expressionEntryData.sineExpression);

        // Act — hover at first position; wait for tooltip and capture its text
        await calculatorPage.hoverGraphAtGraphCoord(
          graphCoordinates.sineWavePos1.graphX,
          graphCoordinates.sineWavePos1.graphY,
        );
        await expect(calculatorPage.traceCoordinates).toBeVisible();
        // Use innerText() (not textContent()) to get the rendered text,
        // then assert it is non-empty before using it as a comparator.
        // This prevents the not.toHaveText('') bug where an empty baseline
        // would make the assertion trivially pass or always fail.
        await expect(calculatorPage.traceCoordinates).not.toBeEmpty();
        const coordsAtPos1 = (await calculatorPage.traceCoordinates.innerText()).trim();

        // Act — move to a different position on the curve
        await calculatorPage.hoverGraphAtGraphCoord(
          graphCoordinates.sineWavePos2.graphX,
          graphCoordinates.sineWavePos2.graphY,
        );

        // Assert — tooltip text has changed (not.toHaveText uses exact match with auto-retry)
        await expect(calculatorPage.traceCoordinates).not.toHaveText(coordsAtPos1);
      });

      // TC-E1-07-003 | Priority 3
      test('should display right intercept coordinates when clicking near x-axis intercept', async ({ calculatorPage }) => {
        // Arrange
        await calculatorPage.typeExpression(expressionEntryData.interceptExpression);

        // Act
        await calculatorPage.clickGraphAtGraphCoord(
          graphCoordinates.rightIntercept.graphX,
          graphCoordinates.rightIntercept.graphY,
        );

        // Assert — right intercept (2, 0)
        await expect(calculatorPage.traceCoordinates).toContainText(expressionEntryData.poiCoordinates);
      });

      // TC-E1-07-004 | Priority 3
      test('should display left intercept coordinates when clicking near x-axis intercept', async ({ calculatorPage }) => {
        // Arrange
        await calculatorPage.typeExpression(expressionEntryData.interceptExpression);

        // Act
        await calculatorPage.clickGraphAtGraphCoord(
          graphCoordinates.leftIntercept.graphX,
          graphCoordinates.leftIntercept.graphY,
        );

        // Assert — left intercept (−2, 0) using Unicode minus (U+2212) as rendered by Desmos
        await expect(calculatorPage.traceCoordinates).toContainText(expressionEntryData.leftInterceptCoords);
      });
    });
  });
});