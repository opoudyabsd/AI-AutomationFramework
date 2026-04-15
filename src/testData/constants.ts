// Timeouts
export const MATHQUILL_RENDER_DELAY = 300;

// Selectors (reused across POMs / helpers)
export const SELECTORS = {
  EXPRESSION_LIST: '.dcg-expressionlist',
  EXPRESSION_ITEM: '.dcg-expressionitem[expr-id]',
  MATH_INPUT: '.dcg-mq-editable-field',
  EXPRESSION_ERROR: '.dcg-error',
  SLIDER_PLAY: '.dcg-slider-play-btn',
  TRACE_COORDINATES: '.dcg-trace-coordinates',
  EXPRESSION_ICON: '.dcg-expression-icon-container',
  // selector unverified — confirm against live DOM before committing
  STYLE_MENU: '.dcg-options-menu',
  // Two .dcg-graph-outer elements exist; only the main graph carries role="img".
  // Without [role="img"] the locator resolves to 2 elements and strict mode fails.
  GRAPH_CANVAS: '.dcg-graph-outer[role="img"]',
  // [aria-live].first() resolves to span.dcg-mq-aria-alert (MathQuill internal, permanently empty).
  // Exclude it so ariaLiveRegion points to Desmos's own announcement element.
  ARIA_LIVE_REGION: '[aria-live]:not(.dcg-mq-aria-alert)',
  COLOR_OPTION: '.dcg-color-tile',
} as const;

// Aria labels
export const ARIA = {
  ZOOM_IN: 'Zoom In',
  ZOOM_OUT: 'Zoom Out',
  // Live DOM: button aria-label is "Default Viewport", not "Reset to Default View".
  // The button only appears in the DOM AFTER at least one zoom action has been performed.
  RESET_VIEW: 'Default Viewport',
  GRAPH_SETTINGS: 'Graph Settings',
  ADD_ITEM: 'Add Item',
  OPEN_KEYPAD: 'Open Keypad',
  SHARE_GRAPH: 'Share Graph',
  // label unverified — confirm menu item accessible name against live DOM before committing
  EXPRESSION_MENU_ITEM: 'Expression',
} as const;

// Keyboard shortcuts — verify each combination in the live app before committing
export const SHORTCUTS = {
  ADD_EXPRESSION: 'Control+Alt+x',
  OPEN_STYLE: 'Control+Shift+O',
} as const;
