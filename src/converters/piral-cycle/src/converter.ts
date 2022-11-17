import type { BaseComponentProps, ForeignComponent } from 'piral-core';
import { makeDOMDriver } from '@cycle/dom';
import run, { MatchingMain, Main } from '@cycle/run';
import xs, { Stream } from 'xstream';
import { createExtension } from './extension';
import type { PiralDomDrivers } from './types';

export interface CycleConverterOptions {
  /**
   * The tag name of the root element into which a CycleExtension is rendered.
   * @default piral-slot
   */
  rootName?: string;
}

interface CycleState<TProps> {
  props$: Stream<TProps>;
  dispose(): void;
}

export function createConverter(config: CycleConverterOptions = {}) {
  const { rootName = 'piral-slot' } = config;
  const Extension = createExtension(rootName);
  const convert = <TProps extends BaseComponentProps, M extends MatchingMain<PiralDomDrivers<TProps>, M>>(
    main: M,
  ): ForeignComponent<TProps> => ({
    mount(el, props, ctx, locals: CycleState<TProps>) {
      locals.props$ = xs.create<TProps>();

      // The Cycle DOM element is not directly rendered into parent, but into a nested container.
      // This is done because Cycle "erases" information on the host element. If parent was used,
      // Piral related properties like data-portal-id could be removed, leading to things not working.
      const host = el.appendChild(document.createElement(rootName));

      const drivers: PiralDomDrivers<TProps> = {
        DOM: makeDOMDriver(host),
        props: () => locals.props$,
      };

      locals.dispose = run(main as Main, drivers);
      locals.props$.shamefullySendNext(props);
    },
    update(el, props, ctx, locals: CycleState<TProps>) {
      locals.props$.shamefullySendNext(props);
    },
    unmount(el, locals: CycleState<TProps>) {
      locals.props$.shamefullySendComplete();
      locals.dispose();
      locals.props$ = undefined;
    },
  });

  convert.Extension = Extension;
  return convert;
}
