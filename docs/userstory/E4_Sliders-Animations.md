---
US-E4-01 · Automatically prompt slider creation for undefined variables
---
Feature: Sliders and Animations

  Background:
    Given the user has opened [calculator]

  # Happy path
  Scenario: Slider prompt appears when an undefined variable is used
    When the user types "y=mx+b" in an expression line
    Then an "Add Slider" prompt appears for both variables "m" and "b"
    When the user clicks "Add Slider"
    Then sliders for "m" and "b" are added as new items in the expression list
    And the graph updates to reflect the default slider values

  # Single variable
  Scenario: Slider prompt for a single undefined variable
    When the user types "y=ax^2" in an expression line
    Then an "Add Slider" prompt appears for the variable "a"

  # Already-defined variable
  Scenario: No slider prompt when a variable is already defined
    Given the user has defined "a=3" in a prior expression line
    When the user types "y=ax^2" in a new expression line
    Then no slider prompt appears
    And the graph uses the value "a=3"

---
US-E4-02 · Manually set slider limits and step interval
---
# Happy path — limits
  Scenario: Set custom minimum and maximum limits for a slider
    Given a slider for variable "a" exists with default limits
    When the user clicks on the left endpoint of the slider bar
    And types "-5"
    And clicks on the right endpoint and types "5"
    Then the slider range is updated to [-5, 5]
    And the graph updates to reflect the constrained value

  # Happy path — step
  Scenario: Set a custom step interval for a slider
    Given a slider for variable "a" exists
    When the user opens the slider's Animation Properties
    And sets the step to "0.5"
    Then moving the slider changes the variable value in increments of 0.5

  # Edge case — min greater than max in slider
  Scenario: Setting slider min greater than max shows an error
    Given a slider for variable "a" exists
    When the user sets the left endpoint to "10" and the right endpoint to "1"
    Then an inline error or warning is displayed
    And the slider range is not updated

  # Edge case — non-numeric step
  Scenario: Non-numeric step value is rejected
    When the user enters "abc" as the slider step value
    Then the field reverts to the previous valid value or displays a validation error

---
US-E4-03 · Drag a slider to change its value
---
# Happy path
  Scenario: Dragging the slider updates the graph dynamically
    Given a slider for variable "m" exists with range [-5, 5] and current value 1
    And the expression "y=mx" is graphed
    When the user drags the slider thumb to approximately the midpoint of range
    Then the graph updates in real time as the slider is dragged
    And the displayed value of "m" changes accordingly

  # Keyboard navigation — arrow keys
  Scenario: Arrow keys adjust slider value incrementally
    Given the slider for variable "m" is focused via Tab
    When the user presses the "Right Arrow" key
    Then the value of "m" increases by the defined step
    And the graph updates accordingly
    When the user presses the "Left Arrow" key
    Then the value of "m" decreases by the defined step

  # Edge case — slider at boundary
  Scenario: Dragging slider beyond maximum stops at maximum value
    Given the slider for "m" has a maximum of 5 and current value is 5
    When the user drags the slider thumb further to the right
    Then the value remains at 5
    And the slider thumb does not move beyond the right boundary

---
US-E4-04 · Animate a slider with the Play button
---
# Happy path
  Scenario: Play button starts automatic animation of slider
    Given a slider for variable "a" exists
    When the user clicks "Play" on the slider
    Then the slider value changes automatically over time
    And the graph updates continuously to reflect each value
    And the Play button changes to a Pause button

  # Stop animation
  Scenario: Clicking Pause stops the animation
    Given the slider is currently animating
    When the user clicks "Pause"
    Then the slider stops at its current value
    And the graph remains fixed at that value

  # Edge case — play at boundary
  Scenario: Animation reverses or repeats at boundary based on animation properties
    Given the animation is set to "loop forward and backward"
    And the slider value reaches the maximum
    Then the animation reverses direction automatically
    And the slider value begins decreasing

---
US-E4-05 · Configure animation properties
---
# Happy path — direction
  Scenario: Set animation to loop forward and backward
    Given a slider for variable "a" is animating
    When the user clicks "Animation Properties" or presses "Ctrl+Shift+O"
    And selects "Loop forward and backward"
    Then the animation bounces between the minimum and maximum values

  # Happy path — speed
  Scenario: Increase animation speed
    Given the Animation Properties menu is open
    When the user increases the speed setting
    Then the slider animates faster and the graph updates at an increased rate

  # Happy path — play once
  Scenario: Set animation to play once and stop
    Given the Animation Properties menu is open
    When the user selects "Play once"
    And starts the animation
    Then the slider animates from minimum to maximum once and stops
    And the Play button returns to its initial state