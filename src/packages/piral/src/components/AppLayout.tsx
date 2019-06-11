import * as React from 'react';
import { useGlobalState, GlobalState } from 'piral-core';
import { LayoutComponents, LayoutProps } from '../types';

export interface AppLayoutProps extends LayoutComponents {
  Layout: React.ComponentType<LayoutProps>;
}

function selectContent(state: GlobalState) {
  return {
    selectedLanguage: state.app.language.selected,
    availableLanguages: state.app.language.available,
    currentLayout: state.app.layout.current,
    user: state.user.current,
  };
}

export const AppLayout: React.SFC<AppLayoutProps> = ({ Layout, children, ...props }) => {
  const content = useGlobalState(selectContent);
  return (
    <Layout {...content} {...props}>
      {children}
    </Layout>
  );
};
