---
US-E2-01 · Open Graph Settings menu
---
Feature: Graph Settings and Viewport Control

  Background:
    Given the user has opened [calculator]

  # Happy path — icon click
  Scenario: Open Graph Settings by clicking the settings icon
    When the user clicks the "Graph Settings" icon
    Then the Graph Settings menu opens
    And options for domain, range, grid, angle unit, and Complex Mode are visible

  # Happy path — keyboard shortcut
  Scenario: Open Graph Settings using Ctrl+Alt+G
    When the user presses "Ctrl+Alt+G"
    Then the Graph Settings menu opens

  # Accessibility
  Scenario: Graph Settings menu is accessible via keyboard navigation
    When the Graph Settings menu is open
    Then each setting field is reachable using Tab and Shift+Tab
    And each control has an accessible label readable by a screen reader

---
US-E2-02 · Set a custom domain and range
---
# Happy path
  Scenario: Set a custom x-axis minimum and maximum
    Given the Graph Settings menu is open
    When the user sets the x-axis minimum to "-10" and maximum to "10"
    And closes the Graph Settings menu
    Then [graph] displays x-axis values from -10 to 10

  # Edge case — min equals max
  Scenario: Entering equal min and max values shows a validation error
    Given the Graph Settings menu is open
    When the user sets the x-axis minimum to "5" and maximum to "5"
    Then an inline error or warning is displayed indicating that min and max must differ
    And the viewport is not updated

  # Edge case — non-numeric input
  Scenario: Non-numeric value in domain field is rejected
    Given the Graph Settings menu is open
    When the user types "abc" in the x-axis minimum field
    Then the field reverts to the previous numeric value or displays a validation error
    And the viewport is not updated

  # Edge case — min greater than max
  Scenario: Min value greater than max value shows an error
    Given the Graph Settings menu is open
    When the user sets x-axis minimum to "10" and maximum to "-10"
    Then an inline error is displayed
    And the viewport is not updated

---
US-E2-04 · Switch between radians and degrees
---
# Happy path — radians to degrees
  Scenario: Switch angle unit from radians to degrees and verify graph change
    Given the expression "y=sin(x)" is graphed
    And the angle unit is set to radians
    When the user opens Graph Settings
    And switches the angle unit to degrees
    And closes Graph Settings
    Then the sine curve on [graph] reflects a period of 360 (degrees-based)

  # Happy path — degrees back to radians
  Scenario: Switch angle unit from degrees back to radians
    Given the angle unit is set to degrees
    When the user opens Graph Settings and switches the angle unit to radians
    Then the sine curve reflects a period of 2π (radians-based)

  # Edge case — no trigonometric expression present
  Scenario: Switching angle unit with no trig expression shows no visible change
    Given no trigonometric expressions are in the expression list
    When the user switches the angle unit in Graph Settings
    Then no error occurs and the graph canvas remains unchanged

---
US-E2-05 · Enable Complex Mode
---
# Happy path
  Scenario: Enable Complex Mode from Graph Settings
    Given the Graph Settings menu is open
    When the user toggles Complex Mode on
    And closes Graph Settings
    Then the calculator enters Complex Mode
    And the Graph Settings menu shows angles displayed in radians only
    And complex number expressions can be entered in the expression list

  # Toggle off
  Scenario: Disable Complex Mode removes complex-specific rendering
    Given Complex Mode is enabled
    And a complex number "3+4i" is plotted as a point
    When the user opens Graph Settings and toggles Complex Mode off
    Then the complex number point is removed from [graph]
    And the expression line shows an error or is cleared