# Desmos API v1.11

Desmos is the dead-simple way to embed rich, interactive math into your web page or web app. Here's how to draw an interactive graph in less than 60 seconds:

**Step 1:** Include the secure JavaScript file:

```html
<script src="https://www.desmos.com/api/v1.11/calculator.js?apiKey=[YOUR_API_KEY_HERE]"></script>
```

To obtain your own API key, visit [desmos.com/my-api](https://desmos.com/my-api).

**Step 2:** Add an element to the page:

```html
<div id="calculator" style="width: 600px; height: 400px;"></div>
```

**Step 3:** Add the following JavaScript:

```html
<script>
  var elt = document.getElementById('calculator');
  var calculator = Desmos.GraphingCalculator(elt);
</script>
```

See `examples/parabola.html` to see this example live.

> To see information about the size of the API file, the change log contains the gzipped size for each version.

This page explains how to use the API for the **Graphing Calculator** and **Basic Calculators**. To embed the Geometry or 3D Calculators, visit the Geometry API Docs and 3D API Docs.

---

## Graphing Calculator

The basic structure of the API is an embeddable `GraphingCalculator`, which is the page element which will display your axes, grid-lines, equations, and points.

---

### Constructor

#### `constructor GraphingCalculator(element, [options])`

Creates a calculator object to control the calculator embedded in the DOM element specified by `element`.

**Example:**

```js
var elt = document.getElementById('my-calculator');
var calculator = Desmos.GraphingCalculator(elt);
```

The object returned is a `Desmos.GraphingCalculator` object, which exposes methods for setting expressions, changing the viewport, etc.

`options` is an optional object that specifies features that should be included or excluded.

#### Configuration Options

| Option | Default | Description |
|--------|---------|-------------|
| `graphpaper` | `true` | Show the graphpaper |
| `expressions` | `true` | Show the expressions list |
| `settingsMenu` | `true` | Show the settings wrench, for changing graph display. See Accessibility Notes. |
| `zoomButtons` | `true` | Show onscreen zoom buttons |
| `keypad` | `true` | Show the onscreen keypad |
| `keypadActivated` | `false` | When `false`, the keypad will start out minimized, and the user needs to manually open it. When `true`, the onscreen keypad will be opened anytime focus is in a math input. Note: this option is ignored if we detect that the user is on a touch device. In that case, the keypad is always activated. |
| `allowKeypadToBeDismissedWhenNarrow` | `false` | API v1.11 only: when `true`, display a control allowing the onscreen keypad to be minimized when the calculator is narrow enough that the graphpaper is stacked above the expression list. This control is not displayed on touch screen devices where the onscreen keypad is necessary for editing. In future versions of the API, this behavior will be enabled unconditionally and the option will be removed. |
| `showResetButtonOnGraphpaper` | `false` | If a default state is set, show an onscreen reset button |
| `expressionsTopbar` | `true` | Show the bar on top of the expressions list |
| `pointsOfInterest` | `true` | Show Points of Interest (POIs) as gray dots that can be clicked on |
| `trace` | `true` | Allow tracing curves to inspect coordinates, and showing point coordinates when clicked |
| `border` | `true` | Add a subtle 1px gray border around the entire calculator |
| `lockViewport` | `false` | Disable user panning and zooming graphpaper |
| `expressionsCollapsed` | `false` | Collapse the expressions list |
| `capExpressionSize` | `false` | Limit the size of an expression to 500 LaTeX tokens and a maximum nesting depth of 30 |
| `authorFeatures` | `false` | Enable features intended for content authoring. See the section on Author Features. |
| `images` | `true` | Allow adding images |
| `imageUploadCallback` | `Desmos.imageFileToDataURL` | Specify custom processing for user-uploaded images. See Image Uploads for more details. |
| `folders` | `true` | Allow the creation of folders in the expressions list |
| `notes` | `true` | Allow the creation of text notes in the expressions list |
| `sliders` | `true` | Allow the creation of sliders in the expressions list |
| `actions` | `'auto'` | Allow the use of Actions. May be `true`, `false`, or `'auto'`. When `true` or `false`, actions are completely enabled or disabled. When `'auto'`, actions are enabled, but some associated UI is only displayed after the user enters a valid action. In a future API version, `'auto'` may become a synonym for `true`. |
| `substitutions` | `true` | Allow the use of "with" substitutions and list comprehensions |
| `links` | `true` | Allow hyperlinks in notes/folders, and links to help documentation in the expressions list (e.g. regressions with negative R² values or plots with unresolved detail) |
| `qwertyKeyboard` | `true` | Display the keypad in QWERTY layout (`false` shows an alphabetical layout) |
| `distributions` | `true` | Enable/disable functions related to univariate data visualizations, statistical distributions, and hypothesis testing |
| `restrictedFunctions` | `false` | Show a restricted menu of available functions |
| `forceEnableGeometryFunctions` | `false` | Force distance and midpoint functions to be enabled, even if `restrictedFunctions` is set to `true`. In that case the geometry functions will also be added to the "Misc" keypad. |
| `enableRepeatFunction` | `false` | API v1.11 only: when `true`, enable the repeat function. In future API versions, this option will be removed and the repeat function will be available unconditionally. |
| `pasteGraphLink` | `false` | Paste a valid Desmos graph URL to import that graph |
| `pasteTableData` | `true` | Paste validly formatted table data to create a table up to 50 rows |
| `clearIntoDegreeMode` | `false` | When `true`, clearing the graph through the UI or calling `setBlank()` will leave the calculator in `degreeMode`. Note that, if a default state is set, resetting the graph through the UI will result in the calculator's `degreeMode` matching the mode of that state, regardless of this option. |
| `colors` | Colors | The color palette that the calculator will cycle through. See the Colors section. |
| `autosize` | `true` | Determine whether the calculator should automatically resize whenever there are changes to element's dimensions. If set to `false` you will need to explicitly call `.resize()` in certain situations. See `.resize()`. |
| `plotInequalities` | `true` | Determine whether the calculator should plot inequalities |
| `plotImplicits` | `true` | Determine whether the calculator should plot implicit equations and inequalities |
| `plotSingleVariableImplicitEquations` | `true` | Determine whether the calculator should plot single-variable implicit equations |
| `projectorMode` | `false` | When `true`, fonts and line thicknesses are increased to aid legibility. |
| `decimalToFraction` | `true` | When `true`, users are able to toggle between decimal and fraction output in evaluations if Desmos detects a good rational approximation. |
| `fontSize` | `16` | Base font size. |
| `invertedColors` | `false` | Display the calculator with an inverted color scheme. |
| `language` | `'en'` | Language. See the Languages section for more information. |
| `brailleMode` | `'none'` | Set the input and output Braille code for persons using refreshable Braille displays. Valid options are `'nemeth'`, `'ueb'`, or `'none'`. |
| `sixKeyInput` | `false` | Allow users to write six-dot Braille characters using the Home Row keys (S, D, F, J, K, and L). Requires that `brailleMode` be `'nemeth'` or `'ueb'`. |
| `brailleControls` | `true` | Show Braille controls in the settings menu and enable shortcut keys for switching between Braille modes. See Accessibility Notes. |
| `audio` | `true` | Permit the calculator to generate sound, including using the tone method and in Audio Trace. See Accessibility Notes. |
| `graphDescription` | `undefined` | Manually set a description for the graph canvas (which replaces the automatically generated text we create). Set to an empty string to remove the description entirely, or `undefined` to restore the generated text. See Accessibility Notes. |
| `zoomFit` | `true` | When `true`, tables and distributions will display an icon that allows the user to automatically snap the viewport to appropriate bounds for viewing that expression. |
| `forceLogModeRegressions` | `false` | When `true`, all linearizable regression models will have log mode enabled by default, and the checkbox used to toggle log mode will be hidden from the expression interface. |
| `defaultLogModeRegressions` | `false` | When `true`, all linearizable regression models will have log mode enabled by default, but, unlike `forceLogModeRegressions`, the checkbox used to toggle log mode will be visible from the expression interface. |
| `customRegressions` | `true` | When `true`, users can create arbitrary regression models using expression syntax. |
| `regressionTemplates` | `true` | When `true`, users can create regressions from a fixed menu of model options from the table column interface. |
| `logScales` | `true` | When `true`, the option to use logarithmic axis scales is enabled. |
| `tone` | `true` | When `true`, the tone command is enabled. |
| `intervalComprehensions` | `true` | When `true`, the syntax for interval comprehensions is enabled. |
| `muted` | `true` | Globally mute or unmute sound generated by the calculator's built-in `tone()` function. See the section on tones below. |
| `allowComplex` | `true` | Enable the "Complex Mode" toggle in the Settings Menu. See section on complex numbers. |
| `reportPosition` | `'default'` | Specify how the calculator reports object positions to screen readers. Valid options are `'coordinates'`, `'percents'`, or `'default'`. If set to `'default'`, objects will be reported in terms of X and Y coordinates if either X or Y axis is visible. If both axes are hidden, positions are reported as percentages from the viewport's top and left edges. |
| `showEvaluationCopyButtons` | `false` | When `true`, show a button next to expression evaluations that copies the evaluation LaTeX to the system clipboard. Optionally, it is possible to define a callback that provides custom copy logic, e.g., for an application that manages its own clipboard. See the `onEvaluationCopyClick` entry below. |
| `onEvaluationCopyClick` | Copy to system clipboard | A function `(string) -> void` that will be invoked when the user clicks an expression evaluation's copy button with the evaluation LaTeX as its argument. The default implementation copies to the system clipboard. |
| `recursion` | `true` | When `true`, allow the use of recursive functions. |

In addition to the above configuration options, you may also pass in any of the graph settings below as part of the options object. The distinction between configuration options and graph settings is that configuration options are properties related to the particular calculator instance, while graph settings are properties related to the graph state itself.

Configuration options do not appear in a serialized graph state, but graph settings do. Therefore configuration options will persist through a `setState()` or a `setBlank()` call, but graph settings will be overwritten whenever a new (possibly blank) state is set.

#### Graph Settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `degreeMode` | Boolean | `false` | When `true`, trig functions assume arguments are in degrees. Otherwise, arguments are assumed to be in radians. |
| `showGrid` | Boolean | `true` | Show or hide grid lines on the graph paper. |
| `polarMode` | Boolean | `false` | When `true`, use a polar grid. Otherwise, use cartesian grid. |
| `showXAxis` | Boolean | `true` | Show or hide the x axis. |
| `showYAxis` | Boolean | `true` | Show or hide the y axis. |
| `xAxisNumbers` | Boolean | `true` | Show or hide numeric tick labels on the x axis. |
| `yAxisNumbers` | Boolean | `true` | Show or hide numeric tick labels on the y axis. |
| `polarNumbers` | Boolean | `true` | Show or hide numeric tick labels at successive angles. Only relevant when `polarMode` is `true`. |
| `xAxisStep` | Number | `0` | Spacing between numeric ticks on the x axis. Will be ignored if set too small to display. When set to `0`, tick spacing is chosen automatically. |
| `yAxisStep` | Number | `0` | Spacing between numeric ticks on the y axis. Will be ignored if set too small to display. When set to `0`, tick spacing is chosen automatically. |
| `xAxisMinorSubdivisions` | Number | `0` | Subdivisions between ticks on the x axis. Must be an integer between 0 and 5. `1` means that only the major grid lines will be shown. When set to `0`, subdivisions are chosen automatically. |
| `yAxisMinorSubdivisions` | Number | `0` | Subdivisions between ticks on the y axis. Must be an integer between 0 and 5. `1` means that only the major grid lines will be shown. When set to `0`, subdivisions are chosen automatically. |
| `xAxisArrowMode` | AxisArrowMode | `NONE` | Determines whether to place arrows at one or both ends of the x axis. See Axis Arrow Modes. |
| `yAxisArrowMode` | AxisArrowMode | `NONE` | Determines whether to place arrows at one or both ends of the y axis. See Axis Arrow Modes. |
| `xAxisLabel` | String | `''` | Label placed below the x axis. |
| `yAxisLabel` | String | `''` | Label placed beside the y axis. |
| `xAxisScale` | `'linear'` or `'logarithmic'` | `'linear'` | Scale of the x axis. |
| `yAxisScale` | `'linear'` or `'logarithmic'` | `'linear'` | Scale of the y axis. |
| `randomSeed` | String | `''` | Global random seed used for generating values from the calculator's built-in `random()` function. See the section on random seeds below. |

---

### Destructor

#### `GraphingCalculator.destroy()`

Destroy the `GraphingCalculator` instance, unbind event listeners, and free resources. This method should be called whenever a calculator's container element is removed from the DOM. Attempting to call methods on a `GraphingCalculator` object after it has been destroyed will result in a no-op and log a warning to the console.

---

### Saving and Loading

#### `GraphingCalculator.getState()`

Returns a JavaScript object representing the current state of the calculator. Use in conjunction with `GraphingCalculator.setState` to save and restore calculator states.

The return value of `GraphingCalculator.getState` may be serialized to a string using `JSON.stringify`.

> **Warning:** Calculator states should be treated as opaque values. Manipulating states directly may produce a result that cannot be loaded by `GraphingCalculator.setState`.

#### `GraphingCalculator.setState(obj, [options])`

Reset the calculator to a state previously saved using `GraphingCalculator.getState`. `options` is an optional object that controls the behavior of the calculator when setting the state.

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `allowUndo` | Boolean | `false` | Preserve the undo/redo history. |
| `remapColors` | Boolean | `false` | Remap colors in the saved state to those in the current `Calculator.colors` object. See the Colors section. |

#### `GraphingCalculator.setBlank([options])`

Reset the calculator to a blank state. If an options object is present, the `allowUndo` property serves the same function as it does in `GraphingCalculator.setState`.

**Examples:**

```js
// Save the current state of a calculator instance
var state = calculator.getState();

// Use jQuery to post a state to your server for permanent storage
$.post('/myendpoint', JSON.stringify(state));

// Load a state into a calculator instance
calculator.setState(state);

// Reset the calculator to a blank state
calculator.setBlank();
```

To see a working example of saving and loading graphs to/from a server, you can download and run the sample content management system application from our GitHub repository.

#### `GraphingCalculator.setDefaultState(obj)`

Replace the calculator's "Delete All" button (under the "Edit List" menu) with a "Reset" button that will reset the calculator to the state represented by `obj`. Also, if a default state is set, the "home" zoom button will reset the zoom to the viewport associated with the default state instead of the usual Desmos default (roughly from -10 to 10, centered at the origin). If the `showResetButtonOnGraphpaper` option is `true`, a small reset button will appear on the graphpaper.

**Examples:**

```js
// Save the current state of a calculator instance
var newDefaultState = calculator.getState();

// Set a new default state to match the current state
calculator.setDefaultState(newDefaultState);

// From this point forward the "Delete All" button will be replaced with a "Reset"
// button that will set the calculator to the state stored in newDefaultState,
// and the "home" zoom button will restore the viewport to that of newDefaultState.
```

For a working example see `examples/default-state.html`.

#### `GraphingCalculator.undo()`

Return to the previous state in the undo/redo history, if available.

#### `GraphingCalculator.redo()`

Advance to the next state in the undo/redo history, if available.

#### `GraphingCalculator.clearHistory()`

Clear the undo/redo history. Does not affect the current state.

#### `GraphingCalculator.withHistoryReplacement(callback)`

Executes the provided callback, ensuring that any changes it makes replace the current state in the undo/redo history instead of creating a new entry. This method is useful if you want to make programmatic changes to a graph without interfering with the user's ability to undo/redo their own changes.

#### `GraphingCalculator.screenshot([opts])`

Returns an image of the current graphpaper in the form of a PNG data URI.

`opts` is an optional object with the following properties:

- `opts.width` — Width of the screenshot in pixels. Defaults to current width of graphpaper.
- `opts.height` — Height of the screenshot in pixels. Defaults to current height of graphpaper in pixels.
- `opts.targetPixelRatio` — Oversampling factor. Defaults to `1`. Larger values are useful for producing images that will look good on high pixel density ("retina") screens. For example, setting `opts.targetPixelRatio` to `2` will return an image that is physically twice as wide and twice as tall as the dimensions specified by `opts.width` and `opts.height`, but that is designed to look good when displayed scaled down to those dimensions.
- `opts.preserveAxisNumbers` — Determines whether to override the default behavior of stripping out the axis numbers from small images. Only relevant if `opts.width` or `opts.height` is less than 256px. Defaults to `false`.
- `opts.showMovablePoints` — Renders movable points with their interactive halo, instead of as static points. Defaults to `false`.

You can use the returned data URI directly in the `src` attribute of an image. To save the data as a traditional image file, you can parse the data and base64 decode it.

**Examples:**

```js
// Capture a full size screenshot of the graphpaper
var fullsize = calculator.screenshot();

// Capture a double resolution screenshot of the graphpaper designed to
// be displayed at 200px by 200px
var thumbnail = calculator.screenshot({
  width: 200,
  height: 200,
  targetPixelRatio: 2
});

// Append the thumbnail image to the current page
var img = document.createElement('img');
// Note: if width and height are not set, the thumbnail
// would display at 400px by 400px since it was captured
// with targetPixelRatio: 2.
img.width = 200;
img.height = 200;
img.src = thumbnail;
document.body.appendChild(img);
```

See `examples/screenshot.html` for a working example.

#### `GraphingCalculator.asyncScreenshot([opts], callback)`

Similar to `GraphingCalculator.screenshot`, but asynchronous. Rather than returning a PNG data URI directly, `callback` will be called with either a URI string or SVG string as its argument.

There are three main benefits to the asynchronous version:

- A guarantee that the graph state will be fully evaluated at the time the screenshot is captured (useful when setting large or complicated states).
- More flexibility in specifying the region of the graph to be captured (since we can evaluate/plot parts of the graph that are not currently visible before creating the image).
- The ability to output SVG in addition to PNG images.

`opts` is an optional object. It may contain the same properties passed into `Calculator.screenshot()`, as well as the following additional properties:

- `opts.format` — String that determines the format of the generated image. May be either `'png'` or `'svg'`. Defaults to `'png'`.
- `opts.mode` — String that determines the strategy for computing the viewport visible in the screenshot. See the table below for available modes and their descriptions. Defaults to `'contain'`.
- `opts.mathBounds` — An object representing desired viewport bounds with the same properties as those passed into `GraphingCalculator.setMathBounds()`: `top`, `bottom`, `left`, and `right`. The current viewport value will be used for any omitted property, but note that you cannot specify `top` without `bottom` or `left` without `right`. Passing invalid bounds will log a warning to the console and use the current viewport bounds in their entirety.
- `opts.showLabels` — Boolean that determines whether to include point labels in the captured image. Defaults to `false`.
- `opts.showMovablePoints` — Renders movable points with their interactive halo, instead of as static points. Defaults to `false`.

| Mode | Description |
|------|-------------|
| `contain` | Compute the smallest bounding box for the desired `mathBounds` and image dimensions that preserves the mathematical aspect ratio (in terms of math units per pixel). |
| `stretch` | Use the passed in `mathBounds` exactly, and the current graphpaper bounds for any omitted dimension. Does not preserve the mathematical aspect ratio. |
| `preserveX` | Set the left and right `mathBounds` explicitly (or use the current left and right viewport bounds if omitted), and expand or contract the y-axis bounds about the current midline in order to preserve the mathematical aspect ratio. If `top` and `bottom` are specified, the midline will be computed from those values. |
| `preserveY` | Set the top and bottom `mathBounds` explicitly (or use the current top and bottom viewport bounds if omitted), and expand or contract the x-axis bounds about the current midline in order to preserve the mathematical aspect ratio. If `left` and `right` are specified, the midline will be computed from those values. |

Which mode you choose may depend on whether or not the current viewport projection is uniform with respect to both axes (i.e., the mathematical aspect ratio is square). We provide `GraphingCalculator.isProjectionUniform()` as a convenience method to help with this decision.

**Examples:**

```js
// Callback
function setImageSrc(data) {
  var img = document.getElementById('my-image');
  img.src = data;
}

// Take a screenshot of an exact region without regard for the aspect ratio
calculator.asyncScreenshot(
  {
    mode: 'stretch',
    mathBounds: { left: -5, right: 5, bottom: -20, top: 0 }
  },
  setImageSrc
);

// Show -5 to 5 on the x-axis and preserve the aspect ratio
calculator.asyncScreenshot(
  {
    mode: 'preserveX',
    width: 500,
    height: 300,
    mathBounds: { left: -5, right: 5 }
  },
  setImageSrc
);

// Use the smallest bounding box containing the current viewport and preserve the aspect ratio
calculator.asyncScreenshot(setImageSrc);

// Preserve the aspect ratio if the axes are square, otherwise show the exact region
var opts = {
  mode: calculator.isProjectionUniform() ? 'contain' : 'stretch',
  width: 500,
  height: 300,
  mathBounds: { left: -5, right: 5, bottom: -20, top: 0 }
};
calculator.asyncScreenshot(opts, setImageSrc);
```

See `examples/async-screenshot.html` for more examples.

#### `GraphingCalculator.observeEvent('change', function (eventName, event) { /*...*/ })`

The `'change'` event is emitted by the calculator whenever any change occurs that will affect the persisted state of the calculator. This applies to any changes caused either by direct user interaction, or by calls to API methods.

Observing the `'change'` event allows implementing periodic saving of a user's work without the need for polling.

The callback provided to `observeEvent` is called with two parameters: the name of the event (e.g. `'change'`) and an event object containing a boolean `isUserInitiated` property. The value of `event.isUserInitiated` is `true` if the change that triggered the event was caused by a user interacting with the graph, and `false` otherwise (e.g. if the change is due to an API call like `calculator.setExpression()`).

**Example:**

```js
function persistState(state) {
  /* Persist state to your backend */
}

// This example uses the throttle function from underscore.js to limit
// the rate at which the calculator state is queried and persisted.
throttledSave = _.throttle(
  function () {
    persistState(calculator.getState());
    console.log('Save occurred');
  },
  1000,
  { leading: false }
);

calculator.observeEvent('change', function (eventName, event) {
  console.log('Change occurred');
  if (event.isUserInitiated) {
    throttledSave();
  }
});
```

For a working example of observing the change event, see `examples/mirror-state.html`.

#### `GraphingCalculator.unobserveEvent('change')`

Remove all observers added by `GraphingCalculator.observeEvent('change')`. For finer control over removing observers, see the section on managing observers.

#### Other Observable Events

| Event | Description |
|-------|-------------|
| `graphReset` | Fired whenever a user clicks the "Delete All" or "Reset" button in the expressions list top bar. |

---

### Manipulating Expressions

#### `GraphingCalculator.setExpression(expression_state)`

This will update or create a mathematical expression. `expression_state` should be an object which represents a single expression. Different types of expressions can be specified using the `type` property of `expression_state`, which must be either `expression` or `table`. If no `type` property is explicitly specified, the type defaults to `expression`.

This function does not return any value.

##### Expressions

| Name | Values |
|------|--------|
| `type` | String `'expression'`, optional. |
| `latex` | String, optional, following Desmos Expressions. |
| `color` | String, hex color, optional. See Colors. Default will cycle through 6 default colors. |
| `lineStyle` | Enum value, optional. Sets the line drawing style of curves or point lists. See Styles. |
| `lineWidth` | Number or String, optional. Determines width of lines in pixels. May be any positive number, or a LaTeX string that evaluates to a positive number. Defaults to `2.5`. |
| `lineOpacity` | Number or String, optional. Determines opacity of lines. May be a number between 0 and 1, or a LaTeX string that evaluates to a number between 0 and 1. Defaults to `0.9`. |
| `pointStyle` | Enum value, optional. Sets the point drawing style of point lists. See Styles. |
| `pointSize` | Number or String, optional. Determines diameter of points in pixels. May be any positive number, or a LaTeX string that evaluates to a positive number. Defaults to `9`. |
| `pointOpacity` | Number or String, optional. Determines opacity of points. May be a number between 0 and 1, or a LaTeX string that evaluates to a number between 0 and 1. Defaults to `0.9`. |
| `fillOpacity` | Number or String, optional. Determines opacity of the interior of a polygon or parametric curve. May be a number between 0 and 1, or a LaTeX string that evaluates to a number between 0 and 1. Defaults to `0.4`. |
| `points` | Boolean, optional. Determines whether points are plotted for point lists. |
| `lines` | Boolean, optional. Determines whether line segments are plotted for point lists. |
| `fill` | Boolean, optional. Determines whether a polygon or parametric curve has its interior shaded. |
| `hidden` | Boolean, optional. Determines whether the graph is drawn. Defaults to `false`. |
| `secret` | Boolean, optional. Determines whether the expression should appear in the expressions list. Does not affect graph visibility. Defaults to `false`. |
| `sliderBounds` | `{ min: String, max: String, step: String }`, optional. Sets bounds of slider expressions. If `step` is omitted, `''`, or `undefined`, the slider will be continuously adjustable. See note below. |
| `playing` | Boolean, optional. Determines whether the expression should animate, if it is a slider. Defaults to `false`. |
| `parametricDomain` | `{ min: String, max: String }`, optional. Sets bounds of parametric curves. See note below. |
| `polarDomain` | `{ min: String, max: String }`, optional. Sets bounds of polar curves. See note below. |
| `id` | String, optional. Should be a valid property name for a JavaScript object (letters, numbers, and `_`). |
| `dragMode` | Enum value, optional. Sets the drag mode of a point. See Drag Modes. Defaults to `DragModes.AUTO`. |
| `label` | String, optional. Sets the text label of a point. If a label is set to the empty string then the point's default label (its coordinates) will be applied. |
| `showLabel` | Boolean, optional. Sets the visibility of a point's text label. |
| `labelSize` | String, optional. Specifies the text size of a point's label as a LaTeX string, which, when computed, multiplies the standard label font size of 110% of the system font size. Defaults to `'1'`. |
| `labelOrientation` | Enum value, optional. Sets the desired position of a point's text label. See LabelOrientations. |

> **Note:** Bounds for the `parametricDomain`, `polarDomain`, and `sliderBounds` properties should be valid LaTeX strings; numbers will be coerced into strings before being set. Bounds can be any LaTeX expression in terms of numbers and predefined constants (`e`, `\pi`, `\tau`), but not variables.

##### Tables

| Name | Values |
|------|--------|
| `type` | String `'table'`, required. |
| `columns` | Array of Table Columns, required. |
| `id` | String, optional. Should be a valid property name for a JavaScript object (letters, numbers, and `_`). |

##### Notes

| Name | Values |
|------|--------|
| `type` | String `'text'`, required. |
| `text` | String, optional. The text content of the note. Defaults to `''`. |
| `id` | String, optional. Should be a valid property name for a JavaScript object (letters, numbers, and `_`). |

If `setExpression` is called with an `id` that already exists, values for provided parameters will be updated in the expression, and unprovided parameters will remain unchanged (they will **NOT** be reset to default values).

> **Note:** `setExpression` cannot be used to change the type of an existing expression. In that case, first use `removeExpression` to remove the existing expression.

If the expression results in an error, it will still be added to the expressions list, but nothing will be graphed.

If the provided parameters are invalid (e.g. `type` is set to something other than `'expression'`, `'text'`, or `'table'`), this function will have no effect.

**Examples:**

```js
// Define a variable m. Doesn't graph anything.
calculator.setExpression({ id: 'm', latex: 'm=2' });

// Draw a red line with slope of m through the origin.
// Because m = 2, this line will be of slope 2.
calculator.setExpression({ id: 'line1', latex: 'y=mx', color: '#ff0000' });

// Updating the value of m will change the slope of the line to 3
grapher.setExpression({ id: 'm', latex: 'm=3' });

// Inequality to shade a circle at the origin
calculator.setExpression({ id: 'circle1', latex: 'x^2 + y^2 < 1' });

// Restrict the slider for the m variable to the integers from 1 to 10
calculator.setExpression({
  id: 'm',
  sliderBounds: { min: 1, max: 10, step: 1 }
});

// Table with three columns. Note that the first two columns have explicitly
// specified values, and the third column is computed from the first.
calculator.setExpression({
  type: 'table',
  columns: [
    {
      latex: 'x',
      values: ['1', '2', '3', '4', '5']
    },
    {
      latex: 'y',
      values: ['1', '4', '9', '16', '25'],
      dragMode: Desmos.DragModes.XY
    },
    {
      latex: 'x^2',
      color: Desmos.Colors.BLUE,
      columnMode: Desmos.ColumnModes.LINES
    }
  ]
});
```

See this example live at `examples/column-properties.html`.

Additional Example: Update slider values based on the mouse position: `examples/mousemove.html`

#### `GraphingCalculator.setExpressions(expression_states)`

`expression_states` should be an array, and each element should be a valid argument for `GraphingCalculator.setExpression()`.

This function will attempt to create expressions for each element in the array, and is equivalent to:

```js
expression_states.forEach(function (expression_state) {
  calculator.setExpression(expression_state);
});
```

This function does not return any value.

#### `GraphingCalculator.removeExpression(expression_state)`

Remove an expression from the expressions list. `expression_state` is an object with an `id` property.

**Examples:**

```js
// Add an expression
calculator.setExpression({ id: 'parabola', latex: 'y=x^2' });

// Remove it
calculator.removeExpression({ id: 'parabola' });
```

#### `GraphingCalculator.removeExpressions(expression_states)`

Remove several expressions from the expressions list. `expression_states` is an array of objects with `id` properties. This function is equivalent to:

```js
expression_states.forEach(function (expression_state) {
  calculator.removeExpression(expression_state);
});
```

#### `GraphingCalculator.getExpressions()`

Returns a representation of the current expressions list as an array. Each array member is an expression state (i.e. an object suitable for passing into `setExpression`).

```js
calculator.getExpressions();
/*
[
  {
    id: "1",
    type: "expression",
    latex: "\left(1,2\right)",
    pointStyle: "POINT",
    hidden: false,
    secret: false,
    color: "#c74440",
    parametricDomain: {min: "0", max: "1"},
    dragMode: "X",
    label: "my point",
    showLabel: true
  },
  ...
]
*/
```

#### `GraphingCalculator.expressionAnalysis`

An observable object containing information about the calculator's analysis of each expression. Its keys are expression ids, and its values are objects with the following properties:

```js
{
  isGraphable: Boolean, // Does the expression represent something that can be plotted?
  isError: Boolean,     // Does the expression result in an evaluation error?
  errorMessage?: String // The (localized) error message, if any
  evaluationDisplayed?: Boolean, // Is evaluation information displayed in the expressions list?
  evaluation?: { type: 'Number', value: Number } |
               { type: 'ListOfNumber', value: Number[] } // numeric value(s)
}
```

Note that the calculator evaluates expressions asynchronously, so attempts to access `expressionAnalysis` in synchronous code may not accurately reflect the most current evaluation state. Instead, the `expressionAnalysis` object should be observed and referenced inside of a callback.

```js
calculator.observe('expressionAnalysis', function () {
  for (var id in calculator.expressionAnalysis) {
    var analysis = calculator.expressionAnalysis[id];
    if (analysis.isGraphable) console.log('This expression can be plotted.');
    if (analysis.isError)
      console.log(`Expression '${id}': ${analysis.errorMessage}`);
    if (analysis.evaluation) console.log(`value: ${analysis.evaluation.value}`);
  }
});
```

---

### Desmos Expressions

Expressions are the central mathematical objects used in Desmos. They can plot curves, draw points, define variables, even define multi-argument functions. Desmos uses LaTeX for passing expressions back and forth.

The following sections give some examples of supported functionality but are not exhaustive.

We recommend using the interactive calculator at [www.desmos.com/calculator](https://www.desmos.com/calculator) to explore the full range of supported expressions.

#### Types of Expressions

When analyzed, expressions can cause one or more of the following effects:

- **Evaluation** — If the expression can be evaluated to a number, it will be evaluated.
- **Plotting curves** — If the expression expresses one variable as a function of another, it will be plotted.
- **Plotting points** — If the expression defines one or more points, they will be plotted directly.
- **Plotting Inequalities** — If an expression represents an inequality of x and y which can be solved, the entire region represented by the inequality will be shaded in.
- **Exporting definitions** — Expressions can export either variable or function definitions, which can be used elsewhere. Definitions are not order-dependent. Built-in symbols cannot be redefined. If a symbol is defined multiple times, referencing it elsewhere will be an error.
- **Solving** — If an expression of x and y can be solved (specifically, if it is quadratic in either x or y), the solution set will be plotted, but no definitions will be exported.
- **Errors** — If the input cannot be interpreted, the expression will be marked as an error.

| Input | Effect |
|-------|--------|
| `1 + 1` | Evaluable. |
| `sin(x)` | Plots y as a function of x. |
| `m = 1` | Defines m as a variable that can be referenced by other expressions. |
| `a = 2 + x` | Plots a as a function of x, and defines a as a variable that can be referenced by other expressions. |
| `x + y = 3` | Plots an implicit curve of x and y. |

#### Supported Characters

Following the LaTeX standard, any multi-character symbol must be preceded by a leading backslash, otherwise it will be interpreted as a series of single-letter variables. That the backslash also functions as an escape character inside of JavaScript strings is a common source of confusion. You should take special care to ensure that a literal backslash character ends up in the final string, which can be accomplished in one of two ways:

- Escape every backslash: `'\\sin(\\pi)'`
- Use template literals: `` String.raw`\sin(\pi)` `` (not supported in IE)

The following functions are defined as built-ins:

**Arithmetic operators:** `+`, `-`, `*`, `/`, `^`

These operators follow standard precedence rules, and can operate on any kind of expression. As specified by LaTeX, exponentiation with a power that is more than one character requires curly braces around the exponent.

Division is always represented in fraction notation. Curly braces can be used to specify the limits of the numerator and the denominator where they don't follow standard precedence rules.

**Mathematical constants:** `e`, `\pi`

**Trig functions (forward and inverse):** `sin`, `cos`, `tan`, `cot`, `sec`, `csc`, `arcsin`, `arccos`, `arctan`, `arccot`, `arcsec`, `arccsc`

These functions all take a single input, and operate in radians by default. They support both formal function notation: `sin(x)`, and shorthand notation: `sin x`. Shorthand notation is limited to cases where the provided argument is simple and unambiguous, so function notation is recommended for any computer-generated expressions. These functions also support inverse and squared function notation, via `sin^{-1}(x)` and `sin^2(x)`.

**Logarithms:** `ln`, `log`

These functions both take a single input, and operate with bases of `e` and `10`, respectively. These work in both function and shorthand notation, like the trig functions. Logs of arbitrary bases can be specified using subscripts: `\log_a(b)`.

**Square root:** `\sqrt{x}`

---

### Helper Expressions

In addition to normal expressions that show up in the calculator's expressions list, you can create "helper expressions" that are evaluated like normal expressions, but don't show up in the expressions list. Helper expressions are useful for monitoring and reacting to what a user is doing with an embedded calculator. Every calculator object has a `HelperExpression` constructor for adding helper expressions to that calculator.

```js
var calculator = Desmos.GraphingCalculator(elt);

calculator.setExpression({ id: 'a-slider', latex: 'a=1' });
var a = calculator.HelperExpression({ latex: 'a' });

calculator.setExpression({ id: 'list', latex: 'L=[1, 2, 3]' });
var L = calculator.HelperExpression({ latex: 'L' });
```

Helper expressions have two observable properties: `numericValue` for expressions that evaluate to a number, and `listValue` for expressions that evaluate to a list. They are updated whenever the expression changes.

#### `HelperExpression.numericValue`

```js
a.observe('numericValue', function () {
  console.log(a.numericValue);
});

L.observe('listValue', function () {
  console.log(L.listValue);
});
```

See `examples/helper.html` for an example of monitoring the value of a slider and using it to update the surrounding page.

See `examples/dynamic-labels.html` for an example of observing a slider value to create a dynamic point label.

---

### Table Columns

Tables are specified by an array of their columns. The values in each column are either explicitly specified when the column header is a unique variable, or computed if the column header is an expression.

| Name | Description |
|------|-------------|
| `latex` | String, required. Variable or computed expression used in the column header. |
| `values` | Array of LaTeX strings, optional. Need not be specified in the case of computed table columns. |
| `color` | String hex color, optional. See Colors. Default will cycle through 6 default colors. |
| `hidden` | Boolean, optional. Determines if graph is drawn. Defaults to `false`. |
| `points` | Boolean, optional. Determines whether points are plotted. |
| `lines` | Boolean, optional. Determines whether line segments are plotted. |
| `lineStyle` | Enum value, optional. Sets the drawing style for line segments. See Styles. |
| `lineWidth` | Number or String, optional. Determines width of lines in pixels. May be any positive number, or a LaTeX string that evaluates to a positive number. Defaults to `2.5`. |
| `lineOpacity` | Number or String, optional. Determines opacity of lines. May be a number between 0 and 1, or a LaTeX string that evaluates to a number between 0 and 1. Defaults to `0.9`. |
| `pointStyle` | Enum value, optional. Sets the drawing style for points. See Styles. |
| `pointSize` | Number or String, optional. Determines diameter of points in pixels. May be any positive number, or a LaTeX string that evaluates to a positive number. Defaults to `9`. |
| `pointOpacity` | Number or String, optional. Determines opacity of points. May be a number between 0 and 1, or a LaTeX string that evaluates to a number between 0 and 1. Defaults to `0.9`. |
| `columnMode` *(DEPRECATED)* | Enum value, optional. See Column Modes. Defaults to `Desmos.ColumnModes.POINT`. |
| `dragMode` | Enum value, optional. See Drag Modes. Defaults to `DragModes.NONE`. |

> Note that display properties such as `color` and `hidden` are ignored for the first column because the first column is never plotted as a dependent variable.

---

### Column Modes *(DEPRECATED)*

The `columnMode` of a table column determines whether points in the table column are drawn as points, lines, or both, specified as one of:

- `Desmos.ColumnModes.POINTS`
- `Desmos.ColumnModes.LINES`
- `Desmos.ColumnModes.POINTS_AND_LINES`

> Note that as of API v1.1 the `columnMode` property for table columns has been split into boolean `points` and `lines` properties that control whether points and line segments are plotted, respectively.

---

### Drag Modes

The `dragMode` of a point determines whether it can be changed by dragging in the x direction, the y direction, both, or neither:

- `Desmos.DragModes.X`
- `Desmos.DragModes.Y`
- `Desmos.DragModes.XY`
- `Desmos.DragModes.NONE`

In addition, a point may have its `dragMode` set to `Desmos.DragModes.AUTO`, in which case the normal calculator rules for determining point behavior will be applied. For example, a point whose coordinates are both slider variables would be draggable in both the x and y directions.

The `dragMode` of a table column determines the behavior of the points represented by the column. The `dragMode` is only applicable to explicitly specified column values, and has no effect on computed column values.

---

### Axis Arrow Modes

The `AxisArrowMode` specifies whether arrows should be drawn at one or both ends of the x or y axes. It is specified separately for the x and y axes through the `xAxisArrowMode` and `yAxisArrowMode` graph settings. Must be one of:

- `Desmos.AxisArrowModes.NONE`
- `Desmos.AxisArrowModes.POSITIVE`
- `Desmos.AxisArrowModes.BOTH`

The default value for both axes is `Desmos.AxisArrowMode.NONE`.

**Example:**

```js
// Set the x axis to have arrows on both ends
calculator.updateSettings({ xAxisArrowMode: Desmos.AxisArrowModes.BOTH });
```

---

### Label Orientations

The `labelOrientation` property specifies the desired position of a point's label, relative to the point itself. This will override the calculator's default behavior of trying to position labels in such a way as to maintain legibility. To restore this behavior, set the value back to `Desmos.LabelOrientations.DEFAULT`.

- `Desmos.LabelOrientations.ABOVE`
- `Desmos.LabelOrientations.BELOW`
- `Desmos.LabelOrientations.LEFT`
- `Desmos.LabelOrientations.RIGHT`
- `Desmos.LabelOrientations.DEFAULT`

The default value is `Desmos.LabelOrientations.DEFAULT`.

---

### Author Features

Secret folders allow creating graphed expressions and defining functions and variables with definitions that can be hidden from other users.

Readonly expressions can't be edited or deleted by a student. Display properties and, where relevant, direct manipulation of plotted expressions or objects (e.g. sliders and clickable and movable objects) remain enabled and editable.

Disabling graph interactions for an expression means that the user will not be able to select or trace the object from the graphpaper using a mouse, keyboard, or touch gesture.

To allow a user to create and see the contents of secret folders, to set or edit readonly expressions, or to disable graph interactions for a plotted expression or object, use the `{authorFeatures: true}` option in the calculator constructor.

In `authorFeatures: true` mode, whenever a folder is created, it can optionally be made secret by checking the "hide this folder from students" option. The contents of these folders will be hidden when loaded into a calculator in `administerSecretFolders: false` mode (the default). Any expression, note, image, folder, or table can be marked readonly from Edit List Mode. Any plotted expression or object can have its graph interactions disabled from the expression options menu.

This workflow is useful for creating activities where students are asked to describe properties of a graphed function without seeing its definition, or to ensure that critical expressions can't be deleted or modified.

**Example:**

```js
// In calc1, users will be allowed to create secret folders and see
// their contents.
var calc1 = Desmos.GraphingCalculator(elt1, { authorFeatures: true });

// By default, secret folders are hidden from users.
var calc2 = Desmos.GraphingCalculator(elt2);
```

For a working example of Secret Folders, see `examples/secret-folders.html`.

For a working example of Readonly Expressions, see `examples/readonly-expressions.html`.

---

### Updating and Observing Settings

#### `GraphingCalculator.updateSettings(settings)`
#### `GraphingCalculator.setGraphSettings(settings)` *(DEPRECATED)*

Updates any of the properties allowed in the constructor. Only properties that are present will be changed — other settings will retain their previous value. Note that `updateSettings` is preferred to `setGraphSettings`, which is deprecated.

Note that certain combinations of options are mutually exclusive. If an update would produce incompatible options, additional options may be ignored or adjusted to obtain a compatible set. To prevent the calculator from making those adjustments on your behalf, you should avoid passing in the following combinations:

- `graphpaper: false` with `expressionsCollapsed: true` or `zoomButtons: true`
- `lockViewport: true` with `zoomButtons: true`

#### `GraphingCalculator.settings`
#### `GraphingCalculator.graphSettings` *(DEPRECATED)*

Object with observable properties for each public property.

**Example:**

```js
// Set xAxisLabel
calculator.updateSettings({ xAxisLabel: 'Time' });

// Observe the value of `xAxisLabel`, and log a message when it changes.
calculator.settings.observe('xAxisLabel', function () {
  console.log(calculator.settings.xAxisLabel);
});
```

See `examples/graphsettings.html` for a working example of setting and observing graph settings.

---

### Random Seeds

The graphing calculator has a built-in `random()` function that returns random samples from lists and statistical distributions. Behind every call to `random()` is a pseudorandom number generator (PRNG) that takes a seed. While the seed ultimately consumed by the PRNG comprises several components, the settings object exposes a property called `randomSeed` that can be observed or set.

By default, `randomSeed` is a 128-bit string that is created at instantiation time and updated whenever the graph is cleared or the user presses a "randomize" icon at the top of the expressions list. Since `randomSeed` serves as a common prefix for every seed passed to the PRNG, updating its value will simultaneously re-randomize every expression in the list that uses the `random()` function.

The `randomSeed` property is included in the serialized state returned from `.getState()`, and loading a state via `.setState()` will preserve the existing seed.

**Example:**

```js
calculator.updateSettings({ randomSeed: 'my-random-seed' });
```

#### `GraphingCalculator.newRandomSeed()`

Update the `settings.randomSeed` property to a new random value.

---

### Tones

The `tone` command allows users to create and manipulate sound. Each expression that uses `tone()` can be toggled individually in a way that is analogous to visibility for plotted expressions. There is also a global mute/unmute button that appears at the top of the expressions list if any expression uses `tone()`.

An individual `tone()` expression can be (de)activated by using `GraphingCalculator.setExpression()` to set its `hidden` property. There is also a `muted` configuration option that may be updated or observed like any other settings property.

> Note that the Web Audio API is typically covered by browser autoplay policies, and thus attempting to generate audio prior to user interaction with the page is likely to fail. The calculator will always begin in a globally muted state, and you should only attempt to globally unmute expressions initially in response to a user action.

---

### Layout

By default, the calculator will fill its container element (with one notable exception: see `GraphingCalculator.resize()` immediately below). That means sizing the calculator appropriately for your layout is equivalent to sizing its containing `<div>`, just like any other element on the page, with two additional considerations:

- The calculator will automatically display in one of two layouts depending on its container element's width: above 450px the expressions list will be placed to the left of the graph paper; below 450px the expressions list will be placed below the graph paper.
- In order for the calculator to adjust its layout appropriately on mobile devices, a viewport `<meta>` tag is necessary to control the viewport size and scale. Include the following in the `<head>` of your page:

```html
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

#### `GraphingCalculator.resize()`

Resize the calculator to fill its container. This will happen automatically unless the `autosize` constructor option is set to `false`. In that case, this method must be called whenever the dimensions of the calculator's container element change, and whenever the container element is added to or removed from the DOM.

**Example:**

```js
var elt = document.getElementById('calculator');
var calculator = Desmos.GraphingCalculator(elt, { autosize: false });

// Resize the calculator explicitly.
elt.style.width = '600px';
elt.style.height = '400px';
calculator.resize();
```

See `examples/fullscreen.html` for an example of how to keep the calculator resized to fill the full screen using absolute positioning.

This function does not return any value.

---

### Coordinates

#### `GraphingCalculator.setMathBounds(bounds)`

Updates the math coordinates of the graphpaper bounds. `bounds` must be an object with `left`, `right`, `bottom`, and `top` properties.

If invalid bounds are provided (`bounds.right <= bounds.left`, `bounds.top <= bounds.bottom`), the graphpaper bounds will not be changed.

**Example:**

```js
// Only show the first quadrant
calculator.setMathBounds({
  left: 0,
  right: 10,
  bottom: 0,
  top: 10
});
```

This function does not return any value.

#### `GraphingCalculator.graphpaperBounds`

The `graphpaperBounds` observable property gives the bounds of the graphpaper in both math coordinates and pixel coordinates. It is an object with the following structure:

```js
{
  mathCoordinates: {
    top: Number,
    bottom: Number,
    left: Number,
    right: Number,
    width: Number,
    height: Number
  },
  pixelCoordinates: {
    top: Number,
    bottom: Number,
    left: Number,
    right: Number,
    width: Number,
    height: Number
  }
}
```

`pixelCoordinates` are referenced to the top left of the calculator's parent DOM element — that is, the element that is passed into the `GraphingCalculator` constructor. Note that `pixelCoordinates.top < pixelCoordinates.bottom`, but `mathCoordinates.top > mathCoordinates.bottom`.

**Example:**

```js
calculator.observe('graphpaperBounds', function () {
  var pixelCoordinates = calculator.graphpaperBounds.pixelCoordinates;
  var mathCoordinates = calculator.graphpaperBounds.mathCoordinates;

  var pixelsPerUnitY = pixelCoordinates.height / mathCoordinates.height;
  var pixelsPerUnitX = pixelCoordinates.width / mathCoordinates.width;

  console.log('Current aspect ratio: ' + pixelsPerUnitY / pixelsPerUnitX);
});
```

#### `GraphingCalculator.mathToPixels(coords)`

Convert math coordinates to pixel coordinates. `coords` is an object with an `x` property, a `y` property, or both. Returns an object with the same properties as `coords`.

#### `GraphingCalculator.pixelsToMath(coords)`

Convert pixel coordinates to math coordinates. Inverse of `mathToPixels`.

**Examples:**

```js
// Find the pixel coordinates of the graphpaper origin:
calculator.mathToPixels({ x: 0, y: 0 });

// Find the math coordinates of the mouse
var calculatorRect = calculatorElt.getBoundingClientRect();
document.addEventListener('mousemove', function (evt) {
  console.log(
    calculator.pixelsToMath({
      x: evt.clientX - calculatorRect.left,
      y: evt.clientY - calculatorRect.top
    })
  );
});
```

Additional Examples:

- Observe `calculator.graphpaperBounds` to keep external labels synced with the graphpaper: `examples/graphpaper-bounds.html`
- Translate clicks to math coordinates to add points to a table: `examples/click-table.html`

---

### Managing Observers

The calculator exposes several objects with observable properties that may be accessed via an `observe` method. The first argument to `observe` is a property string, and the second is a callback to be fired when the property changes. Multiple observers can be added to a single property.

In general, calling `.unobserve(property)` removes all of the observers created with `.observe(property)`. It is also possible to use namespaced property strings when creating observers so that they can be removed individually.

**Example:**

```js
// Add three different observers to the 'xAxisLabel' property
calculator.settings.observe('xAxisLabel.foo', callback1);
calculator.settings.observe('xAxisLabel.bar', callback2);
calculator.settings.observe('xAxisLabel.baz', callback3);

// Stop firing `callback2` when the x-axis label changes
calculator.settings.unobserve('xAxisLabel.bar');

// Remove the two remaining observers
calculator.settings.unobserve('xAxisLabel');
```

See `examples/managing-observers.html` for a live example.

`GraphingCalculator.observeEvent` and `GraphingCalculator.unobserveEvent` behave in the same way as `observe` and `unobserve`, respectively. The only difference is that, while `observe` is always associated with a property of an object that is being updated, `observeEvent` is used to listen for global calculator events (currently just `'change'`). Calculator events can be namespaced in the same way that properties can. For instance, binding a callback to `'change.foo'` would make it possible to remove a single observer with `GraphingCalculator.unobserveEvent('change.foo')`.

---

### Selection and Focus

When an expression in the calculator is selected, its corresponding curve is highlighted. Expressions may be selected even when the expressions list is not present. Currently, only one expression may be selected at a time.

When an expression is focused, a cursor appears in it in the expressions list, allowing the expression to be updated with the keypad or a keyboard. A focused expression is always selected, but an expression may be selected without being focused. Only one expression can be focused at a time.

#### `GraphingCalculator.focusFirstExpression()`

Focus the first expression in the expressions list. Note that the first expression isn't focused by default because if the calculator is embedded in a page that can be scrolled, the browser will typically scroll the focused expression into view at page load time, which may not be desirable.

#### `GraphingCalculator.openKeypad()` *(DEPRECATED)*

Open the calculator keypad. An expression must be focused for the keypad to be open, so if no expression is focused, this method will focus the first expression. If the onscreen keypad is already open, this method has no effect.

If the calculator is configured with `keypad: false`, this method will ensure that some expression is focused but will not display the keypad.

> Note: using the API option of `keypadActivated`, optionally followed by calling `.focusFirstExpression()` is preferred.

#### `GraphingCalculator.isAnyExpressionSelected`

Boolean observable property, `true` when an expression is selected, `false` when no expression is selected.

#### `GraphingCalculator.selectedExpressionId`

Observable property that holds the `id` of the currently selected expression, or `undefined` when no expression is selected.

#### `GraphingCalculator.removeSelected()`

Remove the selected expression. Returns the `id` of the expression that was removed, or `undefined` if no expression was selected.

See `examples/remove-selected.html` for an example.

---

### Colors

Colors are chosen from a default list of 6 colors. These are available through the `Colors` object.

| Name | Hex String |
|------|------------|
| `Colors.RED` | `#c74440` |
| `Colors.BLUE` | `#2d70b3` |
| `Colors.GREEN` | `#388c46` |
| `Colors.PURPLE` | `#6042a6` |
| `Colors.ORANGE` | `#fa7e19` |
| `Colors.BLACK` | `#000000` |

You may also specify colors as a property on the options object in the constructor, which will override the default color palette. `colors` must be an object whose values are strings representing valid CSS color values. As a convenience, a calculator instance's current color palette can be accessed via `Calculator.colors`.

You can choose the color of a new expression explicitly by setting its `color` property.

> Note that the ability to override the color palette means that graph states saved in one environment may contain colors not found in another environment. The best solution is to load only those graphs created in an environment using your custom colors. Alternatively, when calling `Calculator.setState` you may either load the state with the saved colors as-is, or coerce unavailable colors to their perceptually closest counterparts in your `Calculator.colors` object.

**Examples:**

```js
calculator.setExpression({
  id: '1',
  latex: 'y=x',
  color: Desmos.Colors.BLUE
});

calculator.setExpression({
  id: '2',
  latex: 'y=x + 1',
  color: '#ff0000'
});

calculator.setExpression({
  id: '3',
  latex: 'y=sin(x)',
  color: calculator.colors.customBlue
});
```

For a live example see `examples/colors.html`.

---

### Styles

Drawing styles for points and curves may be chosen from a set of predefined values, which are available through the `Styles` object.

**For points:**

- `Desmos.Styles.POINT`
- `Desmos.Styles.OPEN`
- `Desmos.Styles.CROSS`
- `Desmos.Styles.SQUARE`
- `Desmos.Styles.PLUS`
- `Desmos.Styles.TRIANGLE`
- `Desmos.Styles.DIAMOND`
- `Desmos.Styles.STAR`

**For curves:**

- `Desmos.Styles.SOLID`
- `Desmos.Styles.DASHED`
- `Desmos.Styles.DOTTED`

**Examples:**

```js
// Make a dashed line
calculator.setExpression({
  id: 'line',
  latex: 'y=x',
  lineStyle: Desmos.Styles.DASHED
});

// Make a point that looks like a cross
calculator.setExpression({
  id: 'pointA',
  latex: 'A=(1,2)',
  pointStyle: Desmos.Styles.CROSS
});

// Point B will render as a hole
calculator.setExpression({
  id: 'pointB',
  latex: 'B=(2,4)',
  pointStyle: Desmos.Styles.OPEN
});
```

---

### Font Sizes

Though the calculator's `fontSize` property can be set to any numeric value, we provide a set of predefined font sizes for convenience. These are available through the `FontSizes` object.

| Name | Pixel Value |
|------|-------------|
| `FontSizes.VERY_SMALL` | `9` |
| `FontSizes.SMALL` | `12` |
| `FontSizes.MEDIUM` | `16` |
| `FontSizes.LARGE` | `20` |
| `FontSizes.VERY_LARGE` | `24` |

You can set the base font size for the calculator through the `updateSettings` method.

**Examples:**

```js
calculator.updateSettings({ fontSize: Desmos.FontSizes.LARGE });

calculator.updateSettings({ fontSize: 11 });
```

---

### Languages

The calculator's display language can be set to any of our supported languages using the `updateSettings` method. Languages are not provided by default, but they may be requested from the `api/` endpoint via a `lang` URL parameter. The requested translations are bundled into `calculator.js` before it is returned, and those languages become available to any calculator instance in the page.

To inspect the available languages at runtime, we expose a `Desmos.supportedLanguages` property that provides an array of language codes suitable for passing into `Calculator.updateSettings`.

| Language | Code |
|----------|------|
| German | `'de'` |
| English (U.S.) | `'en'` |
| Spanish | `'es'` |
| Estonian | `'et'` |
| French | `'fr'` |
| Indonesian | `'id'` |
| Italian | `'it'` |
| Japanese | `'ja'` |
| Korean | `'ko'` |
| Dutch | `'nl'` |
| Polish | `'pl'` |
| Portuguese (Brazil) | `'pt-BR'` |
| Russian | `'ru'` |
| Swedish | `'sv-SE'` |
| Thai | `'th'` |
| Turkish | `'tr'` |
| Vietnamese | `'vi'` |
| Chinese (Simplified) | `'zh-CN'` |
| Chinese (Traditional) | `'zh-TW'` |

**Examples:**

```html
<!-- Include Spanish translations -->
<script src="https://www.desmos.com/api/v1.11/calculator.js?apiKey=[YOUR_API_KEY_HERE]&lang=es"></script>

<!-- Include Spanish and French translations -->
<script src="https://www.desmos.com/api/v1.11/calculator.js?apiKey=[YOUR_API_KEY_HERE]&lang=es,fr"></script>

<!-- Include all available translations -->
<script src="https://www.desmos.com/api/v1.11/calculator.js?apiKey=[YOUR_API_KEY_HERE]&lang=all"></script>
```

```js
// Inspect available languages
Desmos.supportedLanguages; // ['en', 'es', 'fr']

// Set a calculator instance to French
calculator.updateSettings({ language: 'fr' });
```

See `examples/languages.html` to see this example live.

---

### Accessibility

In service of our mission to help everybody grow with math, we strive to make our tools accessible to the widest possible audience.

The default calculator configurations represent our current best thinking about how to make the calculator accessible to everyone. Changing certain options can have important accessibility implications:

- **`settingsMenu`**: The settings menu contains controls for making items in the calculator easier to see, such as the display size of items in the expressions list and on the graph paper, as well as reverse contrast mode. It also contains the controls for switching Braille modes. When setting this option to `false`, you should provide alternate methods for users to set `projectorMode`, `reverseContrast`, and `brailleMode`.
- **`brailleControls`**: Setting this option to `false` means that users will not be able to set the Braille mode through the settings menu or with keyboard shortcuts. When setting this option to `false`, you should provide a way for users to set `brailleMode` externally. Be aware that some users may find it valuable to switch back and forth between a Braille mode and visually typeset math as they are using the calculator, so we recommend supporting keyboard shortcuts for switching between modes.
- **`audio`**: Disabling graph sonification means that a user who has difficulty seeing the graph paper will not be able to get auditory information about the shape of the graph. When setting this option to `false`, you should have a plan for accommodating people who use sound to access graphical information.
- **`graphDescription`**: When setting this value to an empty string, a user of software such as a screen reader may lack important information about the layout, bounds, and visible features of the graph paper. Take care that an alternative method for obtaining important graph information is readily available in your application.

Desmos has developed a library called Abraham for translating between LaTeX and the Braille math codes Nemeth and UEB. If you would like to use this library, please contact us at [partnerships@desmos.com](mailto:partnerships@desmos.com).

---

### Image Uploads

By default, users can upload images to use on graphs by either dragging images to the expressions list, or selecting "Image" from the "Add Expression" menu.

Image uploads can be disabled by passing `{images: false}` as a constructor option.

When users upload images, image data will be stored inline with graph states as data URLs. Graph states that contain inline images are typically much larger than other graph states.

An alternative is available that can significantly reduce the size of graph states that contain images by storing the images separately so that only the image URL is stored in the state. To enable this behavior, specify `{imageUploadCallback: function (file, cb) {/*...*/}}` as a constructor option.

The `imageUploadCallback` function will be called whenever a user uploads an image file. The first argument is a `File` object that you should serialize to a location with a publicly accessible URL. The second argument is a callback with the signature `cb(err, url)` that should be called with either an error or the URL of the serialized image.

When storing images remotely, it is important that they are either served from the same domain as the page that the calculator is displayed on, or that proper CORS `Access-Control-Allow-Origin` headers are set to allow the images to be loaded on a different domain.

The default `imageUploadCallback` function is provided as `Desmos.imageFileToDataURL(file, cb)` as a convenience. It will convert the file to a data URL, taking EXIF orientation headers into account and recompressing large images.

**Example:**

```js
function imageUploadCallback(file, cb) {
  Desmos.imageFileToDataURL(file, function (err, dataURL) {
    if (err) {
      cb(err);
      return;
    }

    // Send the data to your server, and arrange for your server to
    // respond with a URL
    $.post('https://example.com/serialize-image', { imageData: dataURL }).then(
      function (msg) {
        cb(null, msg.url);
      }, // Success, call the callback with a URL
      function () {
        cb(true);
      } // Indicate that an error has occurred
    );
  });
}

Desmos.GraphingCalculator(elt, { imageUploadCallback: imageUploadCallback });
```

For a working example, see `examples/image-upload-callback.html`.

---

## Basic Calculators

In addition to the graphing calculator, Desmos offers a four function calculator and a scientific calculator. The four function and scientific calculators are created in a similar way to the graphing calculator, and support a subset of its functionality.

> Note that access to the four-function calculator, scientific calculator, and geometry tool must be separately enabled per API key. You can see which features are enabled for your API key by reading `Desmos.enabledFeatures`. Calling a constructor for a feature that is not enabled is an error.

**Examples:**

```js
// All features enabled
Desmos.enabledFeatures === {
  GraphingCalculator: true,
  FourFunctionCalculator: true,
  ScientificCalculator: true,
  GeometryCalculator: true
};

// Only graphing calculator enabled
Desmos.enabledFeatures === {
  GraphingCalculator: true,
  FourFunctionCalculator: false,
  ScientificCalculator: false,
  GeometryCalculator: false
};
```

### Constructors

#### `constructor FourFunctionCalculator(element, [options])`

Creates a four function calculator object to control the calculator embedded in the DOM element specified by `element`.

`options` is an optional object that specifies features that should be included or excluded.

| Name | Default | Description |
|------|---------|-------------|
| `links` | `true` | Allow external hyperlinks (e.g. to braille examples) |
| `additionalFunctions` | `['sqrt']` | Picks the extra function(s) that appear in the top bar. Maximum 2, minimum 1. Options include `'exponent'`, `'percent'`, `'fraction'`, and `'sqrt'`. Pass in a single string or an array of strings. |
| `fontSize` | `16` | Base font size. |
| `invertedColors` | `false` | Display the calculator with an inverted color scheme. |
| `settingsMenu` | `true` | Display the settings menu. See Accessibility Notes. |
| `language` | `'en'` | Language. See the Languages section for more information. |
| `brailleMode` | `'none'` | Set the input and output Braille code for persons using refreshable Braille displays. Valid options are `'nemeth'`, `'ueb'`, or `'none'`. |
| `sixKeyInput` | `false` | Allow users to write six-dot Braille characters using the Home Row keys (S, D, F, J, K, and L). Requires that `brailleMode` be `'nemeth'` or `'ueb'`. |
| `projectorMode` | `false` | Display the calculator in a larger font. |
| `decimalToFraction` | `false` | When `true`, users are able to toggle between decimal and fraction output in evaluations if Desmos detects a good rational approximation. |
| `capExpressionSize` | `false` | Limit the size of an expression to 500 LaTeX tokens and a maximum nesting depth of 30. |

For a working example see `examples/four-function-with-percent.html`.

#### `constructor ScientificCalculator(element, [options])`

Creates a scientific calculator object to control the calculator embedded in the DOM element specified by `element`.

`options` is an optional object that specifies features that should be included or excluded.

| Name | Default | Description |
|------|---------|-------------|
| `links` | `true` | Allow external hyperlinks (e.g. to braille examples) |
| `qwertyKeyboard` | `true` | Display the keypad in QWERTY layout (`false` shows an alphabetical layout) |
| `degreeMode` | `false` | When `true`, trig functions assume arguments are in degrees. Otherwise, arguments are assumed to be in radians. |
| `fontSize` | `16` | Base font size. |
| `invertedColors` | `false` | Display the calculator with an inverted color scheme. |
| `settingsMenu` | `true` | Display the settings menu. See Accessibility Notes. |
| `language` | `'en'` | Language. See the Languages section for more information. |
| `brailleMode` | `'none'` | Set the input and output Braille code for persons using refreshable Braille displays. Valid options are `'nemeth'`, `'ueb'`, or `'none'`. |
| `sixKeyInput` | `false` | Allow users to write six-dot Braille characters using the Home Row keys (S, D, F, J, K, and L). Requires that `brailleMode` be `'nemeth'` or `'ueb'`. |
| `brailleExpressionDownload` | `true` | Allows the user to export a Braille rendering of the expression list. Requires that `brailleMode` be `'nemeth'` or `'ueb'`. |
| `projectorMode` | `false` | Display the calculator in a larger font. |
| `decimalToFraction` | `true` | When `true`, users are able to toggle between decimal and fraction output in evaluations if Desmos detects a good rational approximation. |
| `capExpressionSize` | `false` | Limit the size of an expression to 500 LaTeX tokens and a maximum nesting depth of 30. |
| `functionDefinition` | `true` | Allow function definition, i.e. `f(x) = 2x`. |
| `autosize` | `true` | Determine whether the calculator should automatically resize whenever there are changes to element's dimensions. If set to `false` you will need to explicitly call `.resize()` in certain situations. See `.resize()`. |
| `allowComplex` | `true` | Enable the "Complex Mode" toggle in the Settings Menu. See section on complex numbers. |

**Examples:**

```js
var elt1 = document.getElementById('four-function-calculator');
var calculator1 = Desmos.FourFunctionCalculator(elt1);

var elt2 = document.getElementById('scientific-calculator');
var calculator2 = Desmos.ScientificCalculator(elt2);
```

The object returned is a `Desmos.BasicCalculator` object, which exposes the following methods and observable events:

- `BasicCalculator.getState()`
- `BasicCalculator.setState(state, [options])`
- `BasicCalculator.setBlank([options])`
- `BasicCalculator.undo()`
- `BasicCalculator.redo()`
- `BasicCalculator.clearHistory()`
- `BasicCalculator.resize()`
- `BasicCalculator.focusFirstExpression()`
- `BasicCalculator.observeEvent('change', function () { /*...*/ })`
- `BasicCalculator.unobserveEvent('change')`
- `BasicCalculator.destroy()`

The methods and events above function exactly as described for the graphing calculator. The `updateSettings` method is more limited in that it only supports a subset of the options available in the graphing calculator.

#### `BasicCalculator.updateSettings([options])`

Updates the current calculator settings. This method behaves identically to the graphing calculator method, except the properties available for updating are limited to the basic calculator options.

For working examples of the four function and scientific calculators, see:

- `examples/fourfunction.html`
- `examples/scientific.html`

---

## Mathquill

Inside of the Desmos Calculator, we use [mathquill](http://www.mathquill.com) for all of our equation rendering. You can visit Mathquill at [www.mathquill.com](http://www.mathquill.com).

---

## Release Cycle

New stable versions of the calculator API are released once per year in April. At any given time, there is an experimental preview version, a stable version that is recommended for production, and older versions are frozen.

**Experimental:** The embedded calculator exposed through the API will track changes to the www.desmos.com calculator in real time. In the Experimental version, we may make breaking changes to the API methods and to the calculator's appearance at any time. The experimental version will generally be available for public preview and comment, but should not be used in production because of the possibility of breaking changes.

**Stable:** When a version of the API is stabilized, we will commit to not making any breaking changes to the API methods, and the embedded calculator will stop tracking changes to the www.desmos.com calculator. Important bug fixes that do not break compatibility are backported from Experimental to Stable. The Stable version is the version that is recommended for production use.

**Frozen:** When a new version of the API is stabilized, the previous Stable version will become Frozen. This means that no future changes will be made to it, and it will not receive bug fixes. Partners are encouraged to migrate from Frozen versions to the Stable version in order to keep receiving bug fixes.

---

## Community

We manage a pair of Google Groups for announcements and discussion of the API:

- **desmos-api-announce**: Official announcements of releases and previews of the API. This is a low volume list, and will only have a handful of posts per year. We recommend that all clients subscribe to stay up to date with new releases.
- **desmos-api-discuss**: General discussion and questions about the API. Posts to this group are open to the public.

---

## API Keys

In order to include the Desmos API in your page, you must supply an API key as a URL parameter:

```html
<script src="https://www.desmos.com/api/v1.11/calculator.js?apiKey=[YOUR_API_KEY_HERE]"></script>
```

To obtain your own API key, visit [desmos.com/my-api](https://desmos.com/my-api).

---

## Self-Hosting the API

Desmos partners have the option to either host the API on their own servers or load it from desmos.com accessed via the API key. The functionality available in the Desmos tools is the same in either case. Self-hosting gives partners the ability to have total separation in terms of infrastructure and privacy, as well as the option to use the tools without a network connection. Visit [desmos.com/my-api](https://desmos.com/my-api) to learn more about partnership options.
