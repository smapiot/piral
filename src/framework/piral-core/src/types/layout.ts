/**
 * The mapping of breakpoints to layout type index.
 * Choose up to three breakpoints.
 * In case of no breakpoint a default layout will be chosen.
 */
export type LayoutBreakpoints = [string?, string?, string?];

/**
 * The different known layout types.
 */
export type LayoutType = 'mobile' | 'tablet' | 'desktop';

/**
 * The mapping of the layout types to breakpoint index.
 */
export type LayoutTypes = [LayoutType, LayoutType, LayoutType];
