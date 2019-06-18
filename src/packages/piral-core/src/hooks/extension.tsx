import * as React from 'react';
import { isfunc } from 'react-arbiter';
import { useGlobalState } from './globalState';
import { ExtensionSlotProps } from '../types';

function defaultRender(items: Array<React.ReactNode>) {
  return <>{items}</>;
}

/**
 * Hook that returns an extension slot.
 * @param name The name of the extension slot.
 */
export function useExtension<TData, TItem>(name: string) {
  const extensions = useGlobalState(s => s.components.extensions[name] || []);

  return React.useMemo(() => {
    const ExtensionView: React.SFC<ExtensionSlotProps> = ({ render = defaultRender, empty, params = {} }) =>
      render(
        extensions.length === 0 && isfunc(empty)
          ? [empty()]
          : extensions.map(({ component: Component, defaults = {} }, i) => (
              <Component
                key={`${Component.displayName || '_'}${i}`}
                params={{
                  ...defaults,
                  ...params,
                }}
              />
            )),
      );
    ExtensionView.displayName = `Extension_${name}`;
    return ExtensionView;
  }, [name, extensions]);
}
