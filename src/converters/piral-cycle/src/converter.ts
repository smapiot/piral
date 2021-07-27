import type { BaseComponentProps, ForeignComponent } from 'piral-core';
import { makeDOMDriver } from '@cycle/dom';
import run, { MatchingMain, Main } from '@cycle/run';
import xs from 'xstream';
import { createExtension } from './extension';
import type { PiralDomDrivers } from './types';

export interface CycleConverterOptions {
  /**
   * The tag name of the root element into which a CycleExtension is rendered.
   * @default slot
   */
  rootName?: string;
}

export function createConverter(config: CycleConverterOptions = {}) {
  const { rootName = 'slot' } = config;
  const Extension = createExtension(rootName);
  const convert = <TProps extends BaseComponentProps, M extends MatchingMain<PiralDomDrivers<TProps>, M>>(
    main: M,
  ): ForeignComponent<TProps> => {
    const props$ = xs.create<TProps>();
    let dispose = () => {};

    return {
      mount(el, props) {
        const { piral } = props;
        // The Cycle DOM element is not directly rendered into parent, but into a nested container.
        // This is done because Cycle "erases" information on the host element. If parent was used,
        // Piral related properties like data-portal-id could be removed, leading to things not working.
        const host = document.createElement('slot');
        el.appendChild(host);
        
        el.addEventListener(
          'render-html',
          (ev: CustomEvent) => {
            ev.stopPropagation();
            piral.renderHtmlExtension(ev.detail.target, ev.detail.props);
          },
          false,
        );

        const drivers: PiralDomDrivers<TProps> = {
          DOM: makeDOMDriver(host),
          props: () => props$,
        };

        dispose = run(main as Main, drivers);
        props$.shamefullySendNext(props);
      },
      update(_, props) {
        props$.shamefullySendNext(props);
      },
      unmount() {
        props$.shamefullySendComplete();
        dispose();
      },
    };
  };

  convert.Extension = Extension;
  return convert;
}
