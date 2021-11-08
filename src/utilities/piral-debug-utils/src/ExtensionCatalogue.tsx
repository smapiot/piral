import * as React from 'react';
import { useLocation } from 'react-router';

interface ExtensionCatalogueState {
  name: string;
  params: any;
}

export const ExtensionCatalogue: React.FC = () => {
  const { state } = useLocation<ExtensionCatalogueState>();

  if (state) {
    const { name = '', params = {} } = state;
    return <piral-extension name={name} params={JSON.stringify(params)} />;
  }

  return null;
};
