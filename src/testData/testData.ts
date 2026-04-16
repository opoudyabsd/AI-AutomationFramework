export const expressionEntryData = {
  quadraticExpression: 'y=x^2',
  sineExpression: 'sin(x)',
  invalidExpression: 'y=',
  numericExpression: '42',
  poiCoordinates: '2, 0',
  arithmeticExpression: '2+2',
  arithmeticResult: '4',
  malformedExpression: 'y=1/',   // trailing operator triggers .dcg-error; double-caret creates nested superscript instead
  cubicExpression: 'y=x^3',
  interceptExpression: 'y=x^2-4',
  leftInterceptCoords: '\u22122, 0',  // U+2212 Unicode minus — Desmos renders negatives with − not -
} as const;

export const graphSettingsData = {
  // The aria-label on .dcg-graph-outer[role="img"] is the only DOM representation of the
  // current axis range — axis tick numbers are canvas-rendered with no DOM text nodes.
  // Default view reads: "graph paper. X axis visible from negative 10 to 10. Y axis visible from ..."
  defaultViewportPattern: /negative 10 to 10/,

  // Minimum clicks of Zoom In or Zoom Out needed to move the viewport outside the default
  // [-10, 10] range and cause the "Default Viewport" reset button to appear in the DOM.
  zoomStepsToLeaveDefault: 3,
} as const;

export const e2eGraphSettingsData = {
  // Custom axis domain applied in TC-E2-E2E-001
  customXMin: '0',
  customXMax: '4',
  customYMin: '-1',
  customYMax: '5',
  // Default axis values used when resetting the viewport
  defaultXMin: '-10',
  defaultXMax: '10',
  defaultYMin: '-10',
  defaultYMax: '10',
  // After setting x ∈ [0, 4] the canvas aria-label reads "X axis visible from 0 to 4 …"
  customViewportXPattern: /from 0 to 4/,
  // TC-E2-E2E-003: horizontal pixel distance for the canvas pan drag step.
  // Negative = drag left (viewport pans right toward the right intercept region).
  panDistancePx: -50,
} as const;

export const graphCoordinates = {
  // Graph-unit coordinates for the default Desmos view (x ∈ [-10,10], y ∈ [-10,10]).
  // Converted to canvas pixels at runtime using canvas bounding box —
  // no hardcoded pixel values, so these work at any browser/viewport size.
  curveOnParabola: { graphX: 0,    graphY: 0  },  // y=x^2 vertex at (0, 0) — POI (minimum)
  sineWavePos1:    { graphX: 0,    graphY: 0  },  // sin(x) at origin (0, 0)
  sineWavePos2:    { graphX: 1.5,  graphY: 1  },  // sin(x) near (π/2, 1)
  rightIntercept:  { graphX: 2,    graphY: 0  },  // y=x^2-4 at (2, 0)
  leftIntercept:   { graphX: -2,   graphY: 0  },  // y=x^2-4 at (-2, 0)
} as const;
