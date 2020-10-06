import { BaseComponentProps, ForeignComponent } from 'piral-core';
import { makeDOMDriver } from '@cycle/dom';
import run, { MatchingMain, Main } from '@cycle/run';
import xs from 'xstream';
import { PiralDomDrivers } from './types';

export function createConverter() {
  return <TProps extends BaseComponentProps, M extends MatchingMain<PiralDomDrivers<TProps>, M>>(
    main: M,
  ): ForeignComponent<TProps> => {
    const props$ = xs.create<TProps>();
    let dispose = () => {};

    return {
      mount(parent, props) {
        // The Cycle DOM element is not directly rendered into parent, but into a nested container.
        // This is done because Cycle "erases" information on the host element. If parent was used,
        // Piral related properties like data-portal-id could be removed, leading to things not working.
        const host = document.createElement('slot');
        parent.appendChild(host);

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
}
