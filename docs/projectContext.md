# Desmos Graphing Calculator — LLM Application Context Document

> **Purpose:** This document provides structured context about the Desmos Graphing Calculator web application (`https://www.desmos.com/calculator`) for use by AI/LLM agents performing tasks such as test automation, UI analysis, accessibility auditing, or interaction scripting.

---

## 1. Application Identity

| Property         | Value                                                  |
|------------------|--------------------------------------------------------|
| **Name**         | Desmos Graphing Calculator                             |
| **URL**          | https://www.desmos.com/calculator                      |
| **Owner**        | Desmos Studio PBC                                      |
| **Type**         | Web Application (SPA — Single Page Application)        |
| **Launched**     | 2011                                                   |
| **Cost**         | Free (registration optional)                           |
| **Tech Stack**   | TypeScript, JavaScript, HTML, CSS                      |
| **Math Input**   | MathQuill (open-source library by Desmos)              |
| **Rendering**    | HTML5 Canvas + SVG                                     |
| **Mobile Apps**  | Available on iOS and Android                           |

---

## 2. Application Purpose

Desmos is an advanced graphing calculator implemented as a web application. Its primary purpose is to allow users to:

- Plot mathematical functions, equations, and inequalities interactively
- Visualize algebraic and calculus concepts in real time
- Perform statistical analysis and regression modeling
- Create and share mathematical graphs via permalink
- Support educational use in classrooms, standardized tests, and self-study

It is used globally by students, educators, and mathematicians. A modified version is embedded in standardized tests including the SAT, STAAR, Virginia SOL, and CAASPP. It is also integrated into AP Exams (2025+) where calculators are permitted.

---

## 3. Page Layout & UI Structure

The calculator page is composed of the following major UI regions:

```
┌─────────────────────────────────────────────────────────────┐
│  TOOLBAR (top bar)                                          │
│  [☰ Menu]  [Desmos Logo]  [Undo][Redo]  [Save]  [Share]   │
├───────────────────────┬─────────────────────────────────────┤
│                       │                                     │
│   EXPRESSION LIST     │        GRAPH CANVAS                 │
│   (left panel)        │        (main rendering area)        │
│                       │                                     │
│  - Line 1: input      │   ← SVG / Canvas render area →     │
│  - Line 2: input      │                                     │
│  - Line 3: ...        │         [+] [-] [⌂] zoom controls  │
│                       │                                     │
│  [+ Add Item button]  │                                     │
├───────────────────────┴─────────────────────────────────────┤
│  KEYPAD (optional, toggled on/off)                          │
└─────────────────────────────────────────────────────────────┘
```

### 3.1 Toolbar (Top Bar)

| Element              | Description                                              |
|----------------------|----------------------------------------------------------|
| Hamburger Menu (☰)   | Opens navigation: Examples, Account, Settings, Language  |
| Desmos Logo          | Clickable; links to desmos.com homepage                  |
| Undo button          | Reverts last expression/graph action                     |
| Redo button          | Re-applies reverted action                               |
| Save button          | Saves graph to account (prompts login if not signed in)  |
| Share button         | Opens share dialog with permalink and image export       |

### 3.2 Expression List (Left Panel)

The left panel is the primary input area. It is a scrollable list of **expression lines**, each of which can contain:

| Item Type      | Description                                              |
|----------------|----------------------------------------------------------|
| **Expression** | Mathematical equation, function, inequality, or value    |
| **Table**      | Grid of x/y data values for plotting                     |
| **Note**       | Free-text annotation (non-mathematical)                  |
| **Image**      | Uploaded image placed onto the graph canvas              |
| **Folder**     | Collapsible group for organizing multiple expressions    |

Each expression line has:
- A **color picker** dot (left side) to change graph color
- A **math input field** (powered by MathQuill)
- A **visibility toggle** (eye icon) to show/hide on graph
- A **delete button** (×) on hover
- A **settings icon** for expression-specific options (line style, etc.)

