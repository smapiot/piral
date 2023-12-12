import * as React from 'react';
import { createPortal } from 'react-dom';
import { useGlobalStateContext } from './hooks';
import { renderElement } from './modules';

export const RootListener: React.FC = () => {
  const context = useGlobalStateContext();

  React.useLayoutEffect(() => {
    if (typeof document !== 'undefined') {
      const renderHtml = (ev: CustomEvent) => {
        ev.stopPropagation();
        const { target, props } = ev.detail;
        const [dispose, update] = renderElement(context, target, props);
        target.dispose = dispose;
        target.update = update;
      };
      const renderContent = (ev: CustomEvent) => {
        ev.stopPropagation();
        const { target, content, portalId } = ev.detail;
        const portal = createPortal(content, target);
        const dispose = () => context.hidePortal(portalId, portal);
        context.showPortal(portalId, portal);
        target.dispose = dispose;
      };
      document.body.addEventListener('render-html', renderHtml, false);
      window.addEventListener('render-content', renderContent, false);

      return () => {
        document.body.removeEventListener('render-html', renderHtml, false);
        window.removeEventListener('render-content', renderContent, false);
      };
    }
  }, [context]);

  return null;
};
