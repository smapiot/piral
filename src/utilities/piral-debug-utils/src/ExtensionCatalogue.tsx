import * as React from 'react';

interface ExtensionCatalogueState {
  name: string;
  params: any;
}

interface StoreState {
  name: string;
  params: string;
}

interface Store {
  current: StoreState;
  observe(cb: (state: StoreState) => void): {
    (): void;
  };
}

const changeEvent = 'extension-catalogue-changed';

const store: Store = {
  current: undefined,
  observe(setState) {
    const handler = () => {
      setState(store.current);
    };
    window.addEventListener(changeEvent, handler);
    return () => {
      window.removeEventListener(changeEvent, handler);
    };
  },
};

export function changeExtensionCatalogueStore(state: ExtensionCatalogueState) {
  store.current = {
    ...state,
    params: JSON.stringify(state.params),
  };
  window.dispatchEvent(new CustomEvent(changeEvent));
}

export const ExtensionCatalogue: React.FC = () => {
  const [state, setState] = React.useState(store.current);

  React.useEffect(() => {
    return store.observe(setState);
  }, []);

  if (state) {
    const { name = '', params = '' } = state;
    // @ts-ignore
    return <piral-extension name={name} params={params} />;
  }

  return null;
};