An **"Add Item" (+) button** at the bottom of the list allows inserting new expressions, tables, notes, images, or folders.

### 3.3 Graph Canvas (Main Area)

- Renders using **HTML5 Canvas and SVG**
- Supports pan (click and drag) and zoom (scroll wheel, pinch, or buttons)
- Displays **Points of Interest** (x-intercepts, y-intercepts, intersections, maxima, minima) when a curve is selected
- Shows **coordinate labels** on hover over points of interest
- Axes are labeled and scale dynamically with zoom level

### 3.4 Zoom Controls

Located at the bottom-right of the canvas:

| Control      | Action                              |
|--------------|-------------------------------------|
| `+` button   | Zoom in                             |
| `−` button   | Zoom out                            |
| `⌂` button   | Reset to default view               |

### 3.5 Keypad (Optional)

- Toggled via a button in the bottom-left of the expression panel
- Provides on-screen keys for math symbols, functions, Greek letters, etc.
- Useful for touch devices; can be hidden on desktop

---

## 4. Core Features & Capabilities

### 4.1 Graphing

- **Cartesian:** Standard x/y function plotting (e.g., `y = x^2 + 3`)
- **Polar:** Polar coordinate functions (e.g., `r = cos(θ)`)
- **Parametric:** Parametric equations using a parameter `t`
- **Implicit:** Relations not solved for y (e.g., `x^2 + y^2 = 25`)
- **Inequalities:** Shaded regions for Cartesian and polar inequalities
- **Piecewise functions:** Conditional expressions with domain restrictions
- **Recursive functions:** Functions defined in terms of prior values
- No limit on the number of simultaneous expressions graphed

### 4.2 Sliders

- Automatically created when an undefined variable is used in an expression (e.g., `y = ax + b` creates sliders for `a` and `b`)
- Can be dragged manually or animated (play/pause/loop)
- Used to demonstrate function transformations dynamically

### 4.3 Tables

- Users can create input/output tables manually or generate them from a function
- Table values are plotted as points on the graph canvas
- Columns can be linked to expressions

### 4.4 Statistics & Regression

- Best-fit lines and curves (linear, quadratic, exponential, etc.)
- Uses `~` syntax for regression (e.g., `y1 ~ mx1 + b`)
- Reports regression parameters and R² values

### 4.5 Calculus

- **Derivatives:** `d/dx` notation supported
- **Integrals:** Definite and indefinite integrals; supports integration to ±∞
- **Summation/Series:** Sigma notation supported; series can be iterated to high counts
- **Limits:** Direct limit syntax is currently not supported

### 4.6 Advanced Math Functions

- Trigonometric: `sin`, `cos`, `tan`, `arcsin`, `arccos`, `arctan`, etc.
- Logarithmic: `log`, `ln`
- Statistical: Normal distribution, chi-squared distribution, random functions
- Special: Factorial (`n!`), error function (`erf`), absolute value (`|x|`)
- RGB/HSV color functions for visual artwork use cases

### 4.7 Points of Interest

- When a curve is selected, the calculator automatically identifies and displays:
  - x-intercepts
  - y-intercepts
  - Local maxima and minima
  - Intersections with other plotted curves
- Hovering over a point reveals its coordinates
- Clicking a point pins the label to the canvas
- Points can be exported to the expression list

### 4.8 Audio Trace (Accessibility)

- Converts graph data to sound, allowing exploration through audio
- Pitch varies by y-value (higher = higher pitch)
- Overtone plays when crossing from negative to positive x
- Static occurs when y transitions from positive to negative
- Pop sounds at intersection points

### 4.9 Saving & Sharing

- **Save:** Requires a Desmos account (Google sign-in or email)
- **Open Graph:** Access previously saved graphs from account
- **Share:** Generates a permalink URL for sharing; users can opt in for "Staff Picks"
- **Export:** Download graph as a PNG image
- Pre-loaded with **36 example graphs** for new users

