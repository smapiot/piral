import * as React from 'react';
import { useGlobalState } from '../hooks';
import { ExtensionSlotProps } from '../types';

function defaultRender(items: Array<React.ReactNode>) {
  return <>{items}</>;
}

export function getExtensionSlot(name: string) {
  const ExtensionSlotView: React.SFC<ExtensionSlotProps> = ({ render = defaultRender, empty, params }) => {
    const extensions = useGlobalState(s => s.components.extensions[name] || []);

    return render(
      extensions.length === 0 && typeof empty === 'function'
        ? [empty()]
        : extensions.map(({ component: Component }, i) => <Component key={i} params={params} />),
    );
  };
  ExtensionSlotView.displayName = `ExtensionSlot_${name}`;

  return ExtensionSlotView;
}
