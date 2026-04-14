---
US-E1-01 · Type and graph a function
---
Feature: Expression Entry and Graph Rendering

  Background:
    Given the user has opened [calculator]
    And the expression list contains one empty expression line

  # Happy path
  Scenario: Graph a basic function by typing in the expression line
    When the user clicks on the first expression line
    And types "y=x^2"
    Then a parabola is rendered on [graph]
    And the expression line displays "y=x²" in formatted notation
    And the graph updates within 2 seconds

  # Implicit function
  Scenario: Graph a function without explicit "y=" prefix
    When the user types "sin(x)" in the first expression line
    Then a sine wave is rendered on [graph]

  # Constants and numbers
  Scenario: Evaluate and display a numeric expression
    When the user types "2+2" in the first expression line
    Then the expression line displays the result "4" below the input
    And no curve is drawn on [graph]

  # Invalid expression — validation
  Scenario: Display an error for a malformed expression
    When the user types "y=x^^2" in the first expression line
    Then an inline error indicator is displayed on that expression line
    And no curve is drawn on [graph]
    And the error indicator is announced by a screen reader as an error message

  # Empty expression — edge case
  Scenario: No graph is rendered for an empty expression line
    When the expression line is left empty
    Then no curve is drawn on [graph]
    And no error indicator is shown

---
US-E1-02 · Edit an existing expression
---
# Happy path
  Scenario: Edit an existing expression and see the graph update
    Given the expression line contains "y=x^2"
    And a parabola is currently rendered on [graph]
    When the user clicks on the expression line
    And changes the expression to "y=x^3"
    Then the parabola is replaced by a cubic curve on [graph]
    And the graph updates within 2 seconds

  # Edge case — delete all content
  Scenario: Clearing an expression removes its graph
    Given the expression line contains "y=x^2"
    When the user selects all text in the expression line and deletes it
    Then the parabola is removed from [graph]
    And the expression line is blank with no error shown

---
US-E1-03 · Add a new blank expression line
---
# Happy path — Enter key
  Scenario: Add a new expression line by pressing Enter
    Given the first expression line is focused
    When the user presses "Enter"
    Then a new blank expression line is added below the current one
    And keyboard focus moves to the new expression line

  # Happy path — keyboard shortcut
  Scenario: Add a new expression line using Ctrl+Alt+X shortcut
    When the user presses "Ctrl+Alt+X"
    Then a new blank expression line is added to the expression list
    And keyboard focus is placed in the new expression line

  # Happy path — Add Item button
  Scenario: Add an expression via the Add Item button
    When the user clicks the "Add Item" button
    And selects "Expression"
    Then a new blank expression line appears in the expression list

  # Accessibility
  Scenario: New expression line is announced by screen reader
    When the user presses "Enter" from an existing expression line
    Then the screen reader announces that a new expression line has been added
    And focus is placed on the new expression line

---
US-E1-04 · Hide or show a graphed item
---
# Happy path — hide
  Scenario: Hide a graphed item by clicking the Color Icon
    Given the expression list contains "y=x^2" and a parabola is visible on [graph]
    When the user clicks the Color Icon for that expression line
    Then the parabola is hidden from [graph]
    And the Color Icon reflects the hidden state (e.g., appears greyed out or with a strikethrough)

  # Happy path — show
  Scenario: Show a previously hidden item
    Given the expression "y=x^2" is hidden
    When the user clicks the Color Icon for that expression line again
    Then the parabola becomes visible on [graph]

  # Keyboard — hide
  Scenario: Hide a graphed item using keyboard shortcut Ctrl+Shift+O then Enter
    Given the expression line "y=x^2" is focused
    When the user presses "Ctrl+Shift+O" and then "Enter"
    Then the parabola is hidden from [graph]

  # Accessibility
  Scenario: Screen reader announces item visibility toggle
    Given the expression line is focused
    When the user triggers the hide action via keyboard
    Then the screen reader announces whether the item is now hidden or visible

---
US-E1-05 · Style a graphed item
---
# Happy path — open style menu
  Scenario: Open the Style menu by clicking and holding the Color Icon
    Given an expression line with a graphed function exists
    When the user clicks and holds the Color Icon for that expression line
    Then the Style menu opens
    And options for colour and size are presented

  # Happy path — change colour
  Scenario: Change the colour of a graphed function
    Given the Style menu is open for an expression line
    When the user selects a different colour (e.g., red)
    Then the curve on [graph] is redrawn in red
    And the Color Icon reflects the newly selected colour

  # Keyboard — open style menu
  Scenario: Open the Style menu using keyboard shortcut
    Given the expression line is focused
    When the user presses "Ctrl+Shift+O"
    Then the Style menu opens and is keyboard-navigable
    And the first option in the menu receives focus

---
US-E1-07 · Trace points of interest on a graph
---
# Happy path — mouse click
  Scenario: Trace a point on a curve by clicking it
    Given the expression "y=x^2" is graphed
    When the user clicks on a point on the parabola
    Then a coordinate tooltip is displayed showing the x and y values at that point

  # Happy path — trace along curve
  Scenario: Trace along a curve using the mouse
    Given the expression "y=sin(x)" is graphed
    When the user moves the mouse cursor along the sine curve
    Then the coordinate tooltip updates continuously to reflect the current position


  # Edge case — special points
  Scenario: Identify and display an intersection or extremum
    Given "y=x^2-4" is graphed
    When the user clicks near the x-axis intercepts
    Then the tooltip displays the exact intercept coordinates (e.g., (2, 0) and (-2, 0))