### 4.10 Sound (Tone Feature)

- Added November 2023
- Users can produce tones of a specified frequency and gain directly from graph expressions

---

## 5. Additional Desmos Tools (Same Domain)

| Tool                     | URL                                  |
|--------------------------|--------------------------------------|
| Scientific Calculator    | https://www.desmos.com/scientific    |
| Four Function Calculator | https://www.desmos.com/fourfunction  |
| Matrix Calculator        | https://www.desmos.com/matrix        |
| Geometry Tool            | https://www.desmos.com/geometry      |
| 3D Graphing Calculator   | https://www.desmos.com/3d            |
| Test Mode                | https://www.desmos.com/testing       |

---

## 6. Authentication & User Accounts

| State              | Behavior                                                         |
|--------------------|------------------------------------------------------------------|
| **Not logged in**  | Full graphing available; save/share prompt triggers login        |
| **Logged in**      | Graphs saved to account; saved graphs listed in "Open Graph"     |
| **Login methods**  | Google OAuth, email/password                                     |
| **Teacher account**| Access to classroom activity builder; real-time student view     |

---

## 7. Keyboard Shortcuts

| Shortcut              | Action                                      |
|-----------------------|---------------------------------------------|
| `Ctrl + Z`            | Undo                                        |
| `Ctrl + Y`            | Redo                                        |
| `Enter`               | Add new expression line below current       |
| `Arrow keys`          | Navigate graph when canvas is focused       |
| `Ctrl + S`            | Save graph                                  |
| `Backspace / Delete`  | Delete character in expression              |

---

## 8. Automation Testing Context

> This section is specifically intended to guide LLM agents generating, planning, or executing automated tests against the Desmos Graphing Calculator.

### 8.1 Application Type & Rendering Behavior

- **SPA (Single Page Application):** No full page reloads between interactions. DOM updates are asynchronous.
- **Math Input Layer:** The expression list uses **MathQuill**, a custom rich-text math editor. Standard `type()` or `sendKeys()` may not produce correct results — special key sequences or JavaScript injection may be required.
- **Canvas Rendering:** The graph is rendered on an HTML5 Canvas. Direct DOM assertions on graph output are not possible. Visual regression testing (screenshot comparison) or proxy assertions (checking expression state, DOM labels) are required.
- **Dynamic Elements:** Sliders, tables, and points of interest appear and disappear dynamically based on expression state.

### 8.2 Primary Test Areas

| Area                    | What to Test                                                                 |
|-------------------------|------------------------------------------------------------------------------|
| Expression Input        | Typing equations, symbols, functions into expression lines                   |
| Graph Rendering         | Verify curves/points appear after input (visual or DOM check)                |
| Slider Behavior         | Slider creation from undefined variables; drag interaction; animation        |
| Table Input             | Add table, enter values, verify points plotted on canvas                     |
| Points of Interest      | Select curve → hover/click POI labels → verify coordinates                   |
| Zoom & Pan              | Button zoom, scroll zoom, drag pan, reset to home                            |
| Undo / Redo             | Keyboard shortcut and toolbar button                                         |
| Keypad Toggle           | Show/hide keypad; keypad key input into expression                           |
| Save Flow               | Save while logged out (auth prompt); save while logged in                    |
| Share Flow              | Open share dialog; copy link; export image                                   |
| Expression Visibility   | Toggle eye icon; verify graph updates                                        |
| Expression Deletion     | Delete expression; verify graph updates                                      |
| Color Picker            | Change expression color; verify canvas updates                               |
| Folder Collapse         | Add folder; collapse/expand; verify child expression visibility              |
| Audio Trace             | Enable audio trace; verify sound triggers (accessibility)                    |
| Responsive Layout       | Verify layout on mobile viewport sizes                                       |

### 8.3 Known Automation Challenges

