import * as React from 'react';
import { useGlobalState, GlobalState } from 'piral-core';
import { MenuProps, LayoutProps } from '../types';

function selectContent(state: GlobalState) {
  return {
    selectedLanguage: state.app.language.selected,
    availableLanguages: state.app.language.available,
    currentLayout: state.app.layout.current,
    user: state.user.current,
  };
}

const defaultLayout: React.FC<LayoutProps> = ({ children }) => <>{children}</>;

export interface AppLayoutCreator {
  Layout: React.ComponentType<LayoutProps>;
  Menu: React.ComponentType<MenuProps>;
  Notifications: React.ComponentType;
  Search: React.ComponentType;
  Modals: React.ComponentType;
}

export function createAppLayout({ Layout = defaultLayout, ...props }: AppLayoutCreator): React.FC {
  return ({ children }) => {
    const content = useGlobalState(selectContent);
    return (
      <Layout {...content} {...props}>
        {children}
      </Layout>
    );
  };
}
