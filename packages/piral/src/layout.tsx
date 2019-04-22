import * as React from 'react';
import { useGlobalState } from 'piral-core';

export const Layout: React.SFC = ({ children }) => {
  const layout = useGlobalState(s => s.app.layout.current);

  return (
    <pi-container>
      {/*<Notifications />*/}
      <pi-header>
        tbd
        {/*<SearchForm />
        <Menu />*/}
      </pi-header>
      <pi-content>{children}</pi-content>
      <pi-footer>tbd</pi-footer>
    </pi-container>
  );
};
