import * as React from 'react';

export interface PageApi {
  current: HTMLElement;
  setCurrent(element: HTMLElement): void;
}

export const PageContext = React.createContext<PageApi>(undefined);

export function usePage() {
  return React.useContext(PageContext);
}

export const Page: React.FC = ({ children }) => {
  const [current, setCurrent] = React.useState(undefined);
  const value = React.useMemo(() => ({ current, setCurrent }), [current]);
  return <PageContext.Provider value={value}>{children}</PageContext.Provider>;
};
