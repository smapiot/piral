import * as React from 'react';
import { useGlobalStateContext } from './hooks';
import { renderElement } from './modules';

export const RootListener: React.FC = () => {
  const context = useGlobalStateContext();

  React.useLayoutEffect(() => {
    if (typeof document !== 'undefined') {
      const handler = (ev: CustomEvent) => {
        ev.stopPropagation();
        const { target, props } = ev.detail;
        const [dispose, update] = renderElement(context, target, props);
        target.dispose = dispose;
        target.update = update;
      };
      document.body.addEventListener('render-html', handler, false);

      return () => {
        document.body.removeEventListener('render-html', handler, false);
      };
    }
  }, [context]);

  return null;
};
