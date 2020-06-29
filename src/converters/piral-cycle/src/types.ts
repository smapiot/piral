import { Stream } from 'xstream';
import { Driver, Drivers, MatchingMain, Main } from '@cycle/run';
import { MainDOMSource, VNode } from '@cycle/dom';
import { ForeignComponent, ExtensionSlotProps } from 'piral-core';

declare module 'piral-core/lib/types/custom' {
  interface PiletCustomApi extends PiletCycleApi {}

  interface PiralCustomComponentConverters<TProps> {
    cycle(component: CycleComponent<TProps>): ForeignComponent<TProps>;
  }
}

/**
 * The drivers which are available to a Cycle.js component hosted via this plugin's converter.
 */
export interface PiralDomDrivers<TProps> extends Drivers {
  /**
   * A DOM Driver giving access to the DOM where the component is mounted.
   */
  DOM: Driver<Stream<VNode>, MainDOMSource>;
  /**
   * A driver giving access to Piral specific properties passed down to the component.
   */
  props: Driver<void, Stream<TProps>>;
}

export interface CycleComponent<TProps> {
  /**
   * The component root.
   */
  root: MatchingMain<PiralDomDrivers<TProps>, Main>;
  /**
   * The type of the Cycle.js component.
   */
  type: 'cycle';
}

/**
 * Defines the provided set of Cycle.js Pilet API extensions.
 */
export interface PiletCycleApi {
  /**
   * Wraps a Cycle.js component for use in Piral.
   * @param component The Cycle.js component/main function to be wrapped.
   * @returns The Piral Cycle.js component.
   */
  fromCycle<TProps>(root: MatchingMain<PiralDomDrivers<TProps>, Main>): CycleComponent<TProps>;
  /**
   * Renders a Piral extension into a Cycle component.
   */
  CycleExtension: (props: ExtensionSlotProps<unknown>) => VNode;
}
