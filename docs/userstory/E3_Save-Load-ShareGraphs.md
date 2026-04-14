---
US-E3-01 · Save a graph when logged in
---
Feature: Save, Load and Share Graphs

  Background:
    Given the user is logged into a valid Desmos account
    And the user has opened [calculator]

  # Happy path
  Scenario: Save button becomes active after a change and saves successfully
    Given the user has typed "y=x^2" in the expression list
    When the Save button turns blue (indicating unsaved changes)
    And the user clicks "Save"
    Then the graph is saved to the user's account
    And the Save button returns to its inactive (non-blue) state
    And no error message is displayed

  # Keyboard shortcut
  Scenario: Save a graph using Ctrl+S
    Given there are unsaved changes to the graph
    When the user presses "Ctrl+S"
    Then the graph is saved
    And the Save button returns to its inactive state

  # Edge case — saving with no changes
  Scenario: Save button is inactive when there are no unsaved changes
    Given the graph has just been saved
    Then the Save button is not blue (inactive)
    And pressing "Ctrl+S" produces no save action or notification of "already saved"

---
US-E3-02 · Prompted to log in when saving while signed out
---
# Happy path
  Scenario: Guest user is prompted to log in when pressing Save
    Given the user is not logged in
    And the user has typed "y=x^2" in the expression list
    When the user clicks "Save" or presses "Ctrl+S"
    Then a login/sign-up prompt is displayed
    And the prompt contains options to log in or create an account
    And the current expression list content is preserved in the session

  # Accessibility
  Scenario: Login prompt is accessible via keyboard
    Given the login prompt is displayed
    Then all interactive elements within the prompt are reachable by Tab
    And the prompt has an accessible heading announced by screen reader
    And pressing Escape closes the prompt without data loss

---
US-E3-03 · Open a previously saved graph
---
# Happy path — mouse
  Scenario: Open a saved graph by clicking its thumbnail
    Given the user clicks "Open Graph" or presses "Ctrl+O"
    Then the saved graph panel opens showing graph thumbnails
    When the user clicks on a graph thumbnail
    Then that graph is loaded into the expression list and [graph]

  # Happy path — keyboard
  Scenario: Open a saved graph using keyboard navigation
    Given the saved graph panel is open
    When the user presses the Arrow keys to highlight a graph thumbnail
    And presses "Enter"
    Then that graph is loaded into the expression list and [graph]

  # Edge case — no saved graphs
  Scenario: Empty state is shown when the user has no saved graphs
    Given the user has no previously saved graphs
    When the user opens the saved graph panel
    Then an empty state message is displayed (e.g., "No saved graphs yet")
    And no thumbnails are shown

---
US-E3-04 · Share a snapshot link
---
# Happy path
  Scenario: Generate and copy a snapshot share link
    Given the expression list contains "y=x^2"
    When the user clicks "Share Graph" or presses "Ctrl+Alt+S"
    Then the Share panel opens
    When the user selects "Share a Snapshot"
    Then a unique URL is generated and displayed
    And the URL can be copied to the clipboard

  # Snapshot is immutable
  Scenario: Snapshot link reflects graph state at time of sharing, not future edits
    Given a snapshot link has been generated for graph state A
    When the user makes changes to the expression list (state B) and saves
    And the snapshot link is opened in a new browser tab
    Then the graph in the new tab reflects state A, not state B

  # Edge case — sharing an empty graph
  Scenario: Sharing an empty expression list generates a valid but empty snapshot
    Given the expression list has no expressions
    When the user generates a snapshot link
    Then the link is generated successfully
    And opening the link shows an empty expression list and blank graph

---
US-E3-05 · Share a live-updating link
---
# Happy path
  Scenario: Generate a live-updating share link
    Given the expression list contains "y=x^2"
    When the user opens the Share panel and selects "Save and Share This Graph"
    Then the graph is saved
    And a unique live-update URL is generated and displayed

  # Live link reflects saved changes
  Scenario: Live link reflects the most recently saved version
    Given a live-update link has been generated for the graph
    When the user adds "y=x+1" to the expression list and saves
    And the live-update link is opened in a new browser tab
    Then the new tab displays both "y=x²" and "y=x+1"

  # Edge case — unsaved changes not reflected
  Scenario: Unsaved changes are not reflected in the live link
    Given a live-update link exists and the graph has been saved
    When the user adds "y=2x" but does NOT save
    And the live-update link is opened in a new browser tab
    Then the new tab does NOT display "y=2x"