| Challenge                          | Detail & Mitigation                                                                 |
|------------------------------------|-------------------------------------------------------------------------------------|
| **MathQuill input**                | Not a native `<input>` — requires `.click()` then key-by-key typing or JS injection |
| **Canvas assertions**              | Cannot assert graph shape via DOM; use screenshot diff or check POI label DOM nodes |
| **Async rendering**                | Graph updates after expression change are asynchronous; use `waitFor` / polling     |
| **Slider drag**                    | Requires pointer events (mousedown → mousemove → mouseup sequence)                  |
| **Auth dependency**                | Save/share tests require mocked or real auth; isolate these from unauthenticated tests |
| **Dynamic element IDs**            | Desmos may not expose stable test IDs; prefer attribute or aria-label selectors     |
| **Animation states**               | Animated sliders and graph transitions must be awaited or paused before assertions  |
| **Cross-browser canvas rendering** | Canvas pixel output may differ slightly across browsers; use tolerant diff thresholds |

### 8.4 Recommended Selector Strategies

```
Expression lines:     .dcg-expressionlist .dcg-expressionitem
Math input field:     .dcg-mq-editable-field (MathQuill)
Add item button:      [aria-label="Add Item"]
Graph canvas:         .dcg-graph-outer canvas  (or SVG layer)
Zoom in button:       [aria-label="Zoom In"]
Zoom out button:      [aria-label="Zoom Out"]
Home/reset button:    [aria-label="Reset to Default View"]
Save button:          [aria-label="Save"]  /  button containing "Save"
Share button:         [aria-label="Share Graph"]
Keypad toggle:        [aria-label="Open Keypad"] / [aria-label="Close Keypad"]
Slider play button:   .dcg-slider-play-btn
Eye toggle (visible): .dcg-expression-icon-hidden / .dcg-expression-icon-visible
```

> ⚠️ **Note for LLM agents:** Always inspect live DOM before hardcoding selectors. Desmos may update class names or structure. Prefer `aria-label` and role-based selectors for stability.

### 8.5 Suggested Test Framework Stack

| Layer                  | Recommended Tool                          |
|------------------------|-------------------------------------------|
| E2E Testing            | Playwright (preferred) or Cypress         |
| Visual Regression      | Playwright Screenshots + pixelmatch       |
| Unit / API Testing     | Jest + Desmos API (if applicable)         |
| Accessibility Testing  | axe-core + Playwright                     |
| CI Integration         | GitHub Actions / GitLab CI                |

---

## 9. Accessibility Features

- Screen reader support (ARIA labels throughout)
- Audio Trace for graph exploration via sound
- Refreshable Braille display compatibility
- Keyboard-navigable expression list and toolbar
- MathQuill supports reading and editing math via assistive tech

---

## 10. Localization

- Available in multiple languages
- Language can be changed via the hamburger menu → Settings
- Math syntax remains consistent across locales

---

## 11. API Access

Desmos exposes a **JavaScript Embed API** (v1.0) allowing developers to embed the calculator in external web pages and programmatically control expressions, graph state, and events.

- API Docs: https://www.desmos.com/api/v1.0/docs/index.html
- Useful for integration testing or controlling the calculator state in test environments

---

## 12. Related Integrations & Use Cases

| Context                  | Detail                                                              |
|--------------------------|---------------------------------------------------------------------|
| SAT / Standardized Tests | Embedded Desmos calculator (restricted feature set)                 |
| AP Exams (2025+)         | Available in all calculator-permitted exams except AP Statistics    |
| Amplify (curriculum)     | Desmos curriculum acquired by Amplify in 2022                       |
| AssessPrep               | Desmos embedded for IB Curriculum examinations                      |
| Teacher.desmos.com       | Classroom activity builder (now part of Amplify)                    |

---

*Document Version: 1.0 | Generated for LLM/AI automation context | Source: desmos.com, Wikipedia, Desmos Help Center*
