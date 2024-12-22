import { isfunc } from 'piral-base';
import { LayoutTypes, LayoutBreakpoints } from '../types';

export const defaultLayouts: LayoutTypes = ['desktop', 'tablet', 'mobile'];

export const defaultBreakpoints: LayoutBreakpoints = ['(min-width: 991px)', '(min-width: 481px)', '(max-width: 480px)'];

const mm =
  typeof window === 'undefined' || !isfunc(window.matchMedia)
    ? () => ({ matches: undefined })
    : (q: string) => window.matchMedia(q);

export function getCurrentLayout<T>(
  breakpoints: Array<string> = defaultBreakpoints,
  layouts: Array<T>,
  defaultLayout: T,
) {
  const query = breakpoints.findIndex((q) => mm(q).matches);
  const layout = layouts[query];
  return layout !== undefined ? layout : defaultLayout;
}
