import * as React from 'react';
import { createPortal } from 'react-dom';
import { useGlobalStateContext } from './hooks';
import { renderElement } from './modules';

const renderHtmlEvent = 'render-html';
const renderContentEvent = 'render-content';
const forwardEventEvent = 'forward-event';

export const RootListener: React.FC = () => {
  const context = useGlobalStateContext();

  React.useLayoutEffect(() => {
    if (typeof document !== 'undefined') {
      const renderHtml = (ev: Event) => {
        ev.stopPropagation();
        const { target, props } = (ev as CustomEvent).detail;
        const [dispose, update] = renderElement(context, target, props);
        target.dispose = dispose;
        target.update = update;
      };
      const renderContent = (ev: Event) => {
        ev.stopPropagation();
        const { target, content, portalId } = (ev as CustomEvent).detail;
        const portal = createPortal(content, target);
        const dispose = () => context.hidePortal(portalId, portal);
        context.showPortal(portalId, portal);
        target.dispose = dispose;
      };
      const forwardEvent = (ev: Event) => {
        ev.stopPropagation();
        const { type, args } = (ev as CustomEvent).detail;
        context.emit(type, args);
      };
      document.body.addEventListener(renderHtmlEvent, renderHtml, false);
      document.body.addEventListener(forwardEventEvent, forwardEvent, false);
      window.addEventListener(renderContentEvent, renderContent, false);

      return () => {
        document.body.removeEventListener(renderHtmlEvent, renderHtml, false);
        document.body.removeEventListener(forwardEventEvent, forwardEvent, false);
        window.removeEventListener(renderContentEvent, renderContent, false);
      };
    }
  }, [context]);

  return null;
};
