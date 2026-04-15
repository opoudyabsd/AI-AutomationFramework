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
