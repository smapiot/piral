import { BaseComponentProps, ForeignComponent } from 'piral-core';
import run, { MatchingMain, Main } from '@cycle/run';
import xs from 'xstream';
import { PiralDomDrivers } from '.';
import { makeDOMDriver } from '@cycle/dom';

export function createConverter() {
  return <TProps extends BaseComponentProps, M extends MatchingMain<PiralDomDrivers<TProps>, M>>(
    main: M,
  ): ForeignComponent<TProps> => {
    let props$ = xs.create<TProps>();
    let dispose = () => {};

    return {
      mount(parent, props) {
        const drivers: PiralDomDrivers<TProps> = {
          DOM: makeDOMDriver(parent),
          props: () => props$,
        };

        props$.shamefullySendNext(props);
        dispose = run(main as Main, drivers);
